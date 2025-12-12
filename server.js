const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const prisma = require('./src/config/db');

dotenv.config();

const apiRouter = require('./src/routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', apiRouter);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log('Connected to PostgreSQL');

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to connect to the database', err);
    process.exit(1);
  }
};

startServer();

