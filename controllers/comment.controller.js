import Comment from '../models/comment.model.js';
import User from '../models/user.model.js';
import Movie from '../models/movie.model.js';
import EmbeddedMovie from '../models/embedded.model.js';

export const listComments = async (req, res, next) => {
  try {
    const page  = parseInt(req.query.page, 10) || 1;
    const limit = 10;
    const skip  = (page - 1) * limit;

    const [comments, total] = await Promise.all([
      Comment.find({ movie_id: req.params.id })
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit),
      Comment.countDocuments({ movie_id: req.params.id })
    ]);

    const totalPages = Math.max(1, Math.ceil(total / limit));
    res.json({ comments, page, totalPages });
  } catch (err) {
    next(err);
  }
};

export const addComment = async (req, res, next) => {
  try {
    const { text } = req.body;
    const user = await User.findById(req.user.id);
    const comment = new Comment({
      name:     user.name,
      email:    user.email,
      movie_id: req.params.id,
      text
    });
    await comment.save();

    // Increment on both collections
    await Movie.findByIdAndUpdate(
      req.params.id,
      { $inc: { num_mflix_comments: 1 } }
    );
    await EmbeddedMovie.findByIdAndUpdate(
      req.params.id,
      { $inc: { num_mflix_comments: 1 } }
    );

    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
};

export const editComment = async (req, res, next) => {
  try {
    const { text } = req.body;
    const { id: movieId, commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comentário não encontrado' });
    }
    if (comment.movie_id.toString() !== movieId) {
      return res.status(400).json({ message: 'Comentário não pertence a este filme' });
    }
    if (comment.email !== req.user.email) {
      return res.status(403).json({ message: 'Não autorizado' });
    }
    comment.text = text;
    comment.date = Date.now();
    await comment.save();
    res.json(comment);
  } catch (err) {
    next(err);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const { id: movieId, commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comentário não encontrado' });
    }
    if (comment.movie_id.toString() !== movieId) {
      return res.status(400).json({ message: 'Comentário não pertence a este filme' });
    }
    // Only owner can delete
    if (comment.email !== req.user.email) {
      return res.status(403).json({ message: 'Não autorizado' });
    }

    await Comment.deleteOne({ _id: commentId });

    // Decrement on both collections
    await Movie.findByIdAndUpdate(
      movieId,
      { $inc: { num_mflix_comments: -1 } }
    );
    await EmbeddedMovie.findByIdAndUpdate(
      movieId,
      { $inc: { num_mflix_comments: -1 } }
    );

    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
