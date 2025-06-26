const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/maps-backend', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User schema (simplified version)
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  role: { type: String, default: 'user' },
  currentLocation: {
    latitude: Number,
    longitude: Number,
    updatedAt: Date
  },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Location' }]
});

const User = mongoose.model('User', userSchema);

async function createTestUsers() {
  try {
    // Hash password
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    // Chemnitz coordinates (approximately)
    const chemnitzLat = 50.8278;
    const chemnitzLng = 12.9242;
    
    // Create test users at different distances from Chemnitz
    const testUsers = [
      {
        email: 'user1@test.com',
        password: hashedPassword,
        fullName: 'Alice Johnson',
        role: 'user',
        currentLocation: {
          latitude: chemnitzLat + 0.001, // ~100m north
          longitude: chemnitzLng + 0.001, // ~100m east
          updatedAt: new Date()
        }
      },
      {
        email: 'user2@test.com',
        password: hashedPassword,
        fullName: 'Bob Smith',
        role: 'user',
        currentLocation: {
          latitude: chemnitzLat - 0.002, // ~200m south
          longitude: chemnitzLng - 0.002, // ~200m west
          updatedAt: new Date()
        }
      },
      {
        email: 'user3@test.com',
        password: hashedPassword,
        fullName: 'Carol Davis',
        role: 'user',
        currentLocation: {
          latitude: chemnitzLat + 0.005, // ~500m north
          longitude: chemnitzLng + 0.005, // ~500m east
          updatedAt: new Date()
        }
      },
      {
        email: 'user4@test.com',
        password: hashedPassword,
        fullName: 'David Wilson',
        role: 'user',
        currentLocation: {
          latitude: chemnitzLat + 0.01, // ~1km north
          longitude: chemnitzLng + 0.01, // ~1km east
          updatedAt: new Date()
        }
      },
      {
        email: 'user5@test.com',
        password: hashedPassword,
        fullName: 'Eva Brown',
        role: 'user',
        currentLocation: {
          latitude: chemnitzLat + 0.02, // ~2km north
          longitude: chemnitzLng + 0.02, // ~2km east
          updatedAt: new Date()
        }
      }
    ];

    // Clear existing test users
    await User.deleteMany({ email: { $regex: /@test\.com$/ } });
    console.log('Cleared existing test users');

    // Create new test users
    for (const userData of testUsers) {
      const user = new User(userData);
      await user.save();
      console.log(`Created user: ${userData.fullName} at (${userData.currentLocation.latitude}, ${userData.currentLocation.longitude})`);
    }

    console.log('Test users created successfully!');
    console.log('You can now log in with any of these accounts:');
    testUsers.forEach(user => {
      console.log(`- ${user.email} (${user.fullName})`);
    });

  } catch (error) {
    console.error('Error creating test users:', error);
  } finally {
    mongoose.connection.close();
  }
}

createTestUsers(); 