# SplitSquad - WhatsApp Bill-Splitting App Implementation Plan

## Context

Building a production-ready WhatsApp bill-splitting app using parallel subagents for faster development. The app uses a multi-step conversational flow with SQLite storage and Tailwind CSS for the UI. All the code updates should be pushed to https://github.com/Mevin-9710/SplitSquad.git

**Build Strategy:** 4 parallel subagents
- **Agent 1:** Foundation + Backend (package.json, database, models, services, WhatsApp bot)
- **Agent 2:** Frontend (views, CSS, Tailwind config, public assets)
- **Agent 3:** API + Web Routes (Express routes, EJS integration)
- **Agent 4:** E2E Testing (Playwright verification, screenshots)

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    SplitSquad                           |
├──────────────────┬──────────────────┬───────────────────┤
│  WhatsApp Bot    │   Express API    │     SQLite        │
│  (Baileys)       │   Server         │     Database      │
│                  │                  │                   │
│  • State Machine │  • REST API      │  • splits         │
│  • Commands      │  • Web Pages     │  • participants   │
│  • QR Auth       │  • Middleware    │  • sessions       │
└──────────────────┴──────────────────┴───────────────────┘
```

## Project Structure

```
/mnt/steamgames/SplitSquad/
├── package.json
├── src/
│   ├── index.js                    # App entry point
│   ├── config/
│   │   └── index.js                # Config management
│   ├── database/
│   │   ├── connection.js           # SQLite connection
│   │   └── schema.js               # Schema + migrations
│   ├── models/
│   │   ├── split.js                # Split CRUD
│   │   ├── participant.js          # Participant CRUD
│   │   └── session.js              # Session CRUD
│   ├── services/
│   │   ├── whatsapp/
│   │   │   ├── client.js           # Baileys wrapper
│   │   │   └── handlers.js         # Message handlers
│   │   ├── session/
│   │   │   └── manager.js          # State machine
│   │   └── split/
│   │       └── service.js          # Business logic
│   ├── routes/
│   │   ├── api/
│   │   │   └── splits.js           # API routes
│   │   └── web/
│   │       └── index.js            # Web routes + EJS
│   ├── middleware/
│   │   └── errorHandler.js         # Error handling
│   └── utils/
│       └── logger.js               # Winston logger
├── public/
│   ├── css/
│   │   └── style.css               # Compiled Tailwind output
│   ├── js/
│   │   ├── app.js                  # Main app logic
│   │   └── utils/
│   │       └── format.js           # Formatters (₹, dates)
│   └── images/
│       └── logo.svg                # App logo
├── views/
│   ├── index.ejs                   # Landing page
│   └── split.ejs                   # Split detail page
├── .env.example
├── .gitignore
├── tailwind.config.js              # Tailwind config
└── src/
    └── input.css                   # Tailwind source
```

## Database Schema

**splits table:** id, description, total_amount (paise), created_by, created_at, status
**participants table:** id, split_id, name, phone, amount (paise), settled, settled_at
**sessions table:** phone, state, current_split_id, temp_data, updated_at

## Session States

```
IDLE → AWAITING_AMOUNT → AWAITING_DESC → AWAITING_PARTICIPANTS → DONE
         ↑                                                                   │
         └─────────────────────────────────── cancel ───────────────────────┘
```

## Agent Tasks

### Agent 1: Foundation + Backend
Build these files:
1. `package.json` - express, better-sqlite3, baileys, ejs, uuid, winston, dotenv, tailwindcss
2. `.env.example` - PORT, DATABASE_PATH
3. `src/config/index.js` - config loader from .env
4. `src/utils/logger.js` - Winston logger
5. `src/database/connection.js` - SQLite init with better-sqlite3
6. `src/database/schema.js` - Create splits, participants, sessions tables
7. `src/models/split.js` - createSplit(), getSplitById(), getHistoryByPhone()
8. `src/models/participant.js` - addParticipant(), getParticipantsBySplitId()
9. `src/models/session.js` - getSession(), setSession(), clearSession()
10. `src/services/session/manager.js` - State machine (IDLE, AWAITING_AMOUNT, AWAITING_DESC, AWAITING_PARTICIPANTS)
11. `src/services/split/service.js` - Business logic combining models
12. `src/services/whatsapp/client.js` - Baileys wrapper with auth persistence, QR generation
13. `src/services/whatsapp/handlers.js` - Command parser (!new, !history, !cancel, !help) and response handlers
14. `src/index.js` - App bootstrap, graceful shutdown, route wiring
15. `src/middleware/errorHandler.js` - Global error handler

### Agent 2: Frontend
Build these files:
1. `tailwind.config.js` - WhatsApp green (#25D366), custom fonts
2. `src/input.css` - Tailwind directives
3. `public/css/style.css` - Compiled output (can regenerate with npx tailwindcss)
4. `views/index.ejs` - Landing page with hero, recent splits list, how-to-use section
5. `views/split.ejs` - Split detail page with participants, amounts, status
6. `public/js/app.js` - Fetch splits from API, render cards
7. `public/js/utils/format.js` - formatCurrency(₹), formatDate()
8. `public/images/logo.svg` - Simple wallet/split icon

### Agent 3: API + Web Routes
Build these files:
1. `src/routes/api/splits.js`:
   - POST /api/splits - Create split { description, amount, participants[] }
   - GET /api/splits/:id - Get split with participants
   - GET /api/health - Health check
2. `src/routes/web/index.js`:
   - GET / - Render landing page with recent splits
   - GET /split/:id - Render split detail page
3. Update `src/index.js` to mount these routes

### Agent 4: E2E Testing
Using ecc:e2e-runner agent or Playwright skill:
1. Start the app (`node src/index.js`)
2. Verify landing page at `/`
3. Test QR code page at `/qr`
4. Run Playwright tests:
   - Landing page loads with correct title
   - No console errors
   - Footer present
5. Take screenshots for verification
6. Report any issues to parent agent

## WhatsApp Commands

| Command | Handler |
|---------|---------|
| `!new` | Set state to AWAITING_AMOUNT |
| `!history` | Query splits by phone |
| `!cancel` | Clear session state |
| `!help` | Send help message |
| `<amount>` | (in AWAITING_AMOUNT) Store amount, ask for description |
| `<text>` | (in AWAITING_DESC) Store description, ask for participants |
| `Name,Amount` | (in AWAITING_PARTICIPANTS) Add participant |
| `equal` | (in AWAITING_PARTICIPANTS) Split remaining equally |
| `done` | (in AWAITING_PARTICIPANTS) Create split |

## Multi-Step Flow Example

```
You: !new
SplitSquad: Enter total amount (₹):
You: 450
SplitSquad: Enter description (or 'skip'):
You: Pizza night
SplitSquad: Add participants. Format: Name,Amount
             Type 'equal' to split equally or 'done' when finished:
You: Rahul,150
SplitSquad: Added Rahul: ₹150. Remaining: ₹300
You: equal
SplitSquad: Added 2 people: ₹150 each
You: done
SplitSquad: ✅ Split created!
            View online: http://localhost:3000/split/<id>
```

## Amount Handling

- Input: "450" or "1250.50" (rupees, decimal allowed)
- Storage: Store as integer paise (45000, 125050)
- Display: Format with ₹ symbol

## Critical Files

| File | Purpose |
|------|---------|
| `src/services/session/manager.js` | Core state machine |
| `src/services/whatsapp/client.js` | Baileys wrapper |
| `src/database/schema.js` | DB setup |
| `src/services/split/service.js` | Business logic |
| `src/index.js` | App bootstrap |

## Verification Plan

1. `npm install` - Install dependencies
2. `node src/index.js` - Start server
3. `curl http://localhost:3000/api/health` - Health check
4. Open `http://localhost:3000` - Landing page
5. Scan QR code with WhatsApp
6. Send `!help` via WhatsApp
7. Create a test split: `!new` → amount → description → participants → `done`
8. View split at `/split/:id`
9. Take screenshots with Playwright

## Dependencies

```json
{
  "express": "^4.18.2",
  "better-sqlite3": "^9.4.3",
  "@whiskeysockets/baileys": "^6.5.0",
  "ejs": "^3.1.9",
  "uuid": "^9.0.0",
  "winston": "^3.11.0",
  "dotenv": "^16.4.1"
}
```

**Dev Dependencies:**
```json
{
  "tailwindcss": "^3.4.0"
}
```