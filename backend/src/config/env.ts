import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../../.env') });

export const env = {
  port: parseInt(process.env.PORT || '5000', 10),
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/crowdshield',
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'change_this_to_a_long_random_secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
};

// Simple validation
if (!process.env.MONGODB_URI) {
  console.warn('WARNING: MONGODB_URI environment variable is not defined. Using default: mongodb://localhost:27017/crowdshield');
}

if (!process.env.JWT_SECRET) {
  console.warn('WARNING: JWT_SECRET environment variable is not defined. Using default unsafe key.');
}
