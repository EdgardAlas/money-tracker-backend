# Personal Finance SaaS – Backend [Work In Progress]

This repository contains the backend for a multi-tenant personal finance SaaS platform. It provides features such as user authentication, account and transaction management (including recurring transactions), budgeting by category, savings goals, and tier-based usage limits.

## Features

- Secure user authentication
- Multi-tenant architecture with `Free`, `Pro`, and `Premium` tiers
- Tier-based limits on budgets, accounts, goals, and recurring transactions
- Support for recurring income and expenses
- Budgeting by period: monthly, weekly, or yearly
- Global and user-defined categories
- Timezone and currency preferences per user
- UUIDv7 identifiers for time-ordered uniqueness

## Requirements

- **PostgreSQL ≥ 17**
- **Node.js ≥ 20**
- **UUIDv7 extension** for PostgreSQL: [fboulnois/pg_uuidv7](https://github.com/fboulnois/pg_uuidv7)
