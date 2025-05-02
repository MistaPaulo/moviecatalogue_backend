import mongoose from 'mongoose';
const { Schema } = mongoose;

// Reaproveitamos os sub-schemas já definidos
const awardsSchema = new Schema({
  wins:        Number,
  nominations: Number,
  text:        String
}, { _id: false });

const imdbSchema = new Schema({
  rating: Number,
  votes:  Number,
  id:     Number
}, { _id: false });

const tomatoesSchema = new Schema({
  viewer: {
    rating:     Number,
    numReviews: Number,
    meter:      Number,
    fresh:      Number,
    rotten:     Number
  },
  critic: {
    rating:      Number,
    numReviews:  Number,
    meter:       Number,
    rotten:      Number,
    lastUpdated: Date
  }
}, { _id: false });

const embeddedMovieSchema = new Schema({
  title:               { type: String, required: true },
  fullplot:            String,
  plot:                String,
  plot_embedding:      { type: [Number], index: '2dsphere' }, // mantém o array de floats
  genres:              [String],
  runtime:             Number,
  rated:               String,
  cast:                [String],
  poster:              String,
  languages:           [String],
  released:            Date,
  directors:           [String],
  writers:             [String],
  awards:              awardsSchema,
  lastupdated:         Date,
  year:                Number,
  imdb:                imdbSchema,
  countries:           [String],
  type:                String,
  tomatoes:            tomatoesSchema,
  num_mflix_comments:  { type: Number, default: 0 }
}, {
  collection: 'embedded_movies'
});

export default mongoose.model('EmbeddedMovie', embeddedMovieSchema);
