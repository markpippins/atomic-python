// MongoDB initialization script
db = db.getSiblingDB('admin');
db.createUser({
  user: 'mongoUser',
  pwd: 'somePassword',
  roles: [
    { role: 'readWrite', db: 'media_metadata' },
    { role: 'dbAdmin', db: 'media_metadata' }
  ]
});

// Create the media_metadata database by inserting a temporary document
db = db.getSiblingDB('media_metadata');
db.temp_collection.insertOne({created: new Date()});
db.temp_collection.drop();