const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`  💾  \x1b[33mDatabase:\x1b[0m  \x1b[32mMongoDB Connected: ${conn.connection.host}\x1b[0m`);
    } catch (err) {
        console.error(`  ❌  \x1b[31mError:\x1b[0m      ${err.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
