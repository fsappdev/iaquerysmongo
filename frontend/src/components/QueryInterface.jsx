import React, { useState } from 'react';
import { sendNaturalQuery } from '../services/api';

export default function QueryInterface({ onResponse }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    const response = await sendNaturalQuery(query);
    onResponse(response);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="Escribe tu consulta en lenguaje natural..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          required
        />
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Consultando...' : 'Consultar'}
        </button>
      </div>
    </form>
  );
}