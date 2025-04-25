const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API quản lý người dùng
 */

// Kiểm tra password hợp lệ
function isValidPassword(password) {
  const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  return regex.test(password);
}


// Đăng nhập người dùng
/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: Đăng nhập người dùng
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *       400:
 *         description: Email hoặc mật khẩu không đúng
 *       500:
 *         description: Lỗi máy chủ
 */
router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Tìm người dùng theo email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: 'Email or password is incorrect' });
      }
  
      // Kiểm tra mật khẩu
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Email or password is incorrect' });
      }
  
      // Tạo JWT token
      const token = jwt.sign(
        { userId: user._id, roleId: user.role_id },
        'jkFv@!4t#qN2$ePz98KlmR&0xYb1VuWc^HdTZs%3rAG6L+J9', // Bạn nên thay thế `secret_key` bằng một giá trị bảo mật thực sự
        { expiresIn: '2d' } // Token hết hạn sau 1 giờ
      );
  
      // Trả về token và thông tin người dùng
      res.json({
        message: 'Login successful',
        token,
        user: {
          name: user.name,
          email: user.email,
          role_id: user.role_id,
          company_id: user.company_id,
          department_id: user.department_id,
          team_id: user.team_id
        },
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

 /**
 * @swagger
 * /api/user/protected:
 *   get:
 *     summary: Route bảo vệ (cần token hợp lệ)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thành công
 *       401:
 *         description: Không có quyền truy cập (token không hợp lệ)
 */
router.get('/protected', authMiddleware, async (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
});



// ✅ Áp dụng authMiddleware cho tất cả route từ đây trở xuống
router.use(authMiddleware);

  /**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Lấy danh sách người dùng
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Trả về danh sách người dùng
 */
router.get('/', async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

/**
 * @swagger
 * /api/user/post:
 *   post:
 *     summary: Tạo người dùng mới
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role_id
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role_id:
 *                 type: string
 *               company_id:
 *                 type: string
 *               department_id:
 *                 type: string
 *               team_id:
 *                 type: string
 *     responses:
 *       201:
 *         description: Người dùng đã được tạo
 *       400:
 *         description: Email đã tồn tại hoặc mật khẩu không hợp lệ
 */
router.post('/post', async (req, res) => {
  try {
    const { name, email, password, role_id, company_id, department_id, team_id } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already exists' });

    if (!isValidPassword(password)) {
      return res.status(400).json({
        error: 'Password must be at least 6 characters, contain letters, numbers, and a special character',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role_id,
      company_id,
      department_id,
      team_id,
    });

    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/user/{id}:
 *   get:
 *     summary: Lấy người dùng theo ID
 *     tags: [Users]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Trả về người dùng
 *       404:
 *         description: Không tìm thấy người dùng
 */
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/user/{id}:
 *   put:
 *     summary: Cập nhật người dùng
 *     tags: [Users]
 *     parameters:
 *       - name: id
 *         in: path
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
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role_id:
 *                 type: string
 *               company_id:
 *                 type: string
 *               department_id:
 *                 type: string
 *               team_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Người dùng đã được cập nhật
 *       404:
 *         description: Không tìm thấy người dùng
 */
router.put('/:id', async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (updateData.password) {
      if (!isValidPassword(updateData.password)) {
        return res.status(400).json({
          error: 'Password must be at least 6 characters, contain letters, numbers, and a special character',
        });
      }

      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updated = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!updated) return res.status(404).json({ error: 'User not found' });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/user/{id}:
 *   delete:
 *     summary: Xoá người dùng
 *     tags: [Users]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xoá thành công
 *       404:
 *         description: Không tìm thấy người dùng
 */
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
