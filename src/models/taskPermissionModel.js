const mongoose = require('mongoose');

const taskPermissionSchema = new mongoose.Schema({
  task_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  permission_type: { type: Number, required: true }, // 0: read, 1: write, 2: admin, etc.
});

module.exports = mongoose.model('TaskPermission', taskPermissionSchema);
