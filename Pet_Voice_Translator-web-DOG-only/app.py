from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import tensorflow as tf
import numpy as np
import librosa
import pickle
import os
from io import BytesIO
from pydub import AudioSegment
from pydub.utils import which
import uuid
import traceback

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# --- Configuration (Must match training script) ---
SAMPLE_RATE = 22050
DURATION = 4
N_MFCC = 40
MAX_PAD_LEN = 173
ENERGY_THRESHOLD = 0.01  # Silence detection threshold (increased for better detection)

# --- FFmpeg Setup ---
ffmpeg_path = which("ffmpeg")
ffprobe_path = which("ffprobe")

if not ffmpeg_path or not ffprobe_path:
    print("❌ FFmpeg or FFprobe not found. Please install and add to PATH.")
else:
    AudioSegment.converter = ffmpeg_path
    AudioSegment.ffprobe = ffprobe_path
    print(f"✅ FFmpeg found at: {ffmpeg_path}")
    print(f"✅ FFprobe found at: {ffprobe_path}")

# --- Load Model and Encoder ---
try:
    model = tf.keras.models.load_model('model/dog_sound_model.h5')
    with open('model/dog_label_encoder.pkl', 'rb') as f:
        le = pickle.load(f)
    print("✅ Model and label encoder loaded successfully.")
except Exception as e:
    print(f"❌ Error loading model or encoder: {e}")
    traceback.print_exc()
    model, le = None, None

def preprocess_audio(audio_file_path):
    """Processes a single audio file for prediction."""
    try:
        audio, sr = librosa.load(audio_file_path, sr=SAMPLE_RATE, duration=DURATION)

        # --- Silence or too low energy detection ---
        energy = np.mean(np.abs(audio))
        if energy < ENERGY_THRESHOLD:
            print(f"⚠️ Low-energy audio detected (energy={energy:.6f})")
            return None, "Pet audio not matched or unclear sound."

        # Pad or trim audio to exact duration
        if len(audio) < DURATION * SAMPLE_RATE:
            audio = np.pad(audio, (0, DURATION * SAMPLE_RATE - len(audio)), 'constant')
        else:
            audio = audio[:DURATION * SAMPLE_RATE]

        # Extract MFCC features (matching training)
        mfcc = librosa.feature.mfcc(y=audio, sr=SAMPLE_RATE, n_mfcc=N_MFCC)
        if mfcc.shape[1] < MAX_PAD_LEN:
            pad_width = MAX_PAD_LEN - mfcc.shape[1]
            mfcc = np.pad(mfcc, pad_width=((0, 0), (0, pad_width)), mode='constant')
        else:
            mfcc = mfcc[:, :MAX_PAD_LEN]

        # Add batch and channel dimension
        mfcc = mfcc[np.newaxis, ..., np.newaxis]
        return mfcc, None
    except Exception as e:
        print(f"Error in preprocessing: {e}")
        traceback.print_exc()
        return None, "Error processing audio."

def get_prediction_message(label):
    """Generates a user-friendly message based on the predicted label."""
    label = label.lower()
    messages = {
        'angry': "Your dog sounds angry. 😠",
        'attention': "Your dog is seeking attention. 🐶",
        'fighting': "Your dog is fighting. ⚔️",
        'happy': "Your dog sounds happy! 😊",
        'sad': "Your dog sounds sad. 😢"
    }
    return messages.get(label, "Emotion not clearly identified.")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    if not model or not le:
        return jsonify({'error': 'Prediction model is not loaded.'}), 500

    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file found.'}), 400

    audio_file = request.files['audio']
    audio_data = BytesIO(audio_file.read())

    # Generate a temporary WAV file name
    temp_wav = f"temp_{uuid.uuid4().hex}.wav"

    try:
        # Detect format and convert to wav if necessary
        audio_data.seek(0)
        try:
            audio = AudioSegment.from_file(audio_data, format="webm")
        except:
            audio_data.seek(0)
            audio = AudioSegment.from_file(audio_data, format="wav")
        audio.export(temp_wav, format="wav")

        # Preprocess audio for prediction
        processed_audio, msg = preprocess_audio(temp_wav)

        # Clean up temp files
        os.remove(temp_wav)

        if processed_audio is None:
            return jsonify({
                'emotion': 'Unknown',
                'message': msg or 'Pet audio not matched or unclear sound.',
                'confidence': '0%'
            })

        # Predict
        probabilities = model.predict(processed_audio, verbose=0)[0]
        predicted_index = np.argmax(probabilities)
        predicted_label = le.inverse_transform([predicted_index])[0]
        confidence = float(probabilities[predicted_index])

        # Optional confidence threshold
        if confidence < 0.70:
            return jsonify({
                'emotion': 'Unknown',
                'message': 'Pet audio not matched or unclear sound.',
                'confidence': f"{confidence*100:.2f}%"
            })

        message = get_prediction_message(predicted_label)

        return jsonify({
            'emotion': predicted_label,
            'message': message,
            'confidence': f"{confidence * 100:.2f}%"
        })

    except Exception as e:
        print(f"Error in prediction: {e}")
        traceback.print_exc()
        # Clean up temp files if they exist
        if os.path.exists(temp_wav):
            os.remove(temp_wav)
        return jsonify({'error': 'Failed to process audio file.'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)  # debug=True for development
