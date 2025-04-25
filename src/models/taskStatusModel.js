const mongoose = require('mongoose');

const taskStatusSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
});

const TaskStatus = mongoose.model('TaskStatus', taskStatusSchema);

module.exports = TaskStatus;
