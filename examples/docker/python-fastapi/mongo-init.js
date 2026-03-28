// Switch to the bookmarks database
db = db.getSiblingDB('bookmarks');

// Create collections with validation
db.createCollection('bookmarks', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['url', 'title'],
      properties: {
        url: { bsonType: 'string', description: 'URL of the bookmark' },
        title: { bsonType: 'string', description: 'Title of the bookmark' },
        description: { bsonType: 'string' },
        tags: { bsonType: 'array', items: { bsonType: 'string' } },
        created_at: { bsonType: 'date' },
        updated_at: { bsonType: 'date' }
      }
    }
  }
});

db.createCollection('tags');

// Create indexes
db.bookmarks.createIndex({ url: 1 }, { unique: true });
db.bookmarks.createIndex({ tags: 1 });
db.bookmarks.createIndex({ created_at: -1 });

// Seed data
db.bookmarks.insertMany([
  {
    url: 'https://fastapi.tiangolo.com',
    title: 'FastAPI Documentation',
    description: 'Modern, fast web framework for building APIs with Python',
    tags: ['python', 'api', 'docs'],
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    url: 'https://www.mongodb.com/docs',
    title: 'MongoDB Documentation',
    description: 'Official MongoDB documentation and tutorials',
    tags: ['database', 'nosql', 'docs'],
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    url: 'https://docs.docker.com',
    title: 'Docker Documentation',
    description: 'Official Docker documentation for containerization',
    tags: ['docker', 'devops', 'docs'],
    created_at: new Date(),
    updated_at: new Date()
  }
]);

print('Database initialized with seed data');
