# Agent↔Agent via File Mailbox (For Tutorial)

We implement **Front→Back** in a disciplined way: the **Frontend** never touches Backend code. Instead, it writes a **change request** as a JSON file in an outgoing folder; the **orchestrator** reads the request, invokes the **Backend Agent**, and collects results. This gives you FE→BE flow with **auditability, policy, and strict boundaries**.

## 1) File‑based communication channel (Mailbox)

```
comms/
  requests/
    to-backend/       # FE places requests destined for BE
    to-frontend/      # (optional) BE replies to FE
  events/
    from-backend/     # BE places status/results
    from-frontend/    # (optional) FE emits events
```

**Why files?** Simple for npm/Node, transparent for learners, and easy to enforce via `writePaths` in policy.

Update policy (agents.json):

* **frontend‑agent**: include `comms/requests/to-backend/**` in `writePaths`.
* **backend‑agent**: include `comms/events/from-backend/**` (and `outputs/backend/**`) in `writePaths`.

## 2) Minimal message schema (JSON)

**Request** → `comms/requests/to-backend/REQ-<uuid>.json`

```json
{
  "id": "REQ-2025-09-23-abc123",
  "from": "frontend-agent",
  "to": "backend-agent",
  "intent": "API_CHANGE",
  "scope": "backend-users",
  "payload": {
    "resource": "/auth/login",
    "change": "ADD_FIELD",
    "field": { "name": "email", "type": "string", "required": true, "format": "email" }
  },
  "links": { "spec": "contracts/auth/openapi.yaml" },
  "policySnapshot": {
    "writePaths": ["outputs/backend/**"],
    "denyPaths": ["apps/**"]
  },
  "createdAt": "2025-09-23T10:00:00Z"
}
```

**Event/Reply** → `comms/events/from-backend/EVT-<id>.json`

```json
{
  "id": "EVT-2025-09-23-abc123",
  "correlates": "REQ-2025-09-23-abc123",
  "agent": "backend-agent",
  "status": "DONE",
  "artifacts": [
    "outputs/backend/users-api/login-email.patch",
    "outputs/backend/tests/login-email.test.ts"
  ],
  "notes": "Added email to /auth/login DTO and validators; generated tests."
}
```

## 3) Frontend Agent — write a request (example)

```ts
// frontend-agent.ts (snippet)
import { promises as fs } from "fs";
import { join } from "path";
import { randomUUID } from "crypto";

export async function requestBackendApiChange(field = { name:"email", type:"string", required:true }) {
  const id = `REQ-${new Date().toISOString().slice(0,10)}-${randomUUID().slice(0,6)}`;
  const req = {
    id, from: "frontend-agent", to: "backend-agent",
    intent: "API_CHANGE", scope: "backend-users",
    payload: { resource: "/auth/login", change: "ADD_FIELD", field },
    links: { spec: "contracts/auth/openapi.yaml" },
    policySnapshot: { writePaths:["outputs/backend/**"], denyPaths:["apps/**"] },
    createdAt: new Date().toISOString()
  };
  const dir = "comms/requests/to-backend";
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(join(dir, `${id}.json`), JSON.stringify(req, null, 2));
  console.log(`FE → wrote ${dir}/${id}.json`);
}
```

## 4) Orchestrator — read requests & invoke the BE Agent

```ts
// orchestrator.ts (snippet)
import { promises as fs } from "fs";
import { join } from "path";

async function dispatchBackendRequests(backendAgent: any) {
  const dir = "comms/requests/to-backend";
  await fs.mkdir(dir, { recursive: true });
  const files = (await fs.readdir(dir)).filter(f => f.endsWith(".json"));

  for (const f of files) {
    const p = join(dir, f);
    const req = JSON.parse(await fs.readFile(p, "utf8"));
    if (req.to !== "backend-agent") continue; // basic routing

    // lightweight policy guard: restrict writes to outputs/**
    const ok = (req.policySnapshot?.writePaths ?? []).some((w: string) => w.startsWith("outputs/"));
    if (!ok) { console.warn(`Policy blocked for ${f}`); continue; }

    const res = await backendAgent.applyApiChange(req.payload);

    const evt = {
      id: `EVT-${req.id}`,
      correlates: req.id,
      agent: "backend-agent",
      status: "DONE",
      artifacts: res.artifacts ?? [],
      notes: res.notes ?? ""
    };
    const outDir = "comms/events/from-backend";
    await fs.mkdir(outDir, { recursive: true });
    await fs.writeFile(join(outDir, `${evt.id}.json`), JSON.stringify(evt, null, 2));
    await fs.rename(p, join("comms/requests/_processed", f));
  }
}
```

## 5) Backend Agent — produce artifacts only (don’t touch `src`)

```ts
// backend-agent.ts (snippet)
export class BackendAgent {
  async applyApiChange(payload: any) {
    const { resource, change, field } = payload;
    // TODO: create patch/test/notes under outputs/backend/**
    return {
      artifacts: [
        "outputs/backend/users-api/login-email.patch",
        "outputs/backend/tests/login-email.test.ts"
      ],
      notes: `Proposed ${change} ${field.name} in ${resource}`
    };
  }
}
```

## 6) Policy & permissions (must‑have)

* **FE**: may write only to `comms/requests/to-backend/**` and `outputs/frontend/**`. No access to Backend `services/**`/`src/**`.
* **BE**: may write only to `outputs/backend/**` (later: apply patches only upon approval).
* **Orchestrator**: the only one touching both sides; moves messages and enforces policy.

## 7) End‑to‑end acceptance

1. FE Agent writes `REQ-*.json` describing the change (e.g., add `email`).
2. Orchestrator reads the request → runs BE Agent → writes `EVT-*.json`.
3. Artifacts appear in `outputs/backend/**` (patch/test/notes).
4. No FE writes outside `comms/**` or `outputs/frontend/**`.
5. No BE writes outside `outputs/backend/**`.

## 8) Why this fits a tutorial

* **Simple & transparent**: JSON + files → easy to learn and debug.
* **Strong boundaries**: FE initiates, BE implements; orchestrator enforces.
* **Scalable**: swap mailbox for a real queue (SQS/Redis) or add a Contract Agent later without changing the flow.

## 9) Run with `npm run agent`

You already run the orchestrator via `npm run agent`. To integrate the mailbox flow:

1. Create the folders above.
2. Ensure `agents.json` policies include the mailbox and outputs paths.
3. Optional helper scripts in `package.json`:

```json
{
  "scripts": {
    "agent": "tsx agent/orchestrator.ts",
    "agent:fe-request": "tsx agent/frontend-agent.ts request:login-email",
    "agent:mailbox": "tsx agent/orchestrator.ts --mailbox-only",
    "agent:demo": "concurrently \"npm run agent\" \"npm run agent:fe-request\""
  }
}
```

If you use `agent:demo`, install `concurrently`:

```bash
npm i -D concurrently
```

**Typical flow:**

```bash
npm run agent:fe-request   # FE writes a request JSON
npm run agent              # orchestrator processes it and invokes BE Agent
# artifacts → outputs/backend/** ; reply → comms/events/from-backend/
```

