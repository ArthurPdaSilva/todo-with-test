export function sanitizeStr(str: string): string {
  return !str || typeof str !== "string" ? "" : str.trim().normalize();
}
