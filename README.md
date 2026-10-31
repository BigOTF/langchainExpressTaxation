# Taxation AI API

Ask questions about Nigerian tax law and get AI-generated answers based on the Nigeria Tax Act 2025 and related documents.

**Base URL:** `https://langchainexpresstaxation-1.onrender.com`

> Hosted on Render's free tier. After a period of inactivity the server sleeps, so the first request can take 30-60 seconds. Later requests are fast.

## Endpoints

### GET /

Health check.

```bash
curl https://langchainexpresstaxation-1.onrender.com/
```

Response `200`:

```json
{ "msg": "Welcome to the Taxation langchain api" }
```

### POST /api/ask

Ask a question about Nigerian tax law.

**URL:** `https://langchainexpresstaxation-1.onrender.com/api/ask`

**Headers**

| Header | Value |
|---|---|
| Content-Type | application/json |

**Body**

| Field | Type | Required | Rules |
|---|---|---|---|
| question | string | Yes | Not empty, max 500 characters |

```json
{ "question": "what is the punishment for tax evasion" }
```

**Example**

```bash
curl -X POST https://langchainexpresstaxation-1.onrender.com/api/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "what is the punishment for tax evasion"}'
```

**Success `200`**

```json
{
  "answer": "Under the Act, ...",
  "sources": [
    { "file": "tax1.pdf", "page": 42 },
    { "file": "tax2.pdf", "page": 7 }
  ]
}
```

| Field | Type | Description |
|---|---|---|
| answer | string | The answer in plain language |
| sources | array | Documents and pages the answer was based on. May contain duplicates |

If the documents don't cover the question, `answer` is:
`"I don't have enough information in the documents to answer that."`

**Errors**

| Status | Meaning | Body |
|---|---|---|
| 400 | Invalid body (question missing, empty, or over 500 characters) | `{ "errors": [{ "msg": "...", "path": "question" }] }` |
| 502 | Could not get an answer. Wait a moment and retry | `{ "error": "Could not get an answer right now" }` |

## Conversation memory

The API remembers the last 3 exchanges per session, so follow-ups like "what about freelancers?" work. A session is identified by a cookie set by the server, so browser clients must send cookies:

```javascript
fetch(url, { credentials: "include", ... })
```
