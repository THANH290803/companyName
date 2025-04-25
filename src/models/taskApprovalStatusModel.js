const mongoose = require('mongoose');

const taskApprovalStatusSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
});

const TaskApprovalStatus = mongoose.model('TaskApprovalStatus', taskApprovalStatusSchema);

module.exports = TaskApprovalStatus;
