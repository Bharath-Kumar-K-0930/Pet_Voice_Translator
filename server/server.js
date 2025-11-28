import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import translateRoutes from './routes/translate.js';
import cartRoutes from './routes/cart.js';
import orderRoutes from './routes/orders.js';
import favoritesRoutes from './routes/favorites.js';

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Updated Database Connection Logic ---
// Ensure the MONGO_URI is loaded from the .env file
const dbURI = process.env.MONGO_URI;
if (!dbURI) {
  console.error('❌ MONGO_URI not found in .env file. Please add it.');
  process.exit(1); // Exit the application if the DB connection string is missing
}

console.log(`Attempting to connect to MongoDB at: ${dbURI}`);

mongoose.connect(dbURI)
  .then(() => console.log('✅ MongoDB Connected Successfully to local database.'))
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.error('❗ Please ensure your local MongoDB server is running.');
  });
// --- End of Updated Logic ---

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/translate', translateRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/favorites', favoritesRoutes);

// Health Check
app.get('/', (req, res) => {
  res.send('Pet Translator API is running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server is listening on port ${PORT}`));
