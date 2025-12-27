import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  size: {
    type: String,
    trim: true
  },
  totalAmount: {
    type: Number,
    required: true,
    default: 0
  },
  advanceAmount: {
    type: Number,
    default: 0
  },
  remainingAmount: {
    type: Number,
    default: 0
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Partial', 'Paid'],
    default: 'Pending'
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
  deliveryDate: {
    type: Date
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Auto-calculate remaining amount and payment status before save
orderSchema.pre('save', function(next) {
  this.remainingAmount = this.totalAmount - this.advanceAmount;
  
  if (this.remainingAmount === 0 && this.advanceAmount > 0) {
    this.paymentStatus = 'Paid';
  } else if (this.advanceAmount > 0) {
    this.paymentStatus = 'Partial';
  } else {
    this.paymentStatus = 'Pending';
  }
  
  next();
});

const Order = mongoose.model('Order', orderSchema);

export default Order;

