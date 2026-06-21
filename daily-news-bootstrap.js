(() => {
  const ENDPOINT = "https://ultimateenem-experience-api.vercel.app/api/noticias/diarias";
  let autoFetchStarted = false;

  function endpointNeedsPatch(value) {
    const normalized = String(value || "").trim();
    return !normalized || normalized === "/api/noticias/diarias" || normalized.includes("localhost");
  }

  function wireDailyNewsEndpoint() {
    const input = document.getElementById("dailyNewsEndpointInput");
    if (!input) return;

    let patched = false;
    if (endpointNeedsPatch(input.value)) {
      input.value = ENDPOINT;
      patched = true;
    }

    if (!patched || autoFetchStarted) return;
    autoFetchStarted = true;
    window.setTimeout(() => {
      document.getElementById("fetchDailyNewsBtn")?.click();
    }, 150);
  }

  const target = document.getElementById("app") || document.body;
  if (target) {
    new MutationObserver(wireDailyNewsEndpoint).observe(target, { childList: true, subtree: true });
  }
  document.addEventListener("DOMContentLoaded", wireDailyNewsEndpoint);
  window.addEventListener("load", wireDailyNewsEndpoint);
})();
