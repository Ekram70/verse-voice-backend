import mongoose from 'mongoose';

// Source database (current)
const SOURCE_URI = `mongodb+srv://rizwanshuvo_db_user:versevoice999@cluster0.t42mo3d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Target database (client's)
const TARGET_URI = `mongodb+srv://fakharuddinpentu_db_user:versevoice999@cluster0.aujbmom.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Collections to migrate
const COLLECTIONS = [
  'users',
  'blogs',
  'blogrequests',
  'comments',
  'commentreports',
  'contacts',
  'newsletters',
  'likes',
  'favorites',
  'notifications',
  'sitesettings',
  'otps',
  'blacklistedtokens',
  'pendingusers'
];

async function migrate() {
  console.log('Starting migration...\n');

  // Connect to source database
  console.log('Connecting to source database...');
  const sourceConn = await mongoose.createConnection(SOURCE_URI).asPromise();
  console.log('Connected to source database.\n');

  // Connect to target database
  console.log('Connecting to target database...');
  const targetConn = await mongoose.createConnection(TARGET_URI).asPromise();
  console.log('Connected to target database.\n');

  // Get the default database name from source
  const sourceDb = sourceConn.db;
  const targetDb = targetConn.db;

  // Get all collections from source
  const existingCollections = await sourceDb.listCollections().toArray();
  const existingCollectionNames = existingCollections.map(c => c.name);

  console.log('Found collections in source:', existingCollectionNames.join(', '), '\n');

  for (const collectionName of COLLECTIONS) {
    try {
      // Check if collection exists in source
      if (!existingCollectionNames.includes(collectionName)) {
        console.log(`[SKIP] Collection "${collectionName}" does not exist in source database.`);
        continue;
      }

      const sourceCollection = sourceDb.collection(collectionName);
      const targetCollection = targetDb.collection(collectionName);

      // Get all documents from source
      const documents = await sourceCollection.find({}).toArray();

      if (documents.length === 0) {
        console.log(`[SKIP] Collection "${collectionName}" is empty.`);
        continue;
      }

      // Clear target collection first (optional - remove if you want to append)
      await targetCollection.deleteMany({});

      // Insert documents into target
      const result = await targetCollection.insertMany(documents, { ordered: false });
      console.log(`[OK] Migrated ${result.insertedCount} documents from "${collectionName}"`);
    } catch (error) {
      if (error.code === 11000) {
        // Duplicate key error - some documents already exist
        console.log(`[WARN] Some documents in "${collectionName}" already exist (duplicates skipped)`);
      } else {
        console.error(`[ERROR] Failed to migrate "${collectionName}":`, error.message);
      }
    }
  }

  // Close connections
  await sourceConn.close();
  await targetConn.close();

  console.log('\nMigration completed!');
}

migrate().catch(console.error);
