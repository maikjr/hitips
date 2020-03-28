import mongoose, { Document, Schema } from 'mongoose';

type Product = Document & {
  url: String,
  title: String,
  description: String,
  thumb: String,
  price: String,
};

const ProductSchema = new Schema({
  url: {
    type: String,
    lowercase: true,
    trim: true,
    unique: true,
    required: true
  },
  title: {
    type: String,
    trim: true,
    unique: true,
    required: true
  },
  description: {
    type: String,
    trim: true,
    required: true
  },
  thumb: {
    type: String,
    trim: true,
    required: true
  },
  price: {
    type: String,
    trim: true,
    required: true
  },
},{
  timestamps: true
});

export default mongoose.model<Product>('Product', ProductSchema);
