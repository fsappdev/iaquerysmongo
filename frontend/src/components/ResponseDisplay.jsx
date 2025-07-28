import React from 'react';

export default function ResponseDisplay({ response }) {
  if (!response) return null;
  if (!response.success) return <div className="alert alert-danger">{response.error}</div>;

  const { result, explanation, mongoQuery } = response.data;

  return (
    <div className="card">
      <div className="card-body">
        <h5>Resumen</h5>
        <p>{result.summary}</p>
        <h6>Datos</h6>
        <pre>{result.data}</pre>
        {result.insights && <div><strong>Insights:</strong> {result.insights}</div>}
        <hr />
        <small>
          <strong>Consulta MongoDB:</strong> {JSON.stringify(mongoQuery)}
          <br />
          <strong>Explicación:</strong> {explanation}
        </small>
      </div>
    </div>
  );
}