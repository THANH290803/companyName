const express = require('express');
const Team = require('../models/teamModel');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');


// ✅ Áp dụng authMiddleware cho tất cả route từ đây trở xuống
router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Teams
 *   description: API quản lý team
 */

/**
 * @swagger
 * /api/team:
 *   get:
 *     summary: Lấy danh sách các team
 *     tags: [Teams]
 *     responses:
 *       200:
 *         description: Trả về danh sách các team
 */
router.get('/', async (req, res) => {
    try {
        const teams = await Team.find().populate('department_id');
        res.json(teams);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/team/post:
 *   post:
 *     summary: Tạo team mới
 *     tags: [Teams]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - department_id
 *             properties:
 *               name:
 *                 type: string
 *                 description: Tên team
 *               department_id:
 *                 type: string
 *                 description: ID phòng ban
 *     responses:
 *       201:
 *         description: Team đã được tạo
 *       400:
 *         description: Team đã tồn tại
 */
router.post('/post', async (req, res) => {
    try {
        const { name, department_id } = req.body;

        const existing = await Team.findOne({ name });
        if (existing) {
            return res.status(400).json({ error: 'Team already exists' });
        }

        const team = new Team({ name, department_id });
        await team.save();
        res.status(201).json(team);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/team/{id}:
 *   get:
 *     summary: Lấy team theo ID
 *     tags: [Teams]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID của team
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Trả về thông tin team
 *       404:
 *         description: Team không tồn tại
 */
router.get('/:id', async (req, res) => {
    try {
        const team = await Team.findById(req.params.id).populate('department_id');
        if (!team) return res.status(404).json({ error: 'Team not found' });
        res.json(team);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/team/{id}:
 *   put:
 *     summary: Cập nhật team theo ID
 *     tags: [Teams]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID của team
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
 *               - department_id
 *             properties:
 *               name:
 *                 type: string
 *               department_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Team đã được cập nhật
 *       400:
 *         description: Team đã tồn tại
 *       404:
 *         description: Team không tồn tại
 */
router.put('/:id', async (req, res) => {
    try {
        const { name, department_id } = req.body;

        const existing = await Team.findOne({ name, _id: { $ne: req.params.id } });
        if (existing) {
            return res.status(400).json({ error: 'Team name already exists' });
        }

        const updatedTeam = await Team.findByIdAndUpdate(
            req.params.id,
            { name, department_id },
            { new: true }
        );
        if (!updatedTeam) return res.status(404).json({ error: 'Team not found' });

        res.json(updatedTeam);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/team/{id}:
 *   delete:
 *     summary: Xóa team theo ID
 *     tags: [Teams]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID của team
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Team đã bị xóa
 *       404:
 *         description: Team không tồn tại
 */
router.delete('/:id', async (req, res) => {
    try {
        const deletedTeam = await Team.findByIdAndDelete(req.params.id);
        if (!deletedTeam) return res.status(404).json({ error: 'Team not found' });
        res.json({ message: 'Team deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
