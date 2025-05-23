import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
  name:       { type: String, required: true },
  email:      { type: String, required: true, unique: true, lowercase: true },
  password:   { type: String, required: true }
}, {
  timestamps: true
});

export default mongoose.model('User', userSchema);
