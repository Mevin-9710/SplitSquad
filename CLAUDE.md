# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SplitSquad is a WhatsApp bill-splitting bot using Baileys for WhatsApp Web API, Express for the web server, and SQLite for persistence.

## Commands

```bash
npm install              # Install dependencies
npm start               # Start the server (node src/index.js)
npm run dev             # Start with file watching (--watch mode)
npm test                # Run tests (node --test tests/**/*.js)
npx playwright test     # Run E2E tests
```

For QR code access, the server needs to be reachable externally (use cloudflared or ngrok):
```bash
/tmp/cloudflared tunnel --url http://localhost:3000
```

## Architecture

### State Machine (`src/services/session/manager.js`)

The bot uses a state machine for multi-step conversations:

```
IDLE → AWAITING_AMOUNT → AWAITING_DESC → AWAITING_PARTICIPANTS → DONE
```

- **IDLE**: Ready for commands (`!new`, `!history`, `!help`, `!cancel`)
- **AWAITING_AMOUNT**: Expects rupees as number (converts to paise internally)
- **AWAITING_DESC**: Expects description text
- **AWAITING_PARTICIPANTS**: Expects `Name,Amount` entries, `equal`, or `done`

### Amount Handling

All amounts are stored as **integer paise** in the database (45000 = ₹450.00). The state machine converts rupees to paise on input and formats for display.

### WhatsApp Connection Flow

1. `src/index.js` creates an EventEmitter shared across services
2. `src/services/whatsapp/client.js` initializes Baileys, saves QR to `currentQR` variable
3. QR is served via `/status` endpoint (polled by `/qr` page)
4. Auth state persists to `.auth/` directory (use `useMultiFileAuthState`)

### Database Schema (`src/database/schema.js`)

- **splits**: id, description, total_amount (paise), created_by, created_at, status
- **participants**: id, split_id, name, phone, amount (paise), settled, settled_at
- **sessions**: phone (PK), state, current_split_id, temp_data (JSON), updated_at

### Key Files

| File | Purpose |
|------|---------|
| `src/index.js` | App bootstrap, route mounting, graceful shutdown |
| `src/services/whatsapp/client.js` | Baileys wrapper, connection management |
| `src/services/whatsapp/handlers.js` | Message routing, command handlers |
| `src/services/session/manager.js` | State machine, input processing |
| `src/services/split/service.js` | Business logic, split creation |
| `src/routes/api/splits.js` | REST API endpoints |

## WhatsApp Commands

| Command | Action |
|---------|--------|
| `!new` | Start new bill split |
| `!history` | Show split history |
| `!cancel` | Cancel current session |
| `!help` | Show help message |
| `Name,100` | Add participant (in AWAITING_PARTICIPANTS) |
| `equal` | Split remaining equally |
| `done` | Finalize and create split |

## Environment Variables

Create `.env` from `.env.example`:
- `PORT` - Server port (default: 3000)
- `DATABASE_PATH` - SQLite file path
- `NODE_ENV` - development/production