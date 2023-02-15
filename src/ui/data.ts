import { TokenSet } from "../types";

export const TEST_TOKEN_SET_1: TokenSet = {
  name: "Default",
  tokens: {
    border: {
      small: {
        name: "Small",
        value: {
          width: 1,
          style: "solid",
          color: "#000000",
        },
        type: "border",
      },
      medium: {
        name: "Medium",
        value: {
          width: 2,
          style: "solid",
          color: "#000000",
        },
        type: "border",
      },
      large: {
        name: "Large",
        value: {
          width: 4,
          style: "solid",
          color: "#000000",
        },
        type: "border",
      },
      dashed: {
        name: "Dashed",
        value: {
          width: 4,
          style: "dashed",
          color: "#000000",
        },
        type: "border",
      },
    },
    typography: {
      heading1: {
        name: "Heading 1",
        value: {
          fontFamily: "Inter",
          fontWeight: "900",
          fontSize: "48px",
          lineHeight: "56px",
          letterSpacing: "0px",
          textDecoration: "none",
          textCase: "none",
          color: "#000000",
        },
        type: "typography",
      },
      heading2: {
        name: "Heading 2",
        value: {
          fontFamily: "Inter",
          fontWeight: "500",
          fontSize: "36px",
          lineHeight: "44px",
          letterSpacing: "0px",
          textDecoration: "none",
          textCase: "none",
          color: "#000000",
        },
        type: "typography",
      },
      heading3: {
        name: "Heading 3",
        value: {
          fontFamily: "Inter",
          fontWeight: "800",
          fontSize: "24px",
          lineHeight: "32px",
          letterSpacing: "0px",
          textDecoration: "none",
          textCase: "none",
          color: "#000000",
        },
        type: "typography",
      },
    },
    color: {
      primary: {
        name: "Primary",
        value: "#0070f3",
        type: "color",
      },
      secondary: {
        name: "Secondary",
        value: "#ff0070",
        type: "color",
      },
      tertiary: {
        name: "Tertiary",
        value: "#00ff70",
        type: "color",
      },
    },
    spacing: {
      small: {
        name: "Small",
        value: 4,
        type: "spacing",
      },
      medium: {
        name: "Medium",
        value: 8,
        type: "spacing",
      },
      large: {
        name: "Large",
        value: 16,
        type: "spacing",
      },
    },
    sizing: {
      small: {
        name: "Small",
        value: 50,
        type: "sizing",
      },
      medium: {
        name: "Medium",
        value: 100,
        type: "sizing",
      },
      large: {
        name: "Large",
        value: 200,
        type: "sizing",
      },
    },
    fontWeight: {
      normal: {
        name: "Normal",
        value: "400",
        type: "fontWeight",
      },
      medium: {
        name: "Medium",
        value: "600",
        type: "fontWeight",
      },
      bold: {
        name: "Bold",
        value: "800",
        type: "fontWeight",
      },
    },
    fontSize: {
      small: {
        name: "Small",
        value: 12,
        type: "fontSize",
      },
      medium: {
        name: "Medium",
        value: 16,
        type: "fontSize",
      },
      large: {
        name: "Large",
        value: 24,
        type: "fontSize",
      },
    },
    lineHeight: {
      small: {
        name: "Small",
        value: "16px",
        type: "lineHeight",
      },
      medium: {
        name: "Medium",
        value: "24px",
        type: "lineHeight",
      },
      large: {
        name: "Large",
        value: "32px",
        type: "lineHeight",
      },
    },
    borderWidth: {
      small: {
        name: "Small",
        value: 1,
        type: "borderWidth",
      },
      medium: {
        name: "Medium",
        value: 2,
        type: "borderWidth",
      },
      large: {
        name: "Large",
        value: 4,
        type: "borderWidth",
      },
    },
    borderRadius: {
      small: {
        name: "Small",
        value: 4,
        type: "borderRadius",
      },
      medium: {
        name: "Medium",
        value: 8,
        type: "borderRadius",
      },
      large: {
        name: "Large",
        value: 16,
        type: "borderRadius",
      },
    },
    boxShadow: {
      small: {
        name: "Small",
        value: {
          x: 5,
          y: 5,
          blur: 5,
          spread: 0,
          color: "rgba(0, 0, 0, 0.05)",
        },
        type: "boxShadow",
      },
      medium: {
        name: "Medium",
        value: {
          x: 10,
          y: 10,
          blur: 8,
          spread: 0,
          color: "rgba(0, 0, 0, 0.1)",
        },
        type: "boxShadow",
      },
      large: {
        name: "Large",
        value: {
          x: 20,
          y: 20,
          blur: 10,
          spread: 0,
          color: "rgba(0, 0, 0, 0.15)",
        },
        type: "boxShadow",
      },
    },
    opacity: {
      0: {
        name: "0",
        value: "0",
        type: "opacity",
      },
      25: {
        name: "25",
        value: "0.25",
        type: "opacity",
      },
      50: {
        name: "50",

        value: "0.5",
        type: "opacity",
      },
      75: {
        name: "75",
        value: "0.75",
        type: "opacity",
      },
      100: {
        name: "100",
        value: "1",
        type: "opacity",
      },
    },
    zIndex: {
      0: {
        name: "0",
        value: "0",
        type: "zIndex",
      },
      10: {
        name: "10",
        value: "10",
        type: "zIndex",
      },
      20: {
        name: "20",
        value: "20",
        type: "zIndex",
      },
      30: {
        name: "30",
        value: "30",
        type: "zIndex",
      },
    },
  },
};
