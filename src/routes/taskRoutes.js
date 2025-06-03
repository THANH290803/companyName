const express = require('express');
const Task = require('../models/taskModel');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: API quản lý nhiệm vụ
 */

/**
 * @swagger
 * /api/task:
 *   get:
 *     summary: Lấy danh sách các task
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: Trả về danh sách task
 */
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find().populate('created_by assigned_to status_id task_stage_id');
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


/**
 * @swagger
 * /api/task/filter/{status_id}/{task_stage_id}:
 *   get:
 *     summary: Lấy danh sách task theo status_id và task_stage_id
 *     tags: [Tasks]
 *     parameters:
 *       - name: status_id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID trạng thái task
 *       - name: task_stage_id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID giai đoạn task
 *     responses:
 *       200:
 *         description: Trả về danh sách task phù hợp
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       500:
 *         description: Lỗi server
 */
router.get('/filter/:status_id/:task_stage_id', async (req, res) => {
    try {
        const { status_id, task_stage_id } = req.params;

        const tasks = await Task.find({
            status_id,
            task_stage_id
        }).populate('created_by assigned_to status_id task_stage_id');

        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


/**
 * @swagger
 * /api/task/post:
 *   post:
 *     summary: Tạo task mới
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, created_by]
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               created_by:
 *                 type: string
 *               assigned_to:
 *                 type: string
 *               status_id:
 *                 type: string
 *               task_stage_id:
 *                 type: string
 *               deadline:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Task đã được tạo
 */
router.post('/post', async (req, res) => {
    try {
        const task = new Task(req.body);
        await task.save();
        res.status(201).json(task);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/task/{id}:
 *   get:
 *     summary: Lấy task theo ID
 *     tags: [Tasks]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Trả về task
 *       404:
 *         description: Không tìm thấy task
 */
router.get('/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate('created_by assigned_to status_id task_stage_id');
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.json(task);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/task/{id}:
 *   put:
 *     summary: Cập nhật task theo ID
 *     tags: [Tasks]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               assigned_to:
 *                 type: string
 *               status_id:
 *                 type: string
 *               task_stage_id:
 *                 type: string
 *               deadline:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Task đã được cập nhật
 *       404:
 *         description: Không tìm thấy task
 */
router.put('/:id', async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedTask) return res.status(404).json({ error: 'Task not found' });
        res.json(updatedTask);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/task/{id}:
 *   delete:
 *     summary: Xóa task theo ID
 *     tags: [Tasks]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task đã được xóa
 *       404:
 *         description: Không tìm thấy task
 */
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Task.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'Task not found' });
        res.json({ message: 'Task deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
