import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/db.js';

dotenv.config();

const DEFAULT_PORT = Number(process.env.PORT || 5000);

const startServer = async (port, attempts = 0) => {
  try {
    await connectDB();

    const server = app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE' && attempts < 5) {
        console.warn(`Port ${port} is busy, trying ${port + 1} instead.`);
        server.close(() => startServer(port + 1, attempts + 1));
        return;
      }

      console.error('Failed to start server:', error);
      process.exit(1);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer(DEFAULT_PORT);
