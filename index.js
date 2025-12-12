require('dotenv').config();
const { app, prisma } = require('./src/app');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to the database
    await prisma.$connect();
    console.log('✅ Connected to PostgreSQL database');

    // Start the server
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

    // Handle graceful shutdown
    const shutdown = async () => {
      console.log('\n🛑 Shutting down server...');
      
      // Close the server
      server.close(async () => {
        console.log('👋 HTTP server closed');
        
        // Close Prisma client
        await prisma.$disconnect();
        console.log('👋 Database connection closed');
        
        process.exit(0);
      });
    };

    // Handle termination signals
    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);

  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
