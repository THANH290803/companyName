const express = require('express');
const TaskStatus = require('../models/taskStatusModel');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// ✅ Áp dụng authMiddleware cho tất cả route từ đây trở xuống
router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: TaskStatuses
 *   description: API quản lý trạng thái công việc
 */

/**
 * @swagger
 * /api/task-status:
 *   get:
 *     summary: Lấy danh sách các trạng thái công việc
 *     tags: [TaskStatuses]
 *     responses:
 *       200:
 *         description: Trả về danh sách các trạng thái công việc
 */
router.get('/', async (req, res) => {
    try {
        const taskStatuses = await TaskStatus.find();
        res.json(taskStatuses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/task-status/post:
 *   post:
 *     summary: Tạo trạng thái công việc mới
 *     tags: [TaskStatuses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Tên trạng thái công việc
 *     responses:
 *       201:
 *         description: Trạng thái công việc đã được tạo
 *       400:
 *         description: Trạng thái công việc đã tồn tại
 */
router.post('/post', async (req, res) => {
    try {
        const { name } = req.body;

        // Kiểm tra trạng thái công việc đã tồn tại chưa
        const existing = await TaskStatus.findOne({ name });
        if (existing) {
            return res.status(400).json({ error: 'Task Status already exists' });
        }

        const taskStatus = new TaskStatus({ name });
        await taskStatus.save();
        res.status(201).json(taskStatus);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/task-status/{id}:
 *   get:
 *     summary: Lấy trạng thái công việc theo ID
 *     tags: [TaskStatuses]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID của trạng thái công việc
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Trả về thông tin trạng thái công việc
 *       404:
 *         description: Trạng thái công việc không tồn tại
 */
router.get('/:id', async (req, res) => {
    try {
        const taskStatus = await TaskStatus.findById(req.params.id);
        if (!taskStatus) return res.status(404).json({ error: 'Task Status not found' });
        res.json(taskStatus);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/task-status/{id}:
 *   put:
 *     summary: Cập nhật trạng thái công việc theo ID
 *     tags: [TaskStatuses]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID của trạng thái công việc
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Trạng thái công việc đã được cập nhật
 *       400:
 *         description: Trạng thái công việc đã tồn tại
 *       404:
 *         description: Trạng thái công việc không tồn tại
 */
router.put('/:id', async (req, res) => {
    try {
        const { name } = req.body;

        // Kiểm tra trùng tên với trạng thái công việc khác
        const existing = await TaskStatus.findOne({ name, _id: { $ne: req.params.id } });
        if (existing) {
            return res.status(400).json({ error: 'Task Status name already exists' });
        }

        const updatedTaskStatus = await TaskStatus.findByIdAndUpdate(
            req.params.id,
            { name },
            { new: true }
        );
        if (!updatedTaskStatus) return res.status(404).json({ error: 'Task Status not found' });
        res.json(updatedTaskStatus);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/task-status/{id}:
 *   delete:
 *     summary: Xóa trạng thái công việc theo ID
 *     tags: [TaskStatuses]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID của trạng thái công việc
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Trạng thái công việc đã bị xóa
 *       404:
 *         description: Trạng thái công việc không tồn tại
 */
router.delete('/:id', async (req, res) => {
    try {
        const deletedTaskStatus = await TaskStatus.findByIdAndDelete(req.params.id);
        if (!deletedTaskStatus) return res.status(404).json({ error: 'Task Status not found' });
        res.json({ message: 'Task Status deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
