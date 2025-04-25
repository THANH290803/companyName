const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assigned_to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    status_id: { type: mongoose.Schema.Types.ObjectId, ref: 'TaskStatus', default: null },
    approval_status_id: { type: mongoose.Schema.Types.ObjectId, ref: 'TaskApprovalStatus', default: null },
    deadline: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
