const express = require('express');
const Project = require('../models/projectModel');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// Apply authMiddleware for all routes below
router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: API quản lý project
 */

/**
 * @swagger
 * /api/project:
 *   get:
 *     summary: Lấy danh sách các project
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: Trả về danh sách các project
 */
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find().populate('team_id department_id company_id created_by');
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/project/post:
 *   post:
 *     summary: Tạo project mới
 *     tags: [Projects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - created_by
 *             properties:
 *               name:
 *                 type: string
 *                 description: Tên project
 *               description:
 *                 type: string
 *                 description: Mô tả project
 *               created_by:
 *                 type: string
 *                 description: ID người tạo project
 *               company_id:
 *                 type: string
 *                 description: ID công ty
 *               department_id:
 *                 type: string
 *                 description: ID phòng ban
 *               team_id:
 *                 type: string
 *                 description: ID team
 *               start_date:
 *                 type: string
 *                 format: date
 *                 description: Ngày bắt đầu
 *               end_date:
 *                 type: string
 *                 format: date
 *                 description: Ngày kết thúc
 *     responses:
 *       201:
 *         description: Project đã được tạo
 *       400:
 *         description: Project đã tồn tại
 */
router.post('/post', async (req, res) => {
    try {
        const { name, description, created_by, company_id, department_id, team_id, start_date, end_date } = req.body;

        const existing = await Project.findOne({ name });
        if (existing) {
            return res.status(400).json({ error: 'Project already exists' });
        }

        const project = new Project({ name, description, created_by, company_id, department_id, team_id, start_date, end_date });
        await project.save();
        res.status(201).json(project);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/project/{id}:
 *   get:
 *     summary: Lấy project theo ID
 *     tags: [Projects]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID của project
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Trả về thông tin project
 *       404:
 *         description: Project không tồn tại
 */
router.get('/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).populate('team_id department_id company_id created_by');
        if (!project) return res.status(404).json({ error: 'Project not found' });
        res.json(project);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/project/{id}:
 *   put:
 *     summary: Cập nhật project theo ID
 *     tags: [Projects]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID của project
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
 *               - created_by
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               created_by:
 *                 type: string
 *               company_id:
 *                 type: string
 *               department_id:
 *                 type: string
 *               team_id:
 *                 type: string
 *               start_date:
 *                 type: string
 *               end_date:
 *                 type: string
 *     responses:
 *       200:
 *         description: Project đã được cập nhật
 *       404:
 *         description: Project không tồn tại
 */
router.put('/:id', async (req, res) => {
    try {
        const { name, description, created_by, company_id, department_id, team_id, start_date, end_date } = req.body;

        const updatedProject = await Project.findByIdAndUpdate(
            req.params.id,
            { name, description, created_by, company_id, department_id, team_id, start_date, end_date },
            { new: true }
        );
        if (!updatedProject) return res.status(404).json({ error: 'Project not found' });

        res.json(updatedProject);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/project/{id}:
 *   delete:
 *     summary: Xóa project theo ID
 *     tags: [Projects]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID của project
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project đã bị xóa
 *       404:
 *         description: Project không tồn tại
 */
router.delete('/:id', async (req, res) => {
    try {
        const deletedProject = await Project.findByIdAndDelete(req.params.id);
        if (!deletedProject) return res.status(404).json({ error: 'Project not found' });
        res.json({ message: 'Project deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
