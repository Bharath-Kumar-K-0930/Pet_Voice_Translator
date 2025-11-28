import os
import librosa
import numpy as np
import pickle
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout, BatchNormalization
from keras.utils import to_categorical
from tqdm import tqdm
import random

# --- Configuration ---
DATA_PATH = "data/CAT_SOUND_DB_SAMPLES"
SAMPLE_RATE = 22050
DURATION = 4
N_MELS = 128

# --- Data augmentation functions ---
def time_stretch(audio, rate):
    return librosa.effects.time_stretch(audio, rate=rate)

def pitch_shift(audio, sr, n_steps):
    return librosa.effects.pitch_shift(audio, sr=sr, n_steps=n_steps)

def add_noise(audio, noise_factor=0.005):
    noise = np.random.randn(len(audio))
    augmented = audio + noise_factor * noise
    return np.clip(augmented, -1.0, 1.0)

def extract_features(file_path, augment=False):
    try:
        audio, sr = librosa.load(file_path, sr=SAMPLE_RATE, duration=DURATION)
        if len(audio) < DURATION * SAMPLE_RATE:
            audio = np.pad(audio, (0, DURATION * SAMPLE_RATE - len(audio)), 'constant')
        else:
            audio = audio[:DURATION * SAMPLE_RATE]

        # Apply augmentation
        if augment:
            choice = random.choice(['time', 'pitch', 'noise', 'none'])
            if choice == 'time':
                rate = random.uniform(0.9, 1.1)
                audio = time_stretch(audio, rate)
                if len(audio) < DURATION*SAMPLE_RATE:
                    audio = np.pad(audio, (0, DURATION*SAMPLE_RATE - len(audio)), 'constant')
                else:
                    audio = audio[:DURATION*SAMPLE_RATE]
            elif choice == 'pitch':
                n_steps = random.randint(-2, 2)
                audio = pitch_shift(audio, sr, n_steps)
            elif choice == 'noise':
                audio = add_noise(audio)

        mel = librosa.feature.melspectrogram(y=audio, sr=sr, n_mels=N_MELS)
        log_mel = librosa.power_to_db(mel, ref=np.max)
        log_mel = (log_mel - log_mel.min()) / (log_mel.max() - log_mel.min())
        return log_mel
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return None

# --- Load dataset and augment ---
features, labels = [], []

for folder in os.listdir(DATA_PATH):
    folder_path = os.path.join(DATA_PATH, folder)
    if os.path.isdir(folder_path):
        for file in tqdm(os.listdir(folder_path), desc=f"Processing {folder}"):
            file_path = os.path.join(folder_path, file)
            # Original
            mel_spec = extract_features(file_path)
            if mel_spec is not None:
                features.append(mel_spec)
                labels.append(folder)
            # Augmented 2x per file
            for _ in range(2):
                mel_aug = extract_features(file_path, augment=True)
                if mel_aug is not None:
                    features.append(mel_aug)
                    labels.append(folder)

X = np.array(features)[..., np.newaxis]
le = LabelEncoder()
y = le.fit_transform(labels)
y_cat = to_categorical(y, num_classes=len(np.unique(y)))

# Split
X_train, X_test, y_train, y_test = train_test_split(X, y_cat, test_size=0.2, random_state=42, stratify=y_cat)

# --- Improved CNN with BatchNorm ---
model = Sequential([
    Conv2D(32, (3,3), activation='relu', input_shape=X_train.shape[1:]),
    BatchNormalization(),
    MaxPooling2D((2,2)),

    Conv2D(64, (3,3), activation='relu'),
    BatchNormalization(),
    MaxPooling2D((2,2)),

    Conv2D(128, (3,3), activation='relu'),
    BatchNormalization(),
    MaxPooling2D((2,2)),

    Flatten(),
    Dense(256, activation='relu'),
    Dropout(0.5),
    Dense(len(np.unique(y)), activation='softmax')
])

model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
model.summary()

# Train
history = model.fit(X_train, y_train, epochs=40, batch_size=32, validation_split=0.2)

# Evaluate
loss, acc = model.evaluate(X_test, y_test)
print(f"Test Accuracy: {acc*100:.2f}%")

# Save
model.save("petspeak_model.h5")
with open("label_encoder.pkl", "wb") as f:
    pickle.dump(le, f)
np.save("X_features.npy", X)
np.save("y_labels.npy", y)

print("✅ Augmented model training complete!")
