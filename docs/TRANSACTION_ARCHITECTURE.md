# Transaction Architecture

## Overview

Transactions are modeled with a **full lifecycle**, **state machine**, **central service**, and **eligibility/calculator logic**. The UI (Transactions page, Active Tracker, and request flows) is driven by this layer.

## 1. Transaction Types

- Loan  
- Withdrawal  
- Transfer  
- Rebalance  
- Rollover  
- Roth Conversion (future)

## 2. Transaction States (Lifecycle)

| Status               | Progress | Next valid states                          |
|----------------------|----------|--------------------------------------------|
| `draft`              | 5%       | submitted, cancelled                       |
| `submitted`          | 20%      | under_review, cancelled                    |
| `under_review`       | 40%      | verifying_documents, approved, rejected, cancelled |
| `verifying_documents`| 60%      | approved, rejected, under_review           |
| `approved`           | 80%      | funded, cancelled                         |
| `rejected`           | 80%      | —                                          |
| `funded`             | 100%     | completed                                  |
| `cancelled`          | 0%       | —                                          |
| `completed`          | 100%     | —                                          |

- **Active Tracker** shows transactions whose status is one of: draft, submitted, under_review, verifying_documents, approved.  
- Progress bar uses the **progress percentage** for the current status (or `transaction.progressPercentage` when set).

## 3. Data Model

See `src/types/transactions.ts` and `src/types/transactionLifecycle.ts`.

Each transaction has (among others):

- `id`, `userId`, `planId`, `type`, `amount`, `status`
- `createdAt`, `updatedAt`, `submittedAt`, `approvedAt`, `fundedAt`
- `estimatedCompletion`, `progressPercentage`
- `requiredDocuments[]`, `eligibilitySnapshot`, `impactOnBalance`, `notes`
- Loan-specific: `repaymentTermMonths`, `interestRate`, `monthlyPayment`, `nextPaymentDate`
- Withdrawal-specific: `taxWithholdingPercent`, `penaltyApplied`

## 4. State Machine & Service

- **State machine**: `src/types/transactionLifecycle.ts`  
  - `getProgressFromStatus(status)`  
  - `canTransition(from, to)`  
  - `normalizeLifecycleStatus(status)` (e.g. `active` → `submitted`)

- **Transaction service**: `src/services/transactionService.ts`  
  - `createTransaction(type, userId?, planId?)`  
  - `getTransaction(id)`, `listTransactions(userId?)`, `listActiveTrackerTransactions(userId?)`  
  - `updateTransaction(id, updates)`  
  - `submitTransaction(id)` (draft → submitted)  
  - `cancelTransaction(id)`, `deleteTransaction(id)`

All mutations go through the service so status and progress stay consistent.

## 5. Loan

- **Eligibility**: `src/services/loanEligibility.ts`  
  - Max = min(50% vested, plan cap e.g. 50k) − outstanding loans.  
  - Optional rule: disallow second loan when one is outstanding (`allowSecondLoan: false`).

- **Calculator**: `src/services/loanCalculator.ts`  
  - Monthly payment: `P × r / (1 - (1 + r)^-n)`.  
  - Total interest, optional retirement impact %.

- **Flow**:  
  - Route: `/transactions/loan/start` (or `/transactions/loan/new` → redirects to `start`).  
  - Steps: Eligibility → Loan Amount → Repayment Terms → Review & Submit.  
  - On submit: amount/impact saved, then `submitTransaction(id)` (status → submitted, progress 20%).

## 6. Withdrawal

- **Eligibility / penalty**: `src/services/withdrawalEligibility.ts`  
  - If age < 59.5 → early withdrawal penalty applies.  
  - UX rule: when penalty applies, require an acknowledgment checkbox before submit.

## 7. Draft Persistence

- **Module**: `src/lib/transactionDraftPersistence.ts`  
- Draft (step index + step data) is saved to **sessionStorage** when:  
  - step or data changes,  
  - or on `beforeunload`.  
- On re-entry to the same transaction (same `transactionId`), draft is restored so the user can continue the flow.

## 8. UX Rules (summary)

- **Loan**: Block submit if amount > max allowed (eligibility).  
- **Loan**: When outstanding loan > 0, max is reduced; optionally block second loan.  
- **Withdrawal**: When age < 59.5, show penalty warning and require acknowledgment.  
- **All**: When user leaves mid-flow, save draft (sessionStorage).  
- **Active Tracker**: Progress and ETA come from status / `progressPercentage` and `estimatedCompletion`.

## 9. API Layer (future)

Planned endpoints:

- `POST /transactions`, `GET /transactions?userId`, `PATCH /transactions/:id`, `DELETE /transactions/:id`
- `GET /loan/eligibility`, `GET /withdrawal/eligibility`
- `POST /documents/upload`

The current **transaction service** and **store** can be swapped for these APIs without changing the UI contract.
