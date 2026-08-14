import { createAdminClient } from "./admin";

type AuditAction = "create" | "update" | "delete" | "login" | "logout";

/** Writes one row to `audit_log`. Never throws — a failed audit write must not break the request it's logging. */
export async function logAudit(params: {
  action: AuditAction;
  table: string;
  recordId?: string;
  oldData?: unknown;
  newData?: unknown;
}) {
  const admin = createAdminClient();
  const { error } = await admin.from("audit_log").insert({
    action: params.action,
    table_name: params.table,
    record_id: params.recordId ?? null,
    old_data: params.oldData ?? null,
    new_data: params.newData ?? null,
  });

  if (error) {
    console.error("[audit_log] failed to write:", error.message);
  }
}
