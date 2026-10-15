export default function HomePage() {
  // Scaffold landing page. This previously redirected to /now, a route
  // that does not exist yet; the redirect 404'd every visit. The Now
  // surface is planned (see docs/ROADMAP.md), not built, so this page
  // says exactly that and points at what is real today.
  return (
    <main style={{ maxWidth: 640, margin: "4rem auto", padding: "0 1.5rem", lineHeight: 1.6 }}>
      <h1>LUMEN</h1>
      <p>
        An AI safety and architecture design study for a Catholic platform:
        guardrails as code, citations enforced, sacramental boundaries kept
        by runtime checks rather than policy.
      </p>
      <h2>What is real today</h2>
      <ul>
        <li>
          A guarded catechism Q&amp;A demo (packages/catechism-rag/demo) that
          answers from a public domain catechism with citations and refuses
          sacrament-substitution and imitation requests, evaluated on a
          published case set.
        </li>
        <li>
          A liturgical calendar engine (packages/liturgy) whose smoke checks
          pass against published Easter dates.
        </li>
      </ul>
      <h2>What is not built yet</h2>
      <p>
        The Now surface this page once redirected to, the parish and diocese
        apps, and the API are scaffolds. They are labeled as such in this
        repository, and nothing here should be read as a working product.
      </p>
    </main>
  );
}
