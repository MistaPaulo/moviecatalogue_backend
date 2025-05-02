import mongoose from 'mongoose';
const { Schema } = mongoose;

// Sub-schema para os campos de awards
const awardsSchema = new Schema({
  wins:        Number,
  nominations: Number,
  text:        String
}, { _id: false });

// Sub-schema para o bloco imdb
const imdbSchema = new Schema({
  rating: Number,
  votes:  Number,
  id:     Number
}, { _id: false });

// Sub-schema para os ratings do Tomatoes
const tomatoesSchema = new Schema({
  viewer: {
    rating:     Number,
    numReviews: Number,
    meter:      Number,
    fresh:      Number,
    rotten:     Number
  },
  critic: {
    rating:     Number,
    numReviews: Number,
    meter:      Number,
    rotten:     Number,
    lastUpdated: Date
  }
}, { _id: false });

const movieSchema = new Schema({
  title:              { type: String, required: true },
  fullplot:           String,
  plot:               String,
  genres:             [String],
  runtime:            Number,
  rated:              String,
  cast:               [String],
  poster:             String,
  languages:          [String],
  released:           Date,
  directors:          [String],
  writers:            [String],
  awards:             awardsSchema,
  lastupdated:        Date,
  year:               Number,
  imdb:               imdbSchema,
  countries:          [String],
  type:               String,
  tomatoes:           tomatoesSchema,
  num_mflix_comments: { type: Number, default: 0 }
}, {
  collection: 'movies'
});

// garante que tens os indexes corretos no filme (se precisares)
movieSchema.index({ title: 'text', plot: 'text' });

export default mongoose.model('Movie', movieSchema);
