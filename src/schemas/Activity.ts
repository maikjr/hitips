import mongoose, { Document, Schema } from 'mongoose';

type Activity = Document & {
  client: Schema.Types.ObjectId,
  type: String,
  items: Schema.Types.ObjectId[],
}

const ActivitySchema = new Schema({
  client: {
      type: Schema.Types.ObjectId,
      ref: 'Tag',
      required: true,
  },
  type:{
    type: String,
    required: true,
  },
  items: [{
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  }]
}, {
  timestamps: true
});

export default mongoose.model<Activity>('Activity', ActivitySchema);