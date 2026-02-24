import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    likedMovies: {
      type: [Number], 
      default: []
    },
    watchHistory: {
      type: [Number],
      default: []
    },
    dislikedMovies: {
      type: [Number],
      default: []
    },
    genreScores: {
      type: Map,
      of: Number,
      default: {}
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;