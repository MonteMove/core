export function applySavedTheme() {
  if (typeof window === "undefined") return;

  const root = document.documentElement;

  const savedPrimary = localStorage.getItem("primary-color");
  const savedBackground = localStorage.getItem("background-color");
  const savedForeground = localStorage.getItem("foreground-color");

  if (savedPrimary) {
    root.style.setProperty("--primary", savedPrimary);
  }
  if (savedBackground) {
    root.style.setProperty("--background", savedBackground);
    root.style.setProperty("--card", savedBackground);
    root.style.setProperty("--popover", savedBackground);
    root.style.setProperty("--muted", savedBackground);
    root.style.setProperty("--accent", savedBackground);
    root.style.setProperty("--border", savedBackground);
  }
  if (savedForeground) {
    root.style.setProperty("--foreground", savedForeground);
  }
}
