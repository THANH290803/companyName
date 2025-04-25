const express = require('express');
const TaskApprovalStatus = require('../models/taskApprovalStatusModel');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// ✅ Áp dụng authMiddleware cho tất cả route từ đây trở xuống
router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: TaskApprovalStatuses
 *   description: API quản lý trạng thái phê duyệt công việc
 */

/**
 * @swagger
 * /api/task-approval-status:
 *   get:
 *     summary: Lấy danh sách các trạng thái phê duyệt công việc
 *     tags: [TaskApprovalStatuses]
 *     responses:
 *       200:
 *         description: Trả về danh sách các trạng thái phê duyệt công việc
 */
router.get('/', async (req, res) => {
    try {
        const taskApprovalStatuses = await TaskApprovalStatus.find();
        res.json(taskApprovalStatuses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/task-approval-status/post:
 *   post:
 *     summary: Tạo trạng thái phê duyệt công việc mới
 *     tags: [TaskApprovalStatuses]
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
 *                 description: Tên trạng thái phê duyệt công việc
 *     responses:
 *       201:
 *         description: Trạng thái phê duyệt công việc đã được tạo
 *       400:
 *         description: Trạng thái phê duyệt công việc đã tồn tại
 */
router.post('/post', async (req, res) => {
    try {
        const { name } = req.body;

        // Kiểm tra trạng thái phê duyệt công việc đã tồn tại chưa
        const existing = await TaskApprovalStatus.findOne({ name });
        if (existing) {
            return res.status(400).json({ error: 'Task Approval Status already exists' });
        }

        const taskApprovalStatus = new TaskApprovalStatus({ name });
        await taskApprovalStatus.save();
        res.status(201).json(taskApprovalStatus);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/task-approval-status/{id}:
 *   get:
 *     summary: Lấy trạng thái phê duyệt công việc theo ID
 *     tags: [TaskApprovalStatuses]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID của trạng thái phê duyệt công việc
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Trả về thông tin trạng thái phê duyệt công việc
 *       404:
 *         description: Trạng thái phê duyệt công việc không tồn tại
 */
router.get('/:id', async (req, res) => {
    try {
        const taskApprovalStatus = await TaskApprovalStatus.findById(req.params.id);
        if (!taskApprovalStatus) return res.status(404).json({ error: 'Task Approval Status not found' });
        res.json(taskApprovalStatus);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/task-approval-status/{id}:
 *   put:
 *     summary: Cập nhật trạng thái phê duyệt công việc theo ID
 *     tags: [TaskApprovalStatuses]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID của trạng thái phê duyệt công việc
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
 *         description: Trạng thái phê duyệt công việc đã được cập nhật
 *       400:
 *         description: Trạng thái phê duyệt công việc đã tồn tại
 *       404:
 *         description: Trạng thái phê duyệt công việc không tồn tại
 */
router.put('/:id', async (req, res) => {
    try {
        const { name } = req.body;

        // Kiểm tra trùng tên với trạng thái phê duyệt công việc khác
        const existing = await TaskApprovalStatus.findOne({ name, _id: { $ne: req.params.id } });
        if (existing) {
            return res.status(400).json({ error: 'Task Approval Status name already exists' });
        }

        const updatedTaskApprovalStatus = await TaskApprovalStatus.findByIdAndUpdate(
            req.params.id,
            { name },
            { new: true }
        );
        if (!updatedTaskApprovalStatus) return res.status(404).json({ error: 'Task Approval Status not found' });
        res.json(updatedTaskApprovalStatus);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/task-approval-status/{id}:
 *   delete:
 *     summary: Xóa trạng thái phê duyệt công việc theo ID
 *     tags: [TaskApprovalStatuses]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID của trạng thái phê duyệt công việc
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Trạng thái phê duyệt công việc đã bị xóa
 *       404:
 *         description: Trạng thái phê duyệt công việc không tồn tại
 */
router.delete('/:id', async (req, res) => {
    try {
        const deletedTaskApprovalStatus = await TaskApprovalStatus.findByIdAndDelete(req.params.id);
        if (!deletedTaskApprovalStatus) return res.status(404).json({ error: 'Task Approval Status not found' });
        res.json({ message: 'Task Approval Status deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
