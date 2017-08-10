// @flow
module.exports = {
  random(min: number, max: number){
      return Math.floor(Math.random() * (max - min) + min);
  },
  _isLoggedIn() {
      return window.localStorage.getItem('graphcoolToken');
  },
  _logout() {
        // remove token from local storage and reload page to reset apollo client
        window.localStorage.removeItem('graphcoolToken');
        module.exports._deleteUsername();
            setTimeout(() => {
                window.location.reload();
            }, 200);
  },
  _saveUsername(username: string) {
      window.localStorage.setItem("username", username);
  },
  _deleteUsername() {
      window.localStorage.removeItem('username');
  },
  _getUsername() {
     return window.localStorage.getItem('username');
  },
  guid() {
      function s4() {
           return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
      return s4() + '' + s4() + '' +
           s4() + '' + s4();
  },
};
