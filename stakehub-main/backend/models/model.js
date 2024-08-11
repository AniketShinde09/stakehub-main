const mongoose = require('mongoose');

const pendingOrderSchema = new mongoose.Schema({
  buyer_qty: Number,
  buyer_price: Number,
  seller_price: Number,
  seller_qty: Number
}, { collection: 'PendingOrderTable' });

const completedOrderSchema = new mongoose.Schema({
  price: Number,
  qty: Number
}, { collection: 'CompletedOrderTable' });

const PendingOrder = mongoose.model('PendingOrder', pendingOrderSchema);
const CompletedOrder = mongoose.model('CompletedOrder', completedOrderSchema);

module.exports = { PendingOrder, CompletedOrder };
