const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env'), override: true });

let dbUrl = process.env.DATABASE_URL;
if (dbUrl && dbUrl.startsWith('prisma+postgres')) {
  dbUrl = 'postgresql://postgres:12345@127.0.0.1:5432/SureServe?schema=public';
} else if (!dbUrl) {
  dbUrl = 'postgresql://postgres:12345@127.0.0.1:5432/SureServe?schema=public';
}

console.log("DEBUG DATABASE_URL:", dbUrl);
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: dbUrl
    }
  }
});

module.exports = prisma;
