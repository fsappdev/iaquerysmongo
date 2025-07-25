export async function sendNaturalQuery(query) {
    const res = await fetch('http://localhost:4000/api/natural-query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    return await res.json();
  }