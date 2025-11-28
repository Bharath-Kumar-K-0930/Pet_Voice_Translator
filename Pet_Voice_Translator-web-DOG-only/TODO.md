# TODO: Train and Test Dog Voice Emotion Model

- [ ] Modify train_model.py to use dog data: Update DATASET_PATH to "data/DOG_SOUND_DB_SAMPLES", MODEL_SAVE_PATH to "model/dog_sound_model.h5", ENCODER_SAVE_PATH to "model/dog_label_encoder.pkl"
- [ ] Run train_model.py to train and save the dog model
- [ ] Update app.py to load the dog model and label encoder, and replace cat emotion messages with dog-specific ones (Angry, Attention, Fighting, Happy, sad)
- [ ] Test the app by running it and verifying predictions on dog audio
