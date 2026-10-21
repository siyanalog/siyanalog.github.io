// Set to false and publish to restore the full website.
const maintenanceEnabled = true;

(() => {
  // Local development always shows the full site.
  const isLocal = ["localhost", "127.0.0.1", "[::1]"].includes(location.hostname)
    || location.protocol === "file:";
  const isMaintenancePage = location.pathname === "/maintenance/" || location.pathname === "/maintenance/index.html";

  if (maintenanceEnabled && !isLocal && !isMaintenancePage) {
    document.documentElement.style.visibility = "hidden";
    location.replace("/maintenance/");
  } else if (!maintenanceEnabled && isMaintenancePage) {
    location.replace("/");
  }
})();
