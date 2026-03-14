const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env variables
dotenv.config({ path: path.join(__dirname, '.env') });

const cleanupDatabase = async () => {
    try {
        console.log('Connecting to MongoDB for cleanup...');
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        // Get all collections
        const collections = await mongoose.connection.db.collections();

        for (let collection of collections) {
            console.log(`Dropping collection: ${collection.collectionName}`);
            await collection.drop();
        }

        console.log('--- DATABASE CLEANUP COMPLETE ---');
        console.log('All collections have been dropped successfully.');

        process.exit(0);
    } catch (error) {
        console.error('Error during database cleanup:', error.message);
        process.exit(1);
    }
};

// Run the script
cleanupDatabase();
