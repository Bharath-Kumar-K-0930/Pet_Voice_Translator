import mongoose from 'mongoose';

const translationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  petType: { type: String, enum: ['dog', 'cat'], required: true },
  audioUrl: { type: String, required: true }, // URL to stored audio file (future enhancement)
  translation: { type: String, required: true },
  confidence: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.model('Translation', translationSchema);
