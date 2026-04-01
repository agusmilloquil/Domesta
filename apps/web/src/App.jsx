const features = [
  'Registro/Login para clientes y trabajadores',
  'Búsqueda por ubicación, experiencia, tarifa y disponibilidad',
  'Solicitudes de trabajo por hora o jornada',
  'Chat interno y reputación',
  'Panel admin para validaciones e incidencias',
  'Asistencia de alta legal de empleo doméstico'
];

export function App() {
  return (
    <main className="container">
      <header>
        <h1>Domesta</h1>
        <p>
          Plataforma para contratar personal doméstico confiable en Mar del Plata,
          con proyección nacional.
        </p>
      </header>

      <section className="card">
        <h2>MVP inicial</h2>
        <ul>
          {features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h2>Propuesta de valor</h2>
        <p>
          Domesta prioriza velocidad de contratación, confianza y empleo registrado,
          incluyendo soporte legal para alta de trabajadores domésticos en Argentina.
        </p>
      </section>
    </main>
  );
}
