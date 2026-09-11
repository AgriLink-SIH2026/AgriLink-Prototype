export const navigate = (path: string) => {
  const targetUrl = new URL(path, window.location.origin);
  const fullPath = targetUrl.pathname + targetUrl.search;
  const currentFullPath = window.location.pathname + window.location.search;

  if (currentFullPath !== fullPath) {
    window.history.pushState(null, '', fullPath);
  }
  window.dispatchEvent(new CustomEvent('agrilink_navigate', { detail: { path: targetUrl.pathname } }));
  window.dispatchEvent(new PopStateEvent('popstate'));
};

