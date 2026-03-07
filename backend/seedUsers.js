const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const users = [
  { name: 'Aarav Sharma', email: 'aarav@example.com', password: 'password123', role: 'member' },
  { name: 'Ishita Gupta', email: 'ishita@example.com', password: 'password123', role: 'member' },
  { name: 'Vihaan Verma', email: 'vihaan@example.com', password: 'password123', role: 'member' },
  { name: 'Ananya Iyer', email: 'ananya@example.com', password: 'password123', role: 'member' },
  { name: 'Kabir Singh', email: 'kabir@example.com', password: 'password123', role: 'member' },
  { name: 'Myra Kapoor', email: 'myra@example.com', password: 'password123', role: 'member' },
  { name: 'Advait Nair', email: 'advait@example.com', password: 'password123', role: 'member' },
  { name: 'Saanvi Reddy', email: 'saanvi@example.com', password: 'password123', role: 'member' },
  { name: 'Reyansh Malhotra', email: 'reyansh@example.com', password: 'password123', role: 'member' },
  { name: 'Kavya Joshi', email: 'kavya@example.com', password: 'password123', role: 'member' },
];

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    for (const user of users) {
      const userExists = await User.findOne({ email: user.email });
      if (!userExists) {
        await User.create(user);
        console.log(`User created: ${user.name}`);
      } else {
        console.log(`User already exists: ${user.email}`);
      }
    }

    console.log('Seeding completed successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers();
