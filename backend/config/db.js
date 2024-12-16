const { connect } = require("mongoose");

const connectDB = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI;
    const conn = await connect(MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Failed to connect to the database. Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
