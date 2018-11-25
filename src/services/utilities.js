module.exports = {
  _isLoggedIn() {
    return window.localStorage.getItem("graphcoolToken");
  },
  _logout() {
    // remove token from local storage and reload page to reset apollo client
    window.localStorage.removeItem("graphcoolToken");
    setTimeout(() => {
      window.location.reload();
    }, 200);
  }
};
