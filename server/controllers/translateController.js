import axios from 'axios';
import FormData from 'form-data';
import Translation from '../models/Translation.js';
import User from '../models/User.js';

export const handleTranslation = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No audio file uploaded.' });
  }

  try {
    const formData = new FormData();
    formData.append('file', req.file.buffer, {
      filename: 'recording.webm',
      contentType: req.file.mimetype,
    });

    const mlServiceResponse = await axios.post(
      `${process.env.ML_SERVICE_URL}/predict`,
      formData,
      { headers: formData.getHeaders() }
    );

    // Save translation to DB linked to user
    const { translation, confidence, petType } = mlServiceResponse.data;
    const newTranslation = new Translation({
      user: req.user._id,
      petType,
      audioUrl: '', // Placeholder, can be updated with actual storage URL
      translation,
      confidence,
    });
    await newTranslation.save();

    // Update user's translationHistory
    await User.findByIdAndUpdate(req.user._id, {
      $push: { translationHistory: newTranslation._id }
    });

    res.json(mlServiceResponse.data);
  } catch (error) {
    console.error('Error proxying to ML service:', error.message);
    res.status(500).json({ message: 'Failed to get translation.' });
  }
};

export const getUserTranslations = async (req, res) => {
  try {
    const translations = await Translation.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(translations);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
