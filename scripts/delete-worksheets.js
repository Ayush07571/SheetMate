const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const pg = require('pg');
const process = require('process');

// Load environment variables from .env using Node.js built-in env loader
try {
  process.loadEnvFile();
} catch (err) {
  console.log("Note: Could not load .env file via process.loadEnvFile(). Environment variables must already be set.");
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is missing.");
  }

  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL
  });
  
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  console.log("Connecting to PostgreSQL database...");
  console.log("Deleting all records in GeneratedWorksheet...");
  
  const result = await prisma.generatedWorksheet.deleteMany({});
  
  console.log(`Successfully deleted all ${result.count} worksheets!`);

  // Cleanup connections
  await prisma.$disconnect();
  await pool.end();
}

main().catch((err) => {
  console.error("Error executing script:", err);
  process.exit(1);
});
