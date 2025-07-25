import React, { useState } from 'react';
import QueryInterface from './components/QueryInterface'
import ResponseDisplay from './components/ResponseDisplay'
import './styles/custom.css';

function App() {
  const [response, setResponse] = useState(null);

  return (
    <div className="container py-5">
      <h2 className="mb-4">Consultas Inteligentes a tu Base de Datos</h2>
      <QueryInterface onResponse={setResponse} />
      <ResponseDisplay response={response} />
    </div>
  );
}

export default App;