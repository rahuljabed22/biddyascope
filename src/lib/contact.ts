/**
 * Normalize a phone/WhatsApp number into digits suitable for https://wa.me/ links.
 */
export function toWhatsAppDigits(raw?: string | null): string {
  const digits = String(raw || "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("01") && digits.length === 11) {
    return `88${digits}`;
  }
  return digits;
}

/**
 * Format a Bangladesh mobile number into local 01XXXXXXXXX display form when stored with 880.
 */
export function formatBdPhoneDisplay(raw?: string | null): string {
  const trimmed = String(raw || "").trim();
  if (!trimmed) return "";
  const digits = trimmed.replace(/\D/g, "");
  if (digits.startsWith("8801") && digits.length === 13) {
    return digits.slice(2);
  }
  return trimmed;
}

/**
 * Build a tel: URI for clickable call links.
 */
export function toTelHref(raw?: string | null): string {
  const digits = String(raw || "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("01") && digits.length === 11) {
    return `tel:+88${digits}`;
  }
  if (digits.startsWith("8801")) {
    return `tel:+${digits}`;
  }
  return `tel:${digits}`;
}
