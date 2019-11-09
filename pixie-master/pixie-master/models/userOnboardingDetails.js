var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserOnBoardingDetailSchema = new Schema({
  merchantId: String,
  merchantIdInPayPal: String,
  permissionsGranted: Boolean,
  accountStatus: String,
  consentStatus: Boolean,
  productIntentID: String,
  isEmailConfirmed: Boolean,
  returnMessage: String,
  seller: {
    type: String,
    required: true
  },
  date_added: {
    type: Date,
    default: Date.now
  }
});

var UserOnBoardingDetails = mongoose.model('UserOnBoardingDetails', UserOnBoardingDetailSchema);

module.exports = UserOnBoardingDetails;