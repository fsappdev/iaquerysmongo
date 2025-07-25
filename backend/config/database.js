const { MongoClient } = require('mongodb');

class Database {
  constructor() {
    this.client = null;
    this.db = null;
  }

  async connect() {
    const uri = process.env.MONGODB_URI;
    this.client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await this.client.connect();
    this.db = this.client.db(process.env.DB_NAME || 'empresa_db');
    console.log('Conectado a MongoDB Atlas');
    return this.db;
  }

  getDb() {
    if (!this.db) throw new Error('Base de datos no inicializada');
    return this.db;
  }

  async getCollectionsSchema() {
    const collections = await this.db.listCollections().toArray();
    const schema = {};
    for (const collection of collections) {
      const sampleDoc = await this.db.collection(collection.name).findOne();
      if (sampleDoc) {
        schema[collection.name] = Object.keys(sampleDoc);
      }
    }
    return schema;
  }
}

module.exports = new Database();