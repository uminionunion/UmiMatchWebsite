
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import { db } from './db.js';
import umiMatchRouter from './umimatch.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Shared data directory for SQLite databases
const DATA_DIRECTORY = process.env.DATA_DIRECTORY || path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIRECTORY)) {
  fs.mkdirSync(DATA_DIRECTORY, { recursive: true });
}

// Middleware for authentication
const authMiddleware = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ error: 'Not authenticated' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-key');
    req.user = payload;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// We implement a simplified version of the auth logic here to keep it standalone 
// but compatible with the existing JWT secrets and user IDs.
app.use('/api/auth', (req, res, next) => {
  // In a full standalone, you'd have a separate auth router.
  // For this shared-data requirement, we assume the JWT secret is identical to uHub.
  next();
});

app.use(umiMatchRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`UmiMatch Standalone API running on port ${PORT}`);
});
