(function inviteRedirect() {
  const identity = window.netlifyIdentity;
  if (!identity) return;
  identity.on("init", (user) => {
    if (!user) {
      identity.on("login", () => {
        document.location.href = "/admin/";
      });
    }
  });
})();
