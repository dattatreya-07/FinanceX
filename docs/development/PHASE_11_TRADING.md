# Phase 11 — Paper Trading

**Project**: FinanceX
**Status**: `COMPLETE`
**Date**: September 6, 2026

---

## 1. Objective
Establish authoritative, server-validated paper trading in Practice Lab via `tradingService.ts`, ensuring the client is never trusted to mutate balances or holdings directly.

## 2. Architecture & Rules
```text
User initiates BUY / SELL in Practice Lab
                 ↓
`tradingService.executeTrade(userId, demoAccountId, instrumentId, type, quantity, price)`
                 ↓
Validate account existence in `public.demo_accounts`
Validate sufficient `virtual_balance` for BUY orders
                 ↓
Update `demo_accounts.virtual_balance`
Insert record into `public.demo_transactions`
Update / insert position into `public.demo_holdings`
                 ↓
Return updated authoritative balance to UI
```

## 3. Implementation Summary
- **Instruments**:
  - `tradingService.getInstruments()` reads active equities, bonds, and mutual funds from `public.instruments`.
- **Demo Accounts & Balances**:
  - `tradingService.getDemoAccount(userId)` retrieves the user's virtual trading account (`virtual_balance`, currency).
- **Holdings & Ledger**:
  - `tradingService.getHoldings(demoAccountId)` retrieves positions.
  - `tradingService.getTransactions(demoAccountId)` retrieves transaction records.
- **Trade Execution**:
  - Direct client-side balance manipulation is prevented. All orders must validate balance sufficiency and execute transactions atomically.

## 4. Verification & Gate Check
- [x] Paper trading schema implemented (`instruments`, `demo_accounts`, `demo_holdings`, `demo_transactions`)
- [x] Client cannot directly manipulate virtual balances
- [x] Trade validation enforced
- [x] Phase 11 Gate passed
