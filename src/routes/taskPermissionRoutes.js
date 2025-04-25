const express = require('express');
const TaskPermission = require('../models/taskPermissionModel');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: TaskPermissions
 *   description: API quản lý phân quyền nhiệm vụ
 */

/**
 * @swagger
 * /api/task-permission:
 *   get:
 *     summary: Lấy danh sách quyền nhiệm vụ
 *     tags: [TaskPermissions]
 *     responses:
 *       200:
 *         description: Trả về danh sách task permissions
 */
router.get('/', async (req, res) => {
  try {
    const permissions = await TaskPermission.find().populate('task_id user_id');
    res.json(permissions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/task-permission/post:
 *   post:
 *     summary: Gán quyền mới cho user trong task
 *     tags: [TaskPermissions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [task_id, user_id, permission_type]
 *             properties:
 *               task_id:
 *                 type: string
 *               user_id:
 *                 type: string
 *               permission_type:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Quyền đã được gán
 */
router.post('/post', async (req, res) => {
  try {
    const permission = new TaskPermission(req.body);
    await permission.save();
    res.status(201).json(permission);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/task-permission/{id}:
 *   get:
 *     summary: Lấy quyền theo ID
 *     tags: [TaskPermissions]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Trả về quyền
 *       404:
 *         description: Không tìm thấy quyền
 */
router.get('/:id', async (req, res) => {
  try {
    const permission = await TaskPermission.findById(req.params.id).populate('task_id user_id');
    if (!permission) return res.status(404).json({ error: 'Task permission not found' });
    res.json(permission);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/task-permission/{id}:
 *   delete:
 *     summary: Xóa quyền theo ID
 *     tags: [TaskPermissions]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Quyền đã được xóa
 *       404:
 *         description: Không tìm thấy quyền
 */
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await TaskPermission.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Task permission not found' });
    res.json({ message: 'Task permission deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
