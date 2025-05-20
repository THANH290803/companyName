const mongoose = require('mongoose');

const taskStageSchema = new mongoose.Schema({
  project_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  title: { type: String }
}, {
  timestamps: true
});

module.exports = mongoose.model('TaskStage', taskStageSchema);
