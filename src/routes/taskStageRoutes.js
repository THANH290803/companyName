const express = require('express');
const TaskStage = require('../models/taskStageModel');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: TaskStages
 *   description: API quản lý các giai đoạn của project (task stages)
 */

/**
 * @swagger
 * /api/task-stage:
 *   get:
 *     summary: Lấy danh sách các giai đoạn task
 *     tags: [TaskStages]
 *     responses:
 *       200:
 *         description: Trả về danh sách task stages
 */
router.get('/', async (req, res) => {
  try {
    const stages = await TaskStage.find().populate('project_id');
    res.json(stages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/task-stage/project/{projectId}:
 *   get:
 *     summary: Lấy danh sách các task stages theo project_id
 *     tags: [TaskStages]
 *     parameters:
 *       - name: projectId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Danh sách task stages theo project_id
 *       404:
 *         description: Không tìm thấy task stages
 */
router.get('/project/:projectId', async (req, res) => {
  try {
    const stages = await TaskStage.find({ project_id: req.params.projectId }).populate('project_id');
    if (!stages || stages.length === 0) {
      return res.status(404).json({ error: 'No task stages found for this project_id' });
    }
    res.json(stages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/**
 * @swagger
 * /api/task-stage/post:
 *   post:
 *     summary: Tạo giai đoạn task mới
 *     tags: [TaskStages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [project_id, title]
 *             properties:
 *               project_id:
 *                 type: string
 *               title:
 *                 type: string
 *     responses:
 *       201:
 *         description: Task stage đã được tạo
 */
router.post('/post', async (req, res) => {
  try {
    const stage = new TaskStage(req.body);
    await stage.save();
    res.status(201).json(stage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/task-stage/{id}:
 *   get:
 *     summary: Lấy giai đoạn task theo ID
 *     tags: [TaskStages]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Trả về task stage
 *       404:
 *         description: Không tìm thấy task stage
 */
router.get('/:id', async (req, res) => {
  try {
    const stage = await TaskStage.findById(req.params.id).populate('project_id');
    if (!stage) return res.status(404).json({ error: 'Task stage not found' });
    res.json(stage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/task-stage/{id}:
 *   put:
 *     summary: Cập nhật task stage theo ID
 *     tags: [TaskStages]
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
 *     responses:
 *       200:
 *         description: Task stage đã được cập nhật
 *       404:
 *         description: Không tìm thấy task stage
 */
router.put('/:id', async (req, res) => {
  try {
    const stage = await TaskStage.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!stage) return res.status(404).json({ error: 'Task stage not found' });
    res.json(stage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/task-stage/{id}:
 *   delete:
 *     summary: Xóa task stage theo ID
 *     tags: [TaskStages]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task stage đã được xóa
 *       404:
 *         description: Không tìm thấy task stage
 */
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await TaskStage.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Task stage not found' });
    res.json({ message: 'Task stage deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
