const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: false },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  company_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', default: null },
  department_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', default: null },
  team_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', default: null },
  start_date: { type: Date, default: null },  // Allow null values
  end_date: { type: Date, default: null },    // Allow null values
  created_at: { type: Date, default: Date.now }
}, { timestamps: false });

module.exports = mongoose.model('Project', projectSchema);
