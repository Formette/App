require("babel-register")();
let jsdom = require("jsdom");


let document = jsdom.jsdom("<!doctype html><html><body></body></html>");
let window = document.defaultView;
global.document = document;
global.window = window;
global.navigator = window.navigator;
