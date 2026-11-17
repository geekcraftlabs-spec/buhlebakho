// Universal clipboard copy that works on HTTP (mobile LAN testing) as well
// as HTTPS (production).
//
// Strategy:
// 1. Try modern navigator.clipboard API (requires HTTPS or localhost)
// 2. Fall back to a hidden textarea + document.execCommand("copy")
//    which works in every browser, on every protocol.

export async function copyToClipboard(text: string): Promise<boolean> {
  // Try modern API first
  if (
    typeof navigator !== "undefined" &&
    navigator.clipboard &&
    typeof navigator.clipboard.writeText === "function"
  ) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // fall through to legacy
    }
  }

  // Legacy fallback — works on HTTP
  if (typeof document === "undefined") return false;

  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    // Keep off-screen so it's not visible
    textarea.style.position = "fixed";
    textarea.style.top = "-9999px";
    textarea.style.left = "-9999px";
    textarea.style.opacity = "0";
    textarea.setAttribute("readonly", "");
    document.body.appendChild(textarea);

    // iOS Safari needs special handling
    const isIOS =
      typeof navigator !== "undefined" &&
      /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) {
      const range = document.createRange();
      range.selectNodeContents(textarea);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
      textarea.setSelectionRange(0, text.length);
    } else {
      textarea.select();
    }

    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  } catch (err) {
    console.warn("[clipboard] legacy copy failed:", err);
    return false;
  }
}