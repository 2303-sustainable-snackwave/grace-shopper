const client = require('../db/client');

const tearDown = async ({ watch, watchAll }) => {
  if (watch || watchAll) {
    return;
  }
  console.log("Starting database teardown...");

  try {
    await client.end();
    console.log("Database connection closed.");
  } catch (error) {
    console.error("Error closing database connection:", error);
  }
}

module.exports = tearDown;