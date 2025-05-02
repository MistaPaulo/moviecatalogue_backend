import jwt from 'jsonwebtoken';
import Session from '../models/session.model.js';

const JWT_SECRET = process.env.JWT_SECRET;

export default async function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid Authorization header' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const session = await Session.findOne({ jwt: token, user_id: payload.id });
    if (!session) {
      return res.status(401).json({ message: 'Invalid session' });
    }
    req.user = { id: payload.id, email: payload.email };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}
