// @flow
module.exports = {
  random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
  },
  _isLoggedIn() {
    return window.localStorage.getItem("graphcoolToken");
  },
  _logout() {
    // remove token from local storage and reload page to reset apollo client
    window.localStorage.removeItem("graphcoolToken");
    module.exports._deleteUsername();
    module.exports._deleteUserId();
    module.exports._deleteEmailConfirmation();
    setTimeout(() => {
      window.location.reload();
    }, 200);
  },
  _saveUsername(username: string) {
    window.localStorage.setItem("username", username);
  },
  _deleteUsername() {
    window.localStorage.removeItem("username");
  },
  _getUsername() {
    return window.localStorage.getItem("username");
  },
  _saveUserId(userId: string) {
    window.localStorage.setItem("userId", userId);
  },
  _deleteUserId() {
    window.localStorage.removeItem("userId");
  },
  _getUserId() {
      return window.localStorage.getItem("userId");
  },
  _getEmailConfirmation() {
    return window.localStorage.getItem("isEmailVerified");
  },
  _saveEmailConfirmation(isEmailVerified: boolean) {
     window.localStorage.setItem("isEmailVerified", isEmailVerified);
  },
  _deleteEmailConfirmation() {
     window.localStorage.removeItem("isEmailVerified");
  },
  guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + "" + s4() + "" + s4() + "" + s4();
  },
  _refreshPage() {
    window.location.reload();
  },
  dynamicWidth() {
    return window.innerWidth;
  },
  generateToken() {
      //return crypto.randomBytes(20).toString("hex")
      return module.exports.guid();
  },
  generateExpiration() {
      const now = new Date();
      return new Date(now.getTime() + 3600000).toISOString()
  }
};
