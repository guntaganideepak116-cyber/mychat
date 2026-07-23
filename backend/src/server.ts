import app from './app';

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🚀 MyChat Express Backend Server is Online`);
  console.log(`📡 Listening on http://localhost:${PORT}`);
  console.log(`🔧 Node Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`==================================================`);
});

// Graceful shutdown handling
const shutdown = (signal: string) => {
  console.log(`\n[Server] Received ${signal}. Shutting down gracefully...`);
  server.close(() => {
    console.log('[Server] Closed remaining connections. Exiting.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
