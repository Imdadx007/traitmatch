const express = require('express');
const connectDB = require('./db');
const userRoutes = require('./users');
const app = express();
const PORT = 5000;
const cors = require('cors');
app.use(cors());


connectDB();
app.use(express.json());
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
