import Link from "next/link";
import type { CSSProperties } from "react";
import type { Study } from "./work-data";

export default function CaseStudy({ s, prev, next }: { s: Study; prev: Study; next: Study }) {
  const hi = s.hi ?? s.flow.length - 1;
  return (
    <main className="cs" style={{ "--glow": s.glow } as CSSProperties}>
      <div className="cs-glow" aria-hidden="true" />

      <nav className="cs-top" aria-label="Case study">
        <Link href="/#work">Back to selected work</Link>
        <a href={s.repo} target="_blank" rel="noreferrer">View code</a>
      </nav>

      <header className="cs-head">
        <p className="cs-meta">{s.tags}{s.year ? ` · ${s.year}` : ""}</p>
        <h1>{s.title}</h1>
        <p className="cs-intro">{s.intro}</p>
      </header>

      <figure className="cs-flow">
        <ol className="cs-chain">
          {s.flow.map((n, i) => <li key={n} className={i === hi ? "hi" : undefined}>{n}</li>)}
        </ol>
        <figcaption>{s.flowNote}</figcaption>
      </figure>

      <section className="cs-sec">
        <h2>The problem</h2>
        <div className="cs-body">{s.problem.map((t) => <p key={t}>{t}</p>)}</div>
      </section>

      <section className="cs-sec">
        <h2>How it works</h2>
        <div className="cs-body">
          {s.decisions.map((d) => (
            <div className="cs-dec" key={d.h}>
              <h3>{d.h}</h3>
              <p>{d.p}</p>
            </div>
          ))}
        </div>
      </section>

      {s.numbers.length > 0 && (
        <section className="cs-sec">
          <h2>Numbers</h2>
          <div className="cs-body">
            <div className="cs-nums">
              {s.numbers.map(([n, l]) => <div key={l}><b>{n}</b><span>{l}</span></div>)}
            </div>
            {s.numbersNote && <p className="cs-note">{s.numbersNote}</p>}
          </div>
        </section>
      )}

      <section className="cs-sec">
        <h2>What it doesn’t do yet</h2>
        <div className="cs-body"><p>{s.limits}</p></div>
      </section>

      <section className="cs-sec">
        <h2>Built with</h2>
        <div className="cs-body"><p>{s.stack.join(", ")}</p></div>
      </section>

      <footer className="cs-end">
        <Link className="cs-nl" href={`/work/${prev.slug}`}><span>Previous project</span><strong>{prev.title}</strong></Link>
        <a className="btn solid" href={s.repo} target="_blank" rel="noreferrer">View code</a>
        <Link className="cs-nl r" href={`/work/${next.slug}`}><span>Next project</span><strong>{next.title}</strong></Link>
      </footer>
    </main>
  );
}