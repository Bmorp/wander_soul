// After a new deploy, a tab that was open on the old build asks for page files that
// no longer exist. Those visitors get one quiet reload onto the new build; if the
// reload doesn't help (a real network failure), the error screen shows instead.
const KEY = 'ws_stale_reload';

export const isStaleBuildError = (error) =>
  /dynamically imported module|Importing a module script failed|error loading dynamically imported module|Failed to fetch/i.test(
    String(error?.message || error || ''),
  );

export function reloadOnce() {
  try {
    const last = Number(sessionStorage.getItem(KEY) || 0);
    if (Date.now() - last < 30000) return false;
    sessionStorage.setItem(KEY, String(Date.now()));
  } catch {
    return false;
  }
  window.location.reload();
  return true;
}
