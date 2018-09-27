const globals = {
  color: {
    primary: "#011638",
    secondary: "#6a60a9",
    default: "#F6F9FC",
    background: "#E6EBF1",
    border: "#E6EBF1",
    red: "#fa5252",
    yellow: "#fab005",
    orange: "#fd7e14",
    blue: "#228ae6",
    purple: "#7950f2",
    green: "#12b886",
    white: "#FFFFFF"
  }
};

const properties = {
  radius: "4px",
  boxShadow: "0 3px 6px -2px rgba(0,0,0,0.2)",
  text: {
    normal: "#212529",
    highlight: "#000000",
    secondary: "#636c72",
    error: "#fa5252",
    warning: "#fab005",
    notice: "#fff",
    white: "#FFFFFF"
  },
  card: {
    normal: "#FFFFFF",
    hover: "#F0F0F0"
  },
  icons: {
    normal: "#9B9B9B",
    ative: "#5996E9"
  },
  link: {
    normal: "#adb5bd",
    highlight: "#212529",
    active: "#868e96",
    hover: "#868e96"
  }
};

const typography = {
  h1: "2.5rem",
  h2: "2rem",
  h3: "1.75rem",
  h4: "1.5rem",
  h5: "1.25rem",
  h6: "1rem",
  paragraph: "1.25rem"
};

const navigation = {
  navbar: {
    backgroundColor: globals.color.primary,
    brand: {
      fontSize: typography.h4,
      fontWeight: "bold",
      color: globals.color.white
    },
    link: {
      fontSize: typography.h5,
      color: globals.color.white,
      hover: "rgba(255, 255, 255, 0.12)",
      borderRadius: properties.radius,
      marginRight: "6px"
    }
  }
};

const theme = {
  ...globals,
  ...properties,
  ...typography,
  ...navigation
};

export default theme;
