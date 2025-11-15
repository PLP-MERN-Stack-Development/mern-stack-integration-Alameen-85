const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./models/Category');

dotenv.config();

const categories = [
    { name: 'Technology', slug: 'technology' },
    { name: 'Lifestyle', slug: 'lifestyle' },
    { name: 'Business', slug: 'business' },
    { name: 'Travel', slug: 'travel' },
    { name: 'Food', slug: 'food' },
    { name: 'Health', slug: 'health' },
];

async function seedCategories() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('📦 Connected to MongoDB...');

        // Clear existing categories
        await Category.deleteMany({});
        console.log('🗑️  Cleared existing categories');

        // Insert new categories
        const inserted = await Category.insertMany(categories);
        console.log(`✅ Created ${inserted.length} categories:`);
        inserted.forEach((cat) => {
            console.log(`   - ${cat.name}`);
        });

        await mongoose.connection.close();
        console.log('✅ Done!');
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

seedCategories();
