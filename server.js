import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import schoolRoutes from './routes/schoolRoutes.js';
import db from './config/db.js';

dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use('/', schoolRoutes);

app.get('/', (req, res) => {
  res.send('School Management API is running!');
});

const testDBConnection = async () => {
  try {
    const connection = await db.getConnection();
    console.log("MySQL connected successfully!");
    connection.release();
  } catch (err) {
    console.error("MySQL connection failed:", err.message);
  }
};

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  await testDBConnection();
  console.log(`Server running on port ${PORT}`);
});
