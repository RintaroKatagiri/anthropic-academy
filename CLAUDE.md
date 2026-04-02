# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

UIGen is an AI-powered React component generator with live preview. Users describe components via chat, Claude generates them using tool calls, and results are shown in a real-time preview with a virtual file system (nothing written to disk).

## Commands

```bash
# Initial setup (install deps + Prisma generate + migrate)
npm run setup

# Development server (Turbopack)
npm run dev

# Production build
npm run build

# Lint
npm run lint

# Run all tests
npm test

# Run a single test file
npx vitest run src/lib/__tests__/file-system.test.ts

# Reset database
npm run db:reset
```

## Environment

- `ANTHROPIC_API_KEY` in `.env` is optional. Without it, the app uses a mock provider that returns static components instead of calling Claude.

## Architecture

### Key Data Flow

1. User sends a message → `POST /api/chat` (route.ts)
2. Route calls `streamText()` with the Claude model + two tools: `str_replace_editor` and `file_manager`
3. Claude streams back tool calls that mutate a `VirtualFileSystem` (in-memory, serialized as JSON in the `Project.data` DB column)
4. On stream completion, the updated file system is saved to SQLite via Prisma
5. The frontend `FileSystemProvider` updates state, triggering re-render of `PreviewFrame`
6. `PreviewFrame` runs the JSX through `jsx-transformer.ts` (Babel standalone) and renders it in an iframe

### State Management

Two React contexts wrap the app:
- `ChatProvider` (`src/lib/contexts/chat-context.tsx`) — wraps Vercel AI SDK's `useChat` hook
- `FileSystemProvider` (`src/lib/contexts/file-system-context.tsx`) — owns the `VirtualFileSystem` instance

### LLM / Tools

- `src/lib/provider.ts` — factory that returns either the real Anthropic model or a mock
- `src/lib/prompts/generation.tsx` — system prompt guiding Claude on component generation style
- `src/lib/tools/str-replace.ts` — tool for in-place file edits (mirrors a common LLM editor pattern)
- `src/lib/tools/file-manager.ts` — tool for create/delete/rename operations

### Authentication

JWT sessions stored in HttpOnly cookies. `src/middleware.ts` protects routes. Server Actions in `src/actions/` handle sign-up/sign-in/sign-out. Anonymous users' work is tracked in `localStorage` via `src/lib/anon-work-tracker.ts` and merged into their account on sign-up.

### Database

Prisma + SQLite. Two models: `User` and `Project`. The entire virtual file system for a project is stored as a JSON blob in `Project.data`. Schema is at `prisma/schema.prisma`.

### Testing

Vitest with jsdom + React Testing Library. Tests live alongside the code in `__tests__/` subdirectories. The mock LLM provider makes AI behavior testable without an API key.

## Code Style

- Do not over-comment code. Only add comments where the logic is non-obvious.
