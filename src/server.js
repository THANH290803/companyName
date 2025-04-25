const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const roleRoutes = require('./routes/roleRoutes');
const companyRoutes = require('./routes/companyRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const teamRoutes = require('./routes/teamRoutes');
const userRoutes = require('./routes/userRoutes');
const taskStatusRoutes = require('./routes/taskStatusRoutes');
const taskApprovalStatusRoutes = require('./routes/taskApprovalStatusRoutes');
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
      title: 'API ProFusion',
      version: '1.0.0',
      description: 'Tài liệu API cho dự án ProFusion'
    },
    servers: [
      {
        url: 'http://localhost:5001', // Đảm bảo URL này là chính xác
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Đảm bảo Swagger sẽ quét đúng file route
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Swagger UI endpoint
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Role API
app.use('/api/role', roleRoutes);

// Company API
app.use('/api/company', companyRoutes);

// Department API
app.use('/api/department', departmentRoutes);

// Team API
app.use('/api/team', teamRoutes);

// User API
app.use('/api/user', userRoutes);

// Task Status API
app.use('/api/task-status', taskStatusRoutes);

// Task Approval Status API
app.use('/api/task-approval-status', taskApprovalStatusRoutes);

// Kiểm tra API hoạt động
app.get('/', (req, res) => {
  res.send('🚀 Server is running!');
});

// Khởi động server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));
