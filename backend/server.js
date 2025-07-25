require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const database = require('./config/database');
const queryRoutes = require('./routes/query');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api', queryRoutes);

const PORT = process.env.PORT || 4000;

database.connect().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor backend escuchando en puerto ${PORT}`);
  });
}).catch(err => {
  console.error('No se pudo conectar a la base de datos:', err);
});