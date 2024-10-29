
module.exports = {
  // Prisma schema
  datasource: {
    provider: "sqlite", // or "postgresql" / "mysql"
    url: "file:./dev.db" // Change this to your database URL
  },
  generator: {
    provider: "prisma-client-js"
  },
  // Define your models here
};
