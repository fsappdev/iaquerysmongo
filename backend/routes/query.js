const express = require('express');
const router = express.Router();
const database = require('../config/database');
const geminiService = require('../services/geminiService');

router.post('/natural-query', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ success: false, error: 'Consulta vacía' });

    const schema = await database.getCollectionsSchema();
    const mongoQueryInfo = await geminiService.generateMongoQuery(query, schema);

    const db = database.getDb();
    const collection = db.collection(mongoQueryInfo.mongoQuery.collection);

    let result;
    switch (mongoQueryInfo.mongoQuery.operation) {
      case 'find':
        result = await collection.find(mongoQueryInfo.mongoQuery.query).limit(100).toArray();
        break;
      case 'count':
        result = await collection.countDocuments(mongoQueryInfo.mongoQuery.query);
        break;
      case 'aggregate':
        result = await collection.aggregate(mongoQueryInfo.mongoQuery.query).limit(100).toArray();
        break;
      default:
        throw new Error('Operación no soportada');
    }

    const formattedResponse = await geminiService.formatResponse(result, query, mongoQueryInfo.mongoQuery);

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