import mongoose from 'mongoose';
const { Schema } = mongoose;

const sessionSchema = new Schema({
  user_id:  { type: Schema.Types.ObjectId, ref: 'User', required: true },
  jwt:      { type: String, required: true },
  createdAt:{ type: Date, default: Date.now, expires: '7d' }
});

export default mongoose.model('Session', sessionSchema);
