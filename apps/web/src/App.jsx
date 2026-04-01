import { useMemo, useState } from 'react';

function randomEmail(prefix) {
  return `${prefix}.${Date.now()}@domesta.local`;
}

export function App() {
  const [apiBaseUrl, setApiBaseUrl] = useState('http://localhost:4000');
  const [city, setCity] = useState('Mar del Plata');
  const [minExp, setMinExp] = useState(1);
  const [maxRate, setMaxRate] = useState(5000);
  const [status, setStatus] = useState('Listo para probar Domesta.');
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);

  const normalizedBase = useMemo(() => apiBaseUrl.replace(/\/$/, ''), [apiBaseUrl]);

  async function checkHealth() {
    setLoading(true);
    try {
      const res = await fetch(`${normalizedBase}/health`);
      const data = await res.json();
      setStatus(`API online: ${JSON.stringify(data)}`);
    } catch (error) {
      setStatus(`No se pudo conectar a la API (${normalizedBase}).`);
    } finally {
      setLoading(false);
    }
  }

  async function seedDemoWorker() {
    setLoading(true);
    try {
      const payload = {
        role: 'worker',
        fullName: 'Ana Demo',
        email: randomEmail('ana'),
        password: '123456',
        city: 'Mar del Plata',
        hourlyRate: 3500,
        experienceYears: 4,
        availability: ['Lunes mañana', 'Miércoles tarde']
      };

      const res = await fetch(`${normalizedBase}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.error || 'Error registrando worker demo');
      }

      setStatus('Worker demo creado. Ahora podés buscar resultados.');
      await searchWorkers();
    } catch (error) {
      setStatus(`Error al crear demo: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  async function searchWorkers() {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        city,
        minExp: String(minExp),
        maxRate: String(maxRate)
      });

      const res = await fetch(`${normalizedBase}/workers/search?${query.toString()}`);
      const data = await res.json();
      setWorkers(data);
      setStatus(`Búsqueda completada: ${data.length} worker(s) encontrado(s).`);
    } catch (error) {
      setStatus(`Error al buscar workers: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container">
      <header>
        <h1>Domesta Demo Visual</h1>
        <p>
          Probá el MVP visual: conectá con la API, cargá un worker demo y ejecutá búsquedas.
        </p>
      </header>

      <section className="card grid">
        <label>
          API Base URL
          <input value={apiBaseUrl} onChange={(e) => setApiBaseUrl(e.target.value)} />
        </label>
        <div className="actions">
          <button onClick={checkHealth} disabled={loading}>Verificar API</button>
          <button onClick={seedDemoWorker} disabled={loading}>Cargar worker demo</button>
        </div>
      </section>

      <section className="card grid">
        <h2>Buscar trabajadores</h2>
        <div className="filters">
          <label>
            Ciudad
            <input value={city} onChange={(e) => setCity(e.target.value)} />
          </label>
          <label>
            Mín. experiencia (años)
            <input type="number" value={minExp} onChange={(e) => setMinExp(Number(e.target.value))} />
          </label>
          <label>
            Tarifa máxima (ARS)
            <input type="number" value={maxRate} onChange={(e) => setMaxRate(Number(e.target.value))} />
          </label>
        </div>
        <button onClick={searchWorkers} disabled={loading}>Buscar ahora</button>
      </section>

      <section className="card">
        <h2>Estado</h2>
        <p>{status}</p>
      </section>

      <section className="card">
        <h2>Resultados</h2>
        {workers.length === 0 ? (
          <p>Sin resultados todavía.</p>
        ) : (
          <ul>
            {workers.map((w) => (
              <li key={w.id}>
                <strong>{w.fullName}</strong> — {w.city} — ARS {w.hourlyRate}/h — {w.experienceYears} años
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
