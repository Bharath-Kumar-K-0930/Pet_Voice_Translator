import os
import numpy as np
import librosa
import tensorflow as tf
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
import pickle

# --- Configurations ---
DATASET_PATH = "data/DOG_SOUND_DB_SAMPLES"
MODEL_SAVE_PATH = "model/dog_sound_model.h5"
ENCODER_SAVE_PATH = "model/dog_label_encoder.pkl"

SAMPLE_RATE = 22050
DURATION = 4  # seconds
N_MFCC = 40
MAX_PAD_LEN = 173  # standard MFCC frame length for 4 sec at 22.05kHz

# --- Step 1: Feature Extraction ---
def extract_features(file_path):
    try:
        y, sr = librosa.load(file_path, sr=SAMPLE_RATE, duration=DURATION)
        if len(y) < 0.5 * SAMPLE_RATE:  # skip very short clips
            return None
        mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=N_MFCC)
        if mfcc.shape[1] < MAX_PAD_LEN:
            pad_width = MAX_PAD_LEN - mfcc.shape[1]
            mfcc = np.pad(mfcc, pad_width=((0, 0), (0, pad_width)), mode='constant')
        else:
            mfcc = mfcc[:, :MAX_PAD_LEN]
        return mfcc
    except Exception as e:
        print(f"❌ Error processing {file_path}: {e}")
        return None

# --- Step 2: Load Data ---
def load_data():
    X, y = [], []
    classes = sorted(os.listdir(DATASET_PATH))
    print(f"📁 Found emotion classes: {classes}")

    for emotion in classes:
        emotion_dir = os.path.join(DATASET_PATH, emotion)
        if not os.path.isdir(emotion_dir):
            continue

        for file in os.listdir(emotion_dir):
            if file.endswith((".wav", ".mp3", ".ogg")):
                file_path = os.path.join(emotion_dir, file)
                features = extract_features(file_path)
                if features is not None:
                    X.append(features)
                    y.append(emotion)

    X = np.array(X)
    y = np.array(y)
    print(f"✅ Loaded {len(X)} samples with {len(np.unique(y))} emotion classes.")
    return X, y

# --- Step 3: Prepare Model Input ---
def prepare_data(X, y):
    X = np.expand_dims(X, -1)  # add channel dimension for CNN
    le = LabelEncoder()
    y_encoded = le.fit_transform(y)
    y_encoded = tf.keras.utils.to_categorical(y_encoded)
    return X, y_encoded, le

# --- Step 4: Build Model ---
def build_model(input_shape, num_classes):
    model = tf.keras.models.Sequential([
        tf.keras.layers.Conv2D(32, (3,3), activation='relu', input_shape=input_shape),
        tf.keras.layers.MaxPooling2D((2,2)),
        tf.keras.layers.Dropout(0.3),

        tf.keras.layers.Conv2D(64, (3,3), activation='relu'),
        tf.keras.layers.MaxPooling2D((2,2)),
        tf.keras.layers.Dropout(0.3),

        tf.keras.layers.Flatten(),
        tf.keras.layers.Dense(128, activation='relu'),
        tf.keras.layers.Dropout(0.3),
        tf.keras.layers.Dense(num_classes, activation='softmax')
    ])

    model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
    return model

# --- Step 5: Train and Save ---
def main():
    print("🚀 Loading and preparing data...")
    X, y = load_data()
    X, y_encoded, le = prepare_data(X, y)
    X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded)

    print("🧠 Building CNN model...")
    model = build_model(X_train.shape[1:], y_encoded.shape[1])

    print("🎯 Training model...")
    history = model.fit(
        X_train, y_train,
        validation_data=(X_test, y_test),
        epochs=50,
        batch_size=16,
        verbose=1
    )

    # Evaluate
    test_loss, test_acc = model.evaluate(X_test, y_test, verbose=0)
    print(f"✅ Test Accuracy: {test_acc:.2f}")

    # Save model and label encoder
    os.makedirs(os.path.dirname(MODEL_SAVE_PATH), exist_ok=True)
    model.save(MODEL_SAVE_PATH)
    with open(ENCODER_SAVE_PATH, "wb") as f:
        pickle.dump(le, f)

    print("💾 Model and label encoder saved successfully!")

if __name__ == "__main__":
    main()
