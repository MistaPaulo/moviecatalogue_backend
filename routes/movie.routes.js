import express from 'express';
import {
  listMovies,
  getMovieById,
  listGenres,
  listLanguages
} from '../controllers/movie.controller.js';

const router = express.Router();

router.get('/genres', listGenres);
router.get('/languages', listLanguages);

router.get('/', listMovies);
router.get('/:id', getMovieById);

export default router;
