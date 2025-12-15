# Pet Voice Translator

An academic project that combines AI-powered pet voice translation with an e-commerce platform for pet care products. This monorepo contains a full-stack web application featuring machine learning models for translating cat and dog vocalizations into human-understandable emotions.

## Features

### 🐱 Pet Voice Translation
- **Cat Translator**: Recognizes 10 different cat emotions using deep learning
  - Angry, Defense, Fighting, Happy, HuntingMind, Mating, MotherCall, Paining, Resting, Warning
- **Dog Translator**: Recognizes 5 different dog emotions
  - Angry, Attention, Fighting, Happy, Sad

### 🛒 Pet Care E-Commerce Platform
- User authentication and registration
- Product catalog with search functionality
- Shopping cart and favorites system
- Order placement and tracking
- Order details and history

## Tech Stack

### Frontend
- **React 18** with Vite for fast development
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API communication
- **Lucide React** for icons

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose for data persistence
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Multer** for file uploads

### AI/ML Components
- **Python Flask** applications for cat and dog translation
- **TensorFlow/Keras** for neural network models
- **scikit-learn** for data preprocessing
- **librosa** for audio processing

## Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Python 3.8+**
- **pip** (Python package manager)
- **MongoDB** (local or cloud instance)
- **Git**

## Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Pet_Voice_Translator-gemini
   ```

2. **Install root dependencies:**
   ```bash
   npm install
   ```

3. **Install client dependencies:**
   ```bash
   npm run install-all
   ```
   This command will install dependencies for the root, client, and server packages.

4. **Set up environment variables:**

   Create a `.env` file in the `server` directory with the following variables:
   ```
   MONGO_URI=mongodb://localhost:27017/pet-voice-translator
   JWT_SECRET=your-secret-key-here
   PORT=5000
   ```

5. **Install Python dependencies for AI models:**

   For Cat Translator:
   ```bash
   cd Pet_Voice_Translator-web-CAT-only
   pip install -r requirements.txt
   ```

   For Dog Translator:
   ```bash
   cd Pet_Voice_Translator-web-DOG-only
   pip install -r requirements.txt
   ```

## Usage

### Development Mode
Run all services concurrently:
```bash
npm run dev
```

This will start:
- React client on `http://localhost:5173`
- Express server on `http://localhost:5000`
- Cat translator Flask app
- Dog translator Flask app

### Individual Services

**Start only the client:**
```bash
cd client
npm run dev
```

**Start only the server:**
```bash
cd server
npm run dev
```

**Start AI translation services individually:**
```bash
# Cat translator
cd Pet_Voice_Translator-web-CAT-only
python app.py

# Dog translator
cd Pet_Voice_Translator-web-DOG-only
python app.py
```

## Project Structure

```
Pet_Voice_Translator-gemini/
├── client/                          # React frontend
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   ├── pages/                   # Page components
│   │   ├── context/                 # React context providers
│   │   └── assets/                  # Static assets
│   ├── public/                      # Public static files
│   └── package.json
├── server/                          # Express.js backend
│   ├── controllers/                 # Route controllers
│   ├── models/                      # MongoDB models
│   ├── routes/                      # API routes
│   ├── middleware/                  # Custom middleware
│   ├── utils/                       # Utility functions
│   └── server.js                    # Main server file
├── Pet_Voice_Translator-web-CAT-only/  # Cat translation AI
│   ├── app.py                       # Flask application
│   ├── model/                       # Trained ML models
│   ├── data/                        # Training data
│   └── templates/                   # HTML templates
├── Pet_Voice_Translator-web-DOG-only/  # Dog translation AI
│   ├── app.py                       # Flask application
│   ├── model/                       # Trained ML models
│   ├── data/                        # Training data
│   └── templates/                   # HTML templates
├── models/                          # Shared ML models
├── CAT_SOUND_DB_SAMPLES/            # Cat sound database
├── DOG_SOUND_DB_SAMPLES/            # Dog sound database
├── package.json                     # Root package.json
└── README.md                        # This file
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product (admin)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `DELETE /api/cart/:id` - Remove item from cart

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order details

### Translation
- `POST /api/translate/cat` - Translate cat audio
- `POST /api/translate/dog` - Translate dog audio

## Contributing

This is an academic project. For contributions:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Sound databases used for training the ML models
- Open-source libraries and frameworks
- Academic research on animal vocalization patterns
