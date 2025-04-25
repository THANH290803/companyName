const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
  company_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', default: null },
  department_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', default: null },
  team_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', default: null },
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
