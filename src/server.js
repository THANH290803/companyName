const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const roleRoutes = require('./routes/roleRoutes');
const companyRoutes = require('./routes/companyRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

dotenv.config();
const app = express();

// Kết nối MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Swagger config
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Tài liệu',
      version: '1.0.0',
      description: 'Tài liệu API cho Users và Roles'
    },
    servers: [
      {
        url: 'http://localhost:5001', // Đảm bảo URL này là chính xác
      },
    ],
  },
  apis: ['./src/routes/*.js'] // Đảm bảo Swagger sẽ quét đúng file route
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Swagger UI endpoint
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Role API
app.use('/api/role', roleRoutes);

// Company API
app.use('/api/company', companyRoutes);

// Kiểm tra API hoạt động
app.get('/', (req, res) => {
  res.send('🚀 Server is running!');
});

// Khởi động server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));
