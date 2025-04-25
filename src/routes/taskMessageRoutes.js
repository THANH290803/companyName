const express = require('express');
const TaskMessage = require('../models/taskMessageModel');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: TaskMessages
 *   description: API quản lý tin nhắn trong nhiệm vụ (task messages)
 */

/**
 * @swagger
 * /api/task-message:
 *   get:
 *     summary: Lấy danh sách tất cả tin nhắn task
 *     tags: [TaskMessages]
 *     responses:
 *       200:
 *         description: Trả về danh sách task messages
 */
router.get('/', async (req, res) => {
  try {
    const messages = await TaskMessage.find().populate('task_id sender_id receiver_id');
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/task-message/post:
 *   post:
 *     summary: Gửi tin nhắn trong task
 *     tags: [TaskMessages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [task_id, sender_id, receiver_id, content]
 *             properties:
 *               task_id:
 *                 type: string
 *               sender_id:
 *                 type: string
 *               receiver_id:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tin nhắn đã được gửi
 */
router.post('/post', async (req, res) => {
  try {
    const message = new TaskMessage(req.body);
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/task-message/{id}:
 *   get:
 *     summary: Lấy tin nhắn theo ID
 *     tags: [TaskMessages]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Trả về tin nhắn
 *       404:
 *         description: Không tìm thấy tin nhắn
 */
router.get('/:id', async (req, res) => {
  try {
    const message = await TaskMessage.findById(req.params.id).populate('task_id sender_id receiver_id');
    if (!message) return res.status(404).json({ error: 'Task message not found' });
    res.json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/task-message/{id}:
 *   delete:
 *     summary: Xóa tin nhắn theo ID
 *     tags: [TaskMessages]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tin nhắn đã được xóa
 *       404:
 *         description: Không tìm thấy tin nhắn
 */
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await TaskMessage.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Task message not found' });
    res.json({ message: 'Task message deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
