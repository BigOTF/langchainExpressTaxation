# Taxation AI API

Ask questions about Nigerian tax law and get AI-generated answers.

**Base URL:** `https://langchainexpresstaxation-1.onrender.com`

## GET /

Checks that the API is running.

```bash
curl https://langchainexpresstaxation-1.onrender.com/
```

Response:

```json
{ "msg": "Welcome to the Taxation langchain api" }
```

## POST /api/ask

Ask a question.

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
{
  "question": "what is the punishment for tax evasion"
}
```

**Example**

```bash
curl -X POST https://langchainexpresstaxation-1.onrender.com/api/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "what is the punishment for tax evasion"}'
```

**Success (200)**

```json
{ "answer": "..." }
```

**Errors**

| Status | Meaning |
|---|---|
| 400 | Invalid body (question missing, empty, or too long) |
| 502 | Could not get an answer. Wait a moment and retry |

## JavaScript example

```javascript
const res = await fetch("https://langchainexpresstaxation-1.onrender.com/api/ask", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ question: "what is the punishment for tax evasion" }),
});

const data = await res.json();
console.log(data.answer);