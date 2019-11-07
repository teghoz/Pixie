var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var OrderSchema = new Schema({
  product: {
    type: String,
    required: true
  },
  customer: {
    type: String,
    required: true
  },
  quantity: Number,
  date_added: {
    type: Date,
    default: Date.now
  },
  approved: Boolean
});

var Order = mongoose.model('Order', OrderSchema);

module.exports = Order;