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
    setTimeout(() => {
      window.location.reload();
    }, 200);
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
    return new Date(now.getTime() + 3600000).toISOString();
  },
  getUrlParam(name, url) {
    if (!url) url = window.location.href;
    //name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    let regexS = "[\\?&]" + name + "=([^&#]*)";
    let regex = new RegExp(regexS);
    let results = regex.exec(url);
    return results == null ? null : results[1];
  },
  _removeAccents(str: string) {
    let accents =
      "ÀÁÂÃÄÅàáâãäåßÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž";
    let accentsOut =
      "AAAAAAaaaaaaBOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
    str = str.split("");
    str.forEach((letter, index) => {
      let i = accents.indexOf(letter);
      if (i !== -1) {
        str[index] = accentsOut[i];
      }
    });
    return str.join("");
  },
  _formatUsername(str: string) {
    str = str.replace(/\s+/g, ""); //removes the spaces
    str = str.toLowerCase(); //all the letter to lowercase
    return module.exports._removeAccents(str); //removes all the string accents
  },
  _onHandleExpression(str: string) {
    return str.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
  },
  _capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  },
  _validateEmail(email) {
    // eslint-disable-next-line
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  },
  _emailBlackList(email) {
    const list = ["demo", "mailinator", "maildrop"];
    if (email.includes("@")) {
      const data = email.split("@");
      const string = data[1].split(".");
      return list.indexOf(string[0]) > -1;
    }
    return false;
  },
  convertArrayOfObjectsToCSV(args) {
    var result, ctr, keys, columnDelimiter, lineDelimiter, data;

    data = args.data || null;
    if (data == null || !data.length) {
      return null;
    }

    columnDelimiter = args.columnDelimiter || ",";
    lineDelimiter = args.lineDelimiter || "\n";

    keys = Object.keys(data[0]);

    result = "";
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    data.forEach(function(item) {
      ctr = 0;
      keys.forEach(function(key) {
        if (ctr > 0) result += columnDelimiter;

        result += item[key];
        ctr++;
      });
      result += lineDelimiter;
    });

    return result;
  },
  downloadCSV(args, data) {
    var filename, link, data;
    var csv = module.exports.convertArrayOfObjectsToCSV({
      data
    });
    if (csv == null) return;

    filename = args.filename || "export.csv";

    if (!csv.match(/^data:text\/csv/i)) {
      csv = "data:text/csv;charset=utf-8," + csv;
    }
    data = encodeURI(csv);

    link = document.createElement("a");
    link.setAttribute("href", data);
    link.setAttribute("download", filename);
    link.click();
  }
};
