const express = require('express');
const router = express.Router();
const database = require('../config/database');
const geminiService = require('../services/geminiService');

router.post('/natural-query', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ success: false, error: 'Consulta vacía' });

    const schema = await database.getCollectionsSchema();
    console.log("schema 😣 ",schema);
    const mongoQueryInfo = await geminiService.generateMongoQuery(query, schema);
    console.log("mongoQueryInfo 😣⚖️ ",mongoQueryInfo);
    const db = database.getDb();
    console.log("db 😣 ",db);
    const collection = db.collection(mongoQueryInfo.mongoQuery.collection);
    console.log("collection 😣 ",collection);

    let result;
    switch (mongoQueryInfo.mongoQuery.operation) {
      case 'find':
        result = await collection.find(mongoQueryInfo.mongoQuery.query).limit(100).toArray();
        break;
      case 'count':
        result = await collection.countDocuments(mongoQueryInfo.mongoQuery.query);
        break;
      case 'countDocuments':
        result = await collection.countDocuments(mongoQueryInfo.mongoQuery.query);
        break;
      case 'aggregate':
        result = await collection.aggregate(mongoQueryInfo.mongoQuery.query).limit(100).toArray();
        break;
      default:
        throw new Error('Operación no soportada');
    }
    console.log("result 📽️ 📊 ",result);
    const formattedResponse = await geminiService.formatResponse(result, query, mongoQueryInfo.mongoQuery);
    console.log("formattedResponse �️ 📊 ",formattedResponse);
    res.json({
      success: true,
      data: {
        originalQuery: query,
        mongoQuery: mongoQueryInfo.mongoQuery,
        explanation: mongoQueryInfo.explanation,
        result: formattedResponse,
        rawData: result,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;