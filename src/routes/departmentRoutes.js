const express = require('express');
const Department = require('../models/departmentModel');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');


// ✅ Áp dụng authMiddleware cho tất cả route từ đây trở xuống
router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Departments
 *   description: API quản lý phòng ban
 */

/**
 * @swagger
 * /api/department:
 *   get:
 *     summary: Lấy danh sách phòng ban
 *     tags: [Departments]
 *     responses:
 *       200:
 *         description: Trả về danh sách phòng ban
 */
router.get('/', async (req, res) => {
    try {
        const departments = await Department.find().populate('company_id');
        res.json(departments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/department/post:
 *   post:
 *     summary: Tạo phòng ban mới
 *     tags: [Departments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - company_id
 *             properties:
 *               name:
 *                 type: string
 *               company_id:
 *                 type: string
 *     responses:
 *       201:
 *         description: Phòng ban đã được tạo
 *       400:
 *         description: Phòng ban đã tồn tại
 */
router.post('/post', async (req, res) => {
    try {
        const { name, company_id } = req.body;

        const existing = await Department.findOne({ name });
        if (existing) {
            return res.status(400).json({ error: 'Department already exists' });
        }

        const department = new Department({ name, company_id });
        await department.save();
        res.status(201).json(department);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/department/{id}:
 *   get:
 *     summary: Lấy phòng ban theo ID
 *     tags: [Departments]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID của phòng ban
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Trả về thông tin phòng ban
 *       404:
 *         description: Không tìm thấy
 */
router.get('/:id', async (req, res) => {
    try {
        const department = await Department.findById(req.params.id).populate('company_id');
        if (!department) return res.status(404).json({ error: 'Department not found' });
        res.json(department);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/department/{id}:
 *   put:
 *     summary: Cập nhật phòng ban
 *     tags: [Departments]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID phòng ban
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               company_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Phòng ban đã được cập nhật
 *       400:
 *         description: Trùng tên phòng ban
 *       404:
 *         description: Không tìm thấy
 */
router.put('/:id', async (req, res) => {
    try {
        const { name, company_id } = req.body;

        const existing = await Department.findOne({ name, _id: { $ne: req.params.id } });
        if (existing) {
            return res.status(400).json({ error: 'Department name already exists' });
        }

        const updated = await Department.findByIdAndUpdate(
            req.params.id,
            { name, company_id },
            { new: true }
        );

        if (!updated) return res.status(404).json({ error: 'Department not found' });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/department/{id}:
 *   delete:
 *     summary: Xóa phòng ban
 *     tags: [Departments]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID phòng ban
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       404:
 *         description: Không tìm thấy
 */
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Department.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'Department not found' });
        res.json({ message: 'Department deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
