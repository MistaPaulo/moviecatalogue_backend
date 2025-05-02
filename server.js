import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';

// Routes
import authRoutes      from './routes/auth.routes.js';
import userRoutes      from './routes/user.routes.js';
import movieRoutes     from './routes/movie.routes.js';
import commentRoutes   from './routes/comment.routes.js';
import recommendRoutes from './routes/recommend.routes.js';

// Middleware
import authenticateJWT from './middleware/auth.jwt.js';
import errorHandler    from './middleware/error.handler.js';

const app = express();

// Conectar ao MongoDB (e carregar dotenv)
connectDB();

app.use(cors());
app.use(express.json());

// Montagem das rotas
app.use('/api/auth', authRoutes);
app.use('/api/users', authenticateJWT, userRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/movies/:id/comments', commentRoutes);
app.use('/api/movies', recommendRoutes);

// Handler central de erros
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});