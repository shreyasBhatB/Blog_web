import mongoose from 'mongoose';

// Blog Schema
const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
      type: String,
      required: true,
    }
  ,
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set to the current date/time when a post is created
  },
});

// Create a model for the Blog
const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
