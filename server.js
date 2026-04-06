require('dotenv').config();
const app = require('./src/app');
const prisma = require('./src/lib/prisma');

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected');
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  } catch (err) {
    console.error('❌ Startup error:', err);
    process.exit(1);
  }
}
start();
