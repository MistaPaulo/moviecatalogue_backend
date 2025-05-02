import mongoose from 'mongoose';
import EmbeddedMovie from '../models/embedded.model.js';

export const getRecommendations = async (req, res, next) => {
  try {
    const { id } = req.params;
    const movie = await EmbeddedMovie.findById(id).lean();
    if (!movie || !Array.isArray(movie.plot_embedding)) {
      return res.json([]);
    }

    const embedding = movie.plot_embedding;
    const recs = await EmbeddedMovie.aggregate([
      {
        $vectorSearch: {
          index: 'default',           // nome do índice Vector Search
          path: 'plot_embedding',     // campo onde está o vetor
          queryVector: embedding,     // vetor de consulta
          limit: 6,                   // número de recomendações
          numCandidates: 1536         // quantos vetores avaliar internamente
        }
      },
      {
        // exclui o próprio filme
        $match: {
          _id: { $ne: new mongoose.Types.ObjectId(id) }
        }
      },
      {
        $limit: 5
      },
      {
        $project: {
          _id:    1,
          title:  1,
          poster: 1,
          plot:   1
        }
      }
    ]);

    res.json(recs);
  } catch (err) {
    next(err);
  }
};