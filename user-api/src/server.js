// // src/server.js
// require('dotenv').config();
// const mongoose = require('mongoose');
// const app = require('./app');

// const PORT = process.env.PORT || 5000;
// // const MONGO_URI = process.env.MONGO_URI;
// const MONGO_URI = process.env.MONGODB_URI;

// mongoose
//   .connect(MONGO_URI)
//   .then(() => {
//     console.log('MongoDB connected successfully');
//     app.listen(PORT, () => {
//       console.log(`Server running on http://localhost:${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.error('MongoDB connection failed:', err.message);
//     process.exit(1);
//   });

// src/server.js
require('dotenv').config();
const http = require('http');
const mongoose = require('mongoose');
const app = require('./app');
const { initSocket } = require('./config/socket');

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI;

const server = http.createServer(app);
initSocket(server);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });