

# 05-instruction-agent

A tiny agent that reads a freeform `instructions.md` file and, if it finds a request for **“smoke tests”**, generates a single green test file under `tests/`.
No MCP, no AST, no external processes beyond running tests with Vitest.

---

## Goals

* ✅ Show a minimal agent that consumes natural‑language instructions.
* ✅ Auto‑create a **smoke test** for the code in `src/`.
* ✅ Run entirely with **npm + TypeScript + Vitest**.

---

## Prerequisites

* Node.js 18+ (20+ recommended)
* npm

---

## Quickstart

```bash
cd 05-instruction-agent
npm install

# 1) Run the agent — it reads instructions.md and may create a smoke test
npm run agent

# 2) Run tests (Vitest)
npm test
```

---

## How it works

1. The agent (`agent/main.ts`) reads `instructions.md`.
2. If it finds phrases like **“smoke tests”**, it writes:

   ```
   tests/smoke.auto.test.ts
   ```

   The test verifies the module loads and, if `greet` exists in `src/index.ts`, that it returns `"hello, <name>"`.
3. The agent prints a short summary of what it did and hints to run `npm test`.

---

## Project structure

```
05-instruction-agent
├─ package.json
├─ tsconfig.json
├─ instructions.md        # freeform instructions (HE/EN)
├─ src/
│  └─ index.ts            # tiny demo function (greet)
├─ tests/                 # created automatically if missing
└─ agent/
   └─ main.ts             # the minimal agent
```

---

## Key files

### `instructions.md` (example)

```md
Create smoke tests for the code. I will summarize manually afterwards.
```

### `src/index.ts` (example)

```ts
export function greet(name: string) {
  return `hello, ${name}`;
}
```

### `agent/main.ts`

* Minimal intent detection (looks for "smoke tests").
* Writes `tests/smoke.auto.test.ts` if requested.
* Prints a concise summary of actions.

---

## npm scripts

```json
{
  "scripts": {
    "agent": "tsx agent/main.ts",
    "test": "vitest run --reporter=dot"
  }
}
```

---

## Acceptance criteria

* `npm run agent` creates `tests/smoke.auto.test.ts` (or reports no actionable instruction).
* `npm test` exits with code 0 and at least one test passes.

---

## Customize

* **Change the trigger**: edit the regex in `agent/main.ts` to support more phrasings.
* **Change the smoke test**: modify the `smokeTestBody()` template in `agent/main.ts`.

---

## Next steps (optional)

* Add more simple intents: `lint`, "create file", "append text" (still no MCP).
* Later, introduce MCP for stricter write permissions (e.g., only `tests/**`) and smooth KIRO integration.
