// Case-study content for /work/[slug]. Every claim and number below comes from the project's own README.
// Edit freely. `numbers` can be an empty array (the section is then left out).

export type Study = {
  slug: string;
  id: string; // matches the `id` in the WORK array in Portfolio.tsx
  title: string;
  tags: string;
  year?: string;
  repo: string;
  glow: string;
  intro: string;
  problem: string[];
  flow: string[];
  hi?: number; // which node of the flow is highlighted (defaults to the last)
  flowNote: string;
  decisions: { h: string; p: string }[];
  numbers: [string, string][];
  numbersNote?: string;
  limits: string;
  stack: string[];
};

export const STUDIES: Study[] = [
  {
    slug: "fraud-engine",
    id: "fraud",
    title: "Real-Time Fraud Engine",
    tags: "AI · Fintech · Distributed systems",
    year: "2026",
    repo: "https://github.com/Aryan-sagar/Real-Time-Risk-Fraud-Scoring-Engine",
    glow: "#ffa94d",
    intro: "A fraud score only helps if it arrives before the money moves, and it only gets trusted if it can say why.",
    problem: [
      "Fraud is rare, 1.46% of the transactions in this project, and a single transaction rarely looks suspicious on its own. What gives it away is context: how fast the account has been spending, how far it has moved since the last purchase, whether the merchant has a history.",
      "So the engine has to remember each account’s recent behaviour and use it while scoring, inside the same event. And a block with no reason attached is hard for anyone to act on, so every block also comes with an explanation.",
    ],
    flow: ["Transaction event", "Redpanda / Kafka", "Consumer", "Redis feature state", "XGBoost", "Allow or block"],
    flowNote: "Blocked transactions also get a SHAP explanation. Malformed events are sent to a dead letter topic instead of stopping the consumer.",
    decisions: [
      {
        h: "State lives in Redis, not in the model.",
        p: "Per-account counts and sums over one minute, ten minutes and an hour are updated as events arrive, along with average amount, spread, distance and time since the last transaction, and geo-velocity. The model sees behaviour, not just the current amount.",
      },
      {
        h: "The threshold is chosen, not defaulted.",
        p: "The block threshold (0.9168) is picked on the validation set instead of being left at 0.5, and it is saved with the model’s metadata. The REST API and the stream consumer both read it from there, so online decisions match how the model was evaluated.",
      },
      {
        h: "Every block has a reason.",
        p: "In the test scenario, a $950 purchase at a risky merchant, 1,354 km and five minutes after the previous one, implied a speed of about 16,251 km/h. SHAP showed geo-velocity and the ten-minute transaction count as the biggest contributors to the block.",
      },
      {
        h: "Duplicates and bad events are handled up front.",
        p: "Duplicate detection uses a single Redis SADD, which checks and marks in one atomic step, so two copies of the same event can’t both slip through between a check and a write. Malformed messages go to a dead letter topic and the consumer keeps running.",
      },
    ],
    numbers: [
      ["0.7192", "PR-AUC on the test set"],
      ["0.9945", "ROC-AUC on the test set"],
      ["150,300", "synthetic transactions"],
      ["1.46%", "fraud rate in that data"],
    ],
    numbersNote: "From the repo README. The data is synthetic, so these numbers show the pipeline works, not how it would perform on real card traffic.",
    limits:
      "The model is trained on synthetic transactions, and the consumer doesn’t run as its own Docker Compose service yet. Two tests are automated; the other checks (allow, block, duplicate, dead letter) were run by hand. Next on the list are metrics and monitoring, drift checks, CI and load tests.",
    stack: ["Python", "FastAPI", "XGBoost", "SHAP", "Redpanda (Kafka)", "Redis", "Pydantic", "Docker Compose", "pytest"],
  },
  {
    slug: "order-book",
    id: "book",
    title: "Limit Order Book",
    tags: "Systems · Finance",
    year: "2026",
    repo: "https://github.com/Aryan-sagar/Limit-Order-Book-Matching-Engine-Backtester",
    glow: "#4fb3a5",
    intro: "How an exchange decides who trades first, and what a trading strategy really pays to get filled.",
    problem: [
      "A matching engine has to be fair and deterministic: the better price goes first, and at the same price, whoever arrived first. It also has to be fast, because most orders in a real market get cancelled rather than filled.",
      "I built the core of one, then added a market simulator, tick replay, persistence and a backtester on top, to see what strategies cost when they trade against it.",
    ],
    flow: ["Order flow", "Tick replay", "Matching engine", "Trades", "Backtest report"],
    flowNote: "Trades are also written to Parquet and Postgres. A FastAPI layer with API keys and rate limiting wraps the same engine.",
    decisions: [
      {
        h: "Each price level is a queue.",
        p: "Orders at one price wait in a first-in-first-out queue, a heap finds the best price, and a dictionary finds any order by its id. Adding, matching and cancelling all stay cheap.",
      },
      {
        h: "Cancels are lazy.",
        p: "Cancelling just flips a flag, and the order is dropped the next time matching reaches it. Cancels are the common case, and pulling an order out of the middle of a queue is expensive.",
      },
      {
        h: "Trades print at the resting price.",
        p: "That is the standard convention: the order that crossed the spread gets the better price. A counter, not a timestamp, breaks ties, because two orders can arrive in the same nanosecond.",
      },
      {
        h: "The backtester pays real costs.",
        p: "Strategies trade with market orders, so every entry pays slippage, measured against the mid-price at the moment the order was submitted. Sharpe is deliberately not annualised, since the equity curve is sampled at irregular times.",
      },
      {
        h: "A losing backtest is the right answer here.",
        p: "The generated prices are a pure random walk with nothing to exploit, so both built-in strategies lose money after slippage. A separate test with a deterministic uptrend shows the same harness does reward real structure when it exists.",
      },
    ],
    numbers: [
      ["~185,000", "orders per second, one thread, in memory"],
      ["24", "tests, 12 for the engine and 12 for the API"],
      ["~30 bps", "average slippage per trade in the demo"],
      ["0", "invariant violations in a 500-order stress test"],
    ],
    numbersNote: "From the repo README. The benchmark is single-threaded, pure Python, on in-memory data.",
    limits:
      "Prices are floats rather than integer ticks, there is no order amend or self-trade prevention, and API keys sit in an in-memory dictionary. Replication across nodes with Raft is planned but not built.",
    stack: ["Python", "FastAPI", "PyArrow (Parquet)", "PostgreSQL", "Docker Compose", "pytest"],
  },
  {
    slug: "collaborative-editor",
    id: "crdt",
    title: "CRDT Collaborative Editor",
    tags: "Distributed systems · Real-time collaboration",
    year: "2026",
    repo: "https://github.com/Aryan-sagar/Real-Time-Collaborative-Text-Editor-CRDT-based-",
    glow: "#e0654a",
    intro: "Two people type in the same spot at the same moment. Nobody loses a word, and no server decides who was right.",
    problem: [
      "Google Docs, Notion and Figma all answer the same question: how do several people edit the same content at once without overwriting each other? “Last save wins” loses data, and asking a server before every keystroke makes typing feel slow.",
      "In this editor every browser keeps its own copy of the document and resolves conflicts by the same rule, so all copies end up identical no matter what order the edits arrive in. Offline edits merge back in when the connection returns.",
    ],
    flow: ["Browser A, own copy", "WebSocket relay", "Browser B, own copy"],
    hi: 1,
    flowNote: "The server relays edits and keeps a copy for late joiners. It never decides how a conflict resolves.",
    decisions: [
      {
        h: "The algorithm is written from scratch.",
        p: "RGA, implemented without Yjs or any other CRDT library, because the conflict logic is the part worth understanding. Every character gets a unique id and remembers the character to its left, and ties between concurrent inserts are broken by a fixed rule on those ids.",
      },
      {
        h: "The server is a relay, not an authority.",
        p: "Your keystroke appears at once because your browser applies it locally first. That needs a full CRDT in the browser, so the engine exists twice, in Python and in TypeScript, as a line-for-line port.",
      },
      {
        h: "Deletes leave tombstones, and early edits wait.",
        p: "A later edit can still point at a character that was deleted, so deleted characters are marked instead of removed. An edit that arrives before the one it depends on is held back until that one shows up.",
      },
      {
        h: "The bug the unit tests couldn’t see.",
        p: "The Python and TypeScript suites each passed, but the two sides disagreed on the wire format. It only surfaced when a real TypeScript client connected to the real server. The fix was a proper serialization module with round-trip tests, not a patch over the symptom.",
      },
    ],
    numbers: [
      ["2,500 / 2,500", "randomised convergence trials passed"],
      ["35", "automated tests, 13 in Python and 22 in TypeScript"],
    ],
    numbersNote: "From the repo README. The 2,500-trial run was an exploratory script, not part of the checked-in test suite.",
    limits:
      "Documents live in server memory, so a restart loses them. Deleted characters are never cleaned up, inserts take time proportional to document length, and there is no undo or rich text yet. Saving the operation log to a database is the next step.",
    stack: ["Python", "FastAPI", "WebSockets", "React", "TypeScript", "Vite", "pytest", "Vitest"],
  },
  {
    slug: "task-queue",
    id: "queue",
    title: "Distributed Task Queue",
    tags: "Distributed systems",
    year: "2026",
    repo: "https://github.com/Aryan-sagar/Distributed-Task-Queue",
    glow: "#ffa94d",
    intro: "The basic machinery behind background jobs: hand off the work, run it elsewhere, and keep going when a task blows up.",
    problem: [
      "Sending an email, resizing an image or calling a slow API shouldn’t hold up the request that triggered it. A task queue takes the work, stores it, and lets a pool of workers pick it up.",
      "I built the foundation myself to understand queue behaviour and failure isolation, instead of reaching for an existing library.",
    ],
    flow: ["REST API", "Redis queue", "Worker pool, 4 threads", "Task handler", "Result stored"],
    flowNote: "Each task moves from pending to running to success or failed, and its state is stored in Redis.",
    decisions: [
      {
        h: "Redis holds the queue and the task records.",
        p: "A Redis list gives a first-in-first-out queue with atomic operations, and the same store keeps each task’s state. That is what lets the API and the workers run as separate processes.",
      },
      {
        h: "Handlers are looked up by task type.",
        p: "A registry maps a task type to a function, so workers don’t need to know what any task does, and adding a new kind of task doesn’t touch worker code. An unknown task type is marked failed straight away.",
      },
      {
        h: "A failing task doesn’t take its worker down.",
        p: "The exception is caught, the task is marked failed with the error stored, and the worker moves on to the next one.",
      },
      {
        h: "Threads, for now.",
        p: "The workload is assumed to be mostly waiting on I/O, so threads are enough. Task execution is isolated enough that processes or remote workers could replace them later.",
      },
    ],
    numbers: [],
    limits:
      "This is the foundation, not a finished system. Retries, backoff, dead letter queues, timeouts, idempotency and worker heartbeats are on the roadmap but not built, and the tests run against fakeredis rather than a live Redis.",
    stack: ["Python", "FastAPI", "Redis", "Pydantic", "pytest", "fakeredis"],
  },
  {
    slug: "mini-lakehouse",
    id: "lake",
    title: "Mini Lakehouse",
    tags: "Data engineering · Storage systems",
    year: "2026",
    repo: "https://github.com/Aryan-sagar/Mini_Lakehouse",
    glow: "#8b8cf0",
    intro: "A table format on object storage that behaves like a database: atomic commits, snapshots you can travel back to, and schemas that change without rewriting data.",
    problem: [
      "Object storage like S3 is cheap and durable, but it is just files. Two writers can clash, a reader can catch a half-finished write, and renaming a column can mean rewriting the data. Iceberg, Delta and Hudi solve this with a metadata layer.",
      "I built the core of that idea on a local-disk stand-in for S3, then measured it against targets I set up front and wrote down where it misses them.",
    ],
    flow: ["Data files", "Manifest", "Manifest list", "Snapshot", "Metadata pointer"],
    flowNote: "A commit writes these in order. The final conditional write of the pointer is the one moment the commit becomes real.",
    decisions: [
      {
        h: "One conditional write commits everything.",
        p: "Data, manifest and manifest list are written first, then the metadata pointer is written only if nobody else got there first, the same idea as S3’s If-None-Match. Concurrent writers retry instead of losing updates.",
      },
      {
        h: "Readers follow metadata and never list the bucket.",
        p: "A scan reads the metadata once at the start, and that is what gives snapshot isolation: a commit that lands mid-scan simply isn’t visible to it. Time travel is the same mechanism pointed at an older snapshot.",
      },
      {
        h: "Columns have ids, not just names.",
        p: "Adding, dropping and renaming a column become metadata-only commits, and old files still read correctly because they are matched by column id.",
      },
      {
        h: "Compaction fixes the small-file problem.",
        p: "Many small files are merged into fewer large ones with bin-packing. In the benchmark, 50 files became one.",
      },
      {
        h: "Two real bugs, kept in the history.",
        p: "A flaky test exposed a torn read in the conditional-put primitive, fixed by writing a temp file first and then publishing it atomically. A storage-overhead benchmark of 56.7% against a target under 1% exposed metadata history piling up, which led to a cleanup step.",
      },
    ],
    numbers: [
      ["3.7 to 4.3 ms", "median commit latency"],
      ["98.0%", "fewer files after compaction"],
      ["0", "lost updates under contention"],
      ["44", "tests"],
    ],
    numbersNote: "From the repo README, measured on local disk, so latencies are optimistic compared with real S3.",
    limits:
      "Storage overhead after cleanup is still 18.7% against a target under 1%. The cause is that manifest lists grow with every commit, and the fix, merging manifests, isn’t built. It is a single-writer-per-table design with optimistic concurrency: no multi-table transactions, no Iceberg or Delta compatibility, no merge-on-read.",
    stack: ["Python", "PyArrow", "Parquet", "pytest"],
  },
];

export const slugFor = (id: string) => STUDIES.find((s) => s.id === id)?.slug ?? id;