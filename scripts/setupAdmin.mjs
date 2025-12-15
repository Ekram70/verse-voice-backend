import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// Target database (client's)
const TARGET_URI = `mongodb+srv://fakharuddinpentu_db_user:versevoice999@cluster0.aujbmom.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// New admin credentials
const NEW_ADMIN = {
  email: 'fakharuddinpentu@gmail.com',
  password: 'Takay1#$ane%%',
  name: 'Admin',
  isSuperUser: true
};

async function setupAdmin() {
  console.log('Setting up admin users...\n');

  // Connect to target database
  console.log('Connecting to database...');
  const conn = await mongoose.createConnection(TARGET_URI).asPromise();
  console.log('Connected to database.\n');

  const db = conn.db;
  const usersCollection = db.collection('users');

  // Hash the password
  const hashedPassword = await bcrypt.hash(NEW_ADMIN.password, 10);
  console.log('Password hashed successfully.\n');

  // Check if new admin already exists
  const existingAdmin = await usersCollection.findOne({ email: NEW_ADMIN.email });

  if (existingAdmin) {
    // Update existing admin's password and ensure superuser status
    await usersCollection.updateOne(
      { email: NEW_ADMIN.email },
      {
        $set: {
          password: hashedPassword,
          isSuperUser: true
        }
      }
    );
    console.log(`[OK] Updated existing admin: ${NEW_ADMIN.email}`);
  } else {
    // Create new admin user
    const newAdmin = {
      avatar: '',
      name: NEW_ADMIN.name,
      email: NEW_ADMIN.email,
      password: hashedPassword,
      blogs: [],
      comments: [],
      isSuperUser: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await usersCollection.insertOne(newAdmin);
    console.log(`[OK] Created new admin: ${NEW_ADMIN.email}`);
  }

  // Update all existing superusers' passwords
  const superUsers = await usersCollection.find({
    isSuperUser: true,
    email: { $ne: NEW_ADMIN.email }
  }).toArray();

  for (const user of superUsers) {
    await usersCollection.updateOne(
      { _id: user._id },
      { $set: { password: hashedPassword } }
    );
    console.log(`[OK] Updated password for existing admin: ${user.email}`);
  }

  // Close connection
  await conn.close();

  console.log('\nAdmin setup completed!');
  console.log(`\nLogin credentials:`);
  console.log(`  Email: ${NEW_ADMIN.email}`);
  console.log(`  Password: ${NEW_ADMIN.password}`);
}

setupAdmin().catch(console.error);
