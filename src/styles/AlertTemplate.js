function _interopDefault(ex) {
  return ex && typeof ex === "object" && "default" in ex ? ex["default"] : ex;
}

var React = _interopDefault(require("react"));

var BaseIcon = function BaseIcon(_ref) {
  var color = _ref.color,
    _ref$pushRight = _ref.pushRight,
    pushRight = _ref$pushRight === undefined ? true : _ref$pushRight,
    children = _ref.children;
  return React.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: color,
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      style: { marginRight: pushRight ? "20px" : "0", minWidth: 24 }
    },
    children
  );
};

var InfoIcon = function InfoIcon() {
  return React.createElement(
    BaseIcon,
    { color: "#2E9AFE" },
    React.createElement("circle", { cx: "12", cy: "12", r: "10" }),
    React.createElement("line", { x1: "12", y1: "16", x2: "12", y2: "12" }),
    React.createElement("line", { x1: "12", y1: "8", x2: "12", y2: "8" })
  );
};

var SuccessIcon = function SuccessIcon() {
  return React.createElement(
    BaseIcon,
    { color: "#31B404" },
    React.createElement("path", { d: "M22 11.08V12a10 10 0 1 1-5.93-9.14" }),
    React.createElement("polyline", { points: "22 4 12 14.01 9 11.01" })
  );
};

var ErrorIcon = function ErrorIcon() {
  return React.createElement(
    BaseIcon,
    { color: "#FF0040" },
    React.createElement("circle", { cx: "12", cy: "12", r: "10" }),
    React.createElement("line", { x1: "12", y1: "8", x2: "12", y2: "12" }),
    React.createElement("line", { x1: "12", y1: "16", x2: "12", y2: "16" })
  );
};

var CloseIcon = function CloseIcon() {
  return React.createElement(
    BaseIcon,
    { color: "#cbcfd0", pushRight: false },
    React.createElement("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
    React.createElement("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
  );
};

var _extends =
  Object.assign ||
  function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

var alertStyle = {
  backgroundColor: "#011638",
  color: "#FFFFFF",
  padding: "10px",
  borderRadius: "3px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow: "0px 2px 2px 2px rgba(0, 0, 0, 0.03)",
  fontFamily: "Arial",
  width: "350px",
  boxSizing: "border-box"
};

var buttonStyle = {
  marginLeft: "20px",
  border: "none",
  backgroundColor: "transparent",
  cursor: "pointer",
  color: "#000"
};

var AlertTemplate = function AlertTemplate(_ref) {
  var message = _ref.message,
    options = _ref.options,
    style = _ref.style,
    close = _ref.close;

  return React.createElement(
    "div",
    { style: _extends({}, alertStyle, style) },
    options.type === "info" && React.createElement(InfoIcon, null),
    options.type === "success" && React.createElement(SuccessIcon, null),
    options.type === "error" && React.createElement(ErrorIcon, null),
    React.createElement("span", { style: { flex: 2 } }, message),
    React.createElement(
      "button",
      { onClick: close, style: buttonStyle },
      React.createElement(CloseIcon, null)
    )
  );
};

module.exports = AlertTemplate;
