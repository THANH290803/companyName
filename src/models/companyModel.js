const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  is_headquarter: { type: Boolean, default: false },
  phone: { type: String, default: null },
  email: { type: String, default: null }
}, { timestamps: false });

module.exports = mongoose.model('Company', companySchema);
