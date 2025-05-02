import mongoose from 'mongoose';
const { Schema } = mongoose;

const commentSchema = new Schema({
  name:      String,
  email:     String,
  movie_id:  { type: Schema.Types.ObjectId, ref: 'Movie', required: true },
  text:      String,
  date:      { type: Date, default: Date.now }
});

export default mongoose.model('Comment', commentSchema);
