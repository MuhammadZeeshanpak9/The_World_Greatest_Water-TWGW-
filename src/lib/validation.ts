export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function isStrongPassword(value: string): boolean {
  if (value.length < 8) return false;
  if (!/[A-Z]/.test(value)) return false;
  if (!/[0-9]/.test(value)) return false;
  if (!/[^A-Za-z0-9]/.test(value)) return false;
  return true;
}

export function isValidPhone(value: string): boolean {
  const digitsOnly = value.replace(/[^\d]/g, "");
  return digitsOnly.length >= 7 && digitsOnly.length <= 15 && /^[\d\s()+-]+$/.test(value);
}

/** Blocks open-redirect vectors — only same-origin relative paths are allowed. */
export function isSafeRedirectPath(path: string | null | undefined): boolean {
  if (!path) return false;
  if (!path.startsWith("/")) return false;
  if (path.startsWith("//")) return false;
  if (path.includes("://")) return false;
  return true;
}

/** Checks an email against the ADMIN_EMAILS allow-list. Being authenticated is not sufficient
 * on its own to reach /admin/* now that public customer registration exists. */
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const allowList = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return allowList.includes(email.toLowerCase());
}
