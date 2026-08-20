import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import Listing from '../models/Listing';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/outr-market';

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    await Listing.deleteMany({});

    const hash = await bcrypt.hash('password123', 12);

    const users = await User.insertMany([
      { name: 'Admin', email: 'admin@outr.ac.in', passwordHash: hash, role: 'ADMIN', verified: true, branch: 'CSE', year: '4th', hostel: 'Boys Hostel A' },
      { name: 'Rahul Sharma', email: 'rahul@outr.ac.in', passwordHash: hash, role: 'USER', verified: true, branch: 'ECE', year: '3rd', hostel: 'Boys Hostel B' },
      { name: 'Priya Patel', email: 'priya@outr.ac.in', passwordHash: hash, role: 'USER', verified: true, branch: 'Mechanical', year: '2nd', hostel: 'Girls Hostel' },
    ]);

    const listings = [
      { title: 'Casio fx-991EX Calculator', description: 'ClassWiz scientific calculator, perfect for exams. Barely used, comes with cover.', price: 800, category: 'academic', condition: 'Like New', location: 'Library', seller: users[1]._id, negotiable: true, status: 'ACTIVE' },
      { title: 'Hero Sprint Cycle', description: '21-speed gear cycle, 2 years old. Recently serviced. Great for campus rides.', price: 4500, category: 'cycles', condition: 'Good', location: 'Hostel', seller: users[2]._id, negotiable: true, status: 'ACTIVE' },
      { title: 'BS Grewal Engineering Maths', description: 'Higher Engineering Mathematics. Some highlighting but all pages intact.', price: 350, category: 'books', condition: 'Good', location: 'Academic Block', seller: users[1]._id, status: 'ACTIVE' },
      { title: 'boAt Rockerz Headphones', description: 'Wireless headphones with 15hr battery. Good bass, lightly used.', price: 900, category: 'electronics', condition: 'Good', location: 'Hostel', seller: users[2]._id, negotiable: true, status: 'ACTIVE' },
      { title: 'Study Table + Chair', description: 'Wooden study table with chair. Perfect for hostel room. Must pick up.', price: 1200, category: 'furniture', condition: 'Fair', location: 'Hostel', seller: users[1]._id, status: 'ACTIVE' },
      { title: 'Badminton Racket (Yonex)', description: 'Yonex Nanoray with cover. Great condition, strings recently changed.', price: 1100, category: 'sports', condition: 'Like New', location: 'Sports Complex', seller: users[2]._id, status: 'ACTIVE' },
    ];

    await Listing.insertMany(listings);
    console.log('Seeded users and listings');
    console.log('\nLogin: admin@outr.ac.in / password123');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

seed();