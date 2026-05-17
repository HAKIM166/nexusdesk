# NexusDesk Architecture

NexusDesk is a large scalable SaaS-style dashboard platform built with Next.js App Router, React 19, TypeScript, Tailwind CSS v4, Zustand, Framer Motion, Recharts, and FullCalendar.

The project supports:
- Arabic / English localization
- Dark / Light themes
- AI chat
- Projects management
- Tasks management
- Clients management
- Dashboard analytics
- Calendar/events
- Zustand global stores
- Supabase integrations

---

# Architecture Rules

- Treat this as an advanced production-level project.
- Preserve the existing architecture.
- Avoid rewriting full files unless explicitly requested.
- Prefer scalable reusable solutions.
- Keep domain separation intact.
- Respect current folder structure.

---

# App Structure

## src/app
Uses Next.js App Router with:
- locale routing
- api routes
- layouts
- dashboard pages

Main sections:
- dashboard
- clients
- projects
- tasks
- settings
- messages-ai
- calendar

---

# Components Structure

Components are domain-based:

- ai
- calendar
- clients
- common
- dashboard
- layout
- projects
- tasks
- ui

Reusable UI components are stored in:
src/components/ui

---

# State Management

Uses Zustand stores inside:
src/store

Stores include:
- client-store
- notification-store
- project-store
- task-store
- ui-store

---

# Services Layer

Business logic is separated into:
src/services

Examples:
- ai.service.ts
- clients.service.ts
- projects.service.ts

---

# Localization

Translations are stored in:
src/messages

Files:
- ar.json
- en.json

Do not hardcode text inside components.

---

# Theme System

Project supports:
- dark mode
- light mode

Theme logic:
- use-theme.ts
- theme.css

Do not break theme compatibility.

---

# Utilities

Shared helpers/utilities are inside:
src/lib

Includes:
- formatters
- dashboard helpers
- constants
- utilities

---

# Supabase

Supabase logic is isolated inside:
src/lib/supabase

Do not move Supabase logic outside its structure.

---

# Development Rules

- Always mention exact file paths when editing code.
- Preserve current component structure.
- Keep reusable patterns.
- Prefer modular scalable code.
- Avoid unnecessary dependencies.
- Avoid large unsafe refactors.
- Keep TypeScript types consistent.