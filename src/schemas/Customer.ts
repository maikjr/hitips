import mongoose, { Document, Schema } from 'mongoose';

type Customer = Document & {
  store?: String,
}

const CustomerSchema = new Schema({
  store: String,
}, {
  timestamps: true
});

export default mongoose.model<Customer>('Client', CustomerSchema);