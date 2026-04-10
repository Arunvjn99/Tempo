// ─────────────────────────────────────────────
// TransactionRouter — layout + outlet for /transactions/*
// ─────────────────────────────────────────────

import { Outlet } from "react-router-dom";

export function TransactionRouter() {
  return (
    <div className="container-app mx-auto max-w-4xl py-xl">
      <Outlet />
    </div>
  );
}
