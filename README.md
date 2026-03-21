# Atlas Health Assistant (English-only)

A lightweight Node + Express + OpenAI web app. The chatbot is built to work in English and delivers non-medical wellness support.

## Setup

1. Copy `.env.example` to `.env` (create if missing):
   - `OPENAI_API_KEY=your-openai-key`
   - `OPENAI_MODEL=gpt-4` (optional)
   - `PORT=3000` (optional)

2. Install deps:
   - `npm install`

3. Run:
   - `npm start`

4. Open http://localhost:3000

## API
- `POST /api/chat` with `{ message: string }`.
- `GET /api/history`.
- `POST /api/reset`.

## English-only behavior
- User inputs recognized as Spanish or containing accents are discouraged.
- Atlas always responds in English.

## Next steps
1. Add Supabase or SQLite message persistence.
2. Add user auth with Sign in / Sign up.
3. Add session context limits and trimming.
4. Add a `warning` badge for non-English inputs on frontend.
5. Add logging + monitoring in production.
