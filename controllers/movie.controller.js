import Movie from '../models/movie.model.js';

export const listMovies = async (req, res, next) => {
  try {
    const {
      search,
      genres,
      languages,
      yearMin, yearMax,
      ratingMin, ratingMax,
      director, cast,
      sortBy, sortOrder,
      page = 1,
    } = req.query;

    const limit = 12;
    const skip  = (page - 1) * limit;

    const filter = {};
    if (search) {
      const re = new RegExp(search, 'i');
      filter.$or = [{ title: re }, { cast: re }, { directors: re }];
    }
    if (genres) {
      const arr = Array.isArray(genres) ? genres : genres.split(',');
      filter.genres = { $in: arr };
    }
    if (languages) {
      const arr = Array.isArray(languages) ? languages : languages.split(',');
      filter.languages = { $in: arr };
    }
    if (yearMin || yearMax) {
      filter.year = {};
      if (yearMin) filter.year.$gte = parseInt(yearMin, 10);
      if (yearMax) filter.year.$lte = parseInt(yearMax, 10);
    }
    if (ratingMin || ratingMax) {
      filter['imdb.rating'] = {};
      if (ratingMin) filter['imdb.rating'].$gte = parseFloat(ratingMin);
      if (ratingMax) filter['imdb.rating'].$lte = parseFloat(ratingMax);
    }
    if (director) filter.directors = new RegExp(director, 'i');
    if (cast)      filter.cast      = new RegExp(cast, 'i');

    const allowed = ['title', 'year', 'imdb.rating'];
    const sort = {};
    if (sortBy && allowed.includes(sortBy)) {
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    }

    let query = Movie.find(filter);
    if (Object.keys(sort).length) {
      query = query.sort(sort);
    }

    const [movies, total] = await Promise.all([
      query.skip(skip).limit(limit),
      Movie.countDocuments(filter)
    ]);

    res.json({ movies, page: +page, total });
  } catch (err) {
    next(err);
  }
};

export const getMovieById = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Filme não encontrado' });
    }
    res.json(movie);
  } catch (err) {
    next(err);
  }
};

export const listGenres = async (req, res, next) => {
  try {
    const genres = await Movie.distinct('genres');
    res.json(genres);
  } catch (err) {
    next(err);
  }
};

export const listLanguages = async (req, res, next) => {
  try {
    const langs = await Movie.distinct('languages');
    res.json(langs);
  } catch (err) {
    next(err);
  }
};
