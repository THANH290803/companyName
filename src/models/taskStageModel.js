const mongoose = require('mongoose');

const taskStageSchema = new mongoose.Schema({
  task_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  title: { type: String },
  deadline: { type: Date },
  completed_at: { type: Date }
}, {
  timestamps: true
});

module.exports = mongoose.model('TaskStage', taskStageSchema);
