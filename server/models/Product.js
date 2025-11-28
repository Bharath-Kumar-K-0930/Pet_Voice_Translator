import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, enum: ['dog', 'cat', 'food', 'toys', 'grooming', 'health', 'dress options', 'equipments', 'pet furniture', 'beds', 'accessories', 'training tools', 'supplements'], required: true },
  petType: { type: String, enum: ['Dog', 'Cat', 'Both'], required: true },
  imageUrl: { type: String, required: true },
  stock: { type: Number, default: 100 },
  rating: { type: Number, default: 4.5 },
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
