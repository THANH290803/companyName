const express = require('express');
const Role = require('../models/roleModel');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: API quản lý vai trò
 */

/**
 * @swagger
 * /api/role:
 *   get:
 *     summary: Lấy danh sách các role
 *     tags: [Roles]
 *     responses:
 *       200:
 *         description: Trả về danh sách các role
 */
router.get('/', async (req, res) => {
    try {
        const roles = await Role.find();
        res.json(roles);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/role/post:
 *   post:
 *     summary: Tạo role mới
 *     tags: [Roles]
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
 *                 description: Tên role
 *     responses:
 *       201:
 *         description: Role đã được tạo
 *       400:
 *         description: Role đã tồn tại
 */
router.post('/post', async (req, res) => {
    try {
        const { name } = req.body;
        const existing = await Role.findOne({ name });
        if (existing) return res.status(400).json({ error: 'Role already exists' });

        const role = new Role({ name });
        await role.save();
        res.status(201).json(role);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/role/{id}:
 *   get:
 *     summary: Lấy role theo ID
 *     tags: [Roles]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID của role
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Trả về thông tin role
 *       404:
 *         description: Role không tồn tại
 */
router.get('/:id', async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);
        if (!role) return res.status(404).json({ error: 'Role not found' });
        res.json(role);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/role/{id}:
 *   put:
 *     summary: Cập nhật role theo ID
 *     tags: [Roles]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID của role
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
 *         description: Role đã được cập nhật
 *       404:
 *         description: Role không tồn tại
 */
router.put('/:id', async (req, res) => {
    try {
        const { name } = req.body;
        const updatedRole = await Role.findByIdAndUpdate(
            req.params.id,
            { name },
            { new: true }
        );
        if (!updatedRole) return res.status(404).json({ error: 'Role not found' });
        res.json(updatedRole);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/role/{id}:
 *   delete:
 *     summary: Xóa role theo ID
 *     tags: [Roles]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID của role
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Role đã bị xóa
 *       404:
 *         description: Role không tồn tại
 */
router.delete('/:id', async (req, res) => {
    try {
        const deletedRole = await Role.findByIdAndDelete(req.params.id);
        if (!deletedRole) return res.status(404).json({ error: 'Role not found' });
        res.json({ message: 'Role deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
