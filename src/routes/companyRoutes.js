const express = require('express');
const router = express.Router();
const Company = require('../models/companyModel');
const authMiddleware = require('../middleware/authMiddleware');

// ✅ Áp dụng authMiddleware cho tất cả route từ đây trở xuống
router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Companies
 *   description: API quản lý công ty
 */

/**
 * @swagger
 * /api/company:
 *   get:
 *     summary: Lấy danh sách công ty
 *     tags: [Companies]
 *     responses:
 *       200:
 *         description: Danh sách công ty
 */
router.get('/', async (req, res) => {
  try {
    const companies = await Company.find();
    res.json(companies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/company:
 *   post:
 *     summary: Tạo công ty mới
 *     tags: [Companies]
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
 *               is_headquarter:
 *                 type: boolean
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo thành công
 *       400:
 *         description: Tên công ty đã tồn tại
 */
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;

    // Kiểm tra xem công ty đã tồn tại chưa
    const existingCompany = await Company.findOne({ name });
    if (existingCompany) {
      return res.status(400).json({ error: 'Company name already exists' });
    }

    const company = new Company(req.body);
    await company.save();
    res.status(201).json(company);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/company/{id}:
 *   get:
 *     summary: Lấy công ty theo ID
 *     tags: [Companies]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Trả về công ty
 *       404:
 *         description: Không tìm thấy
 */
router.get('/:id', async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ error: 'Not found' });
    res.json(company);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/company/{id}:
 *   put:
 *     summary: Cập nhật công ty
 *     tags: [Companies]
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
 *               name:
 *                 type: string
 *               is_headquarter:
 *                 type: boolean
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đã cập nhật
 *       400:
 *         description: Tên công ty đã tồn tại
 *       404:
 *         description: Không tìm thấy
 */
router.put('/:id', async (req, res) => {
  try {
    const { name } = req.body;

    // Kiểm tra xem tên công ty có bị trùng với công ty khác không, ngoại trừ công ty hiện tại
    const existingCompany = await Company.findOne({ name, _id: { $ne: req.params.id } });
    if (existingCompany) {
      return res.status(400).json({ error: 'Company name already exists' });
    }

    const updatedCompany = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCompany) return res.status(404).json({ error: 'Not found' });
    res.json(updatedCompany);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/company/{id}:
 *   delete:
 *     summary: Xóa công ty
 *     tags: [Companies]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Đã xóa
 */
router.delete('/:id', async (req, res) => {
  try {
    const deletedCompany = await Company.findByIdAndDelete(req.params.id);
    if (!deletedCompany) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
