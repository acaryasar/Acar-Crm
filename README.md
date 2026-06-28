This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## WhatsApp AI Agent Demo

The system includes an AI-powered WhatsApp agent for demo purposes. The agent:

1. Collects customer information (name, phone, email, complaint)
2. Validates the information through natural dialogue
3. Suggests available appointment times
4. Creates customer, ticket, and appointment records upon confirmation
5. Sends notifications to both customer and assigned staff

### AI Provider Configuration

The agent supports multiple AI providers through a parametric configuration system:

**Option 1: Mock Mode (Default - No API Required)**
```env
AI_PROVIDER=mock
```
- Uses predefined step-based flow
- No external API calls
- Ideal for testing without API keys

**Option 2: OpenAI API**
```env
AI_PROVIDER=openai
OPENAI_API_KEY="your-openai-api-key-here"
```
- Uses GPT-4o model
- Natural language processing
- Function calling support

**Option 3: Ollama (Local LLM)**
```env
AI_PROVIDER=ollama
OLLAMA_BASE_URL="http://localhost:11434/v1"
OLLAMA_MODEL="llama3"
```
- Uses local LLM (free, no API costs)
- Requires Ollama installation
- OpenAI-compatible API

### Ollama Setup

1. Install Ollama from [ollama.com](https://ollama.com/)
2. Pull a model:
```bash
ollama pull llama3
# or
ollama pull mistral
```
3. Ollama automatically starts on port 11434

### API Endpoint

`POST /api/ai/whatsapp-demo`

Request body:
```json
{
  "message": "Customer message",
  "sessionId": "unique-session-id",
  "reset": false
}
```

The agent uses the configured AI provider to:
- Extract customer information naturally
- Query available appointment slots
- Create CRM records (Customer, Ticket, Appointment)
- Assign available staff automatically

