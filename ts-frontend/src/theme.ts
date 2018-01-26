const COLORS = {
  YELLOW: '#FFFF55',
  ORANGE: '#FFAA55',
  GREY_100: '#f8f9fa',
  GREY_200: '#DDDDDD',
  GREY_300: '#dee2e6',
  GREY_400: '#ced4da',
  GREY_500: '#bbbbbb',
  GREY_600: '#868e96',
  GREY_700: '#495057',
  GREY_800: '#343a40',
  GREY_900: '#212529',
  BLACK: '#000000',
  WHITE: '#FFFFFF',
};

const MARGINS = {
  m1: '5px',
  m2: '10px',
  m3: '20px',
  m4: '40px',
  m5: '80px',
};

export const LIGHT_THEME = {
  widths: {
    headerContainer: '500px',
    innerContainer: '900px',
  },
  colors: {
    primary: COLORS.YELLOW,
    secondary: COLORS.ORANGE,
    background: COLORS.GREY_500,
    foreground: COLORS.WHITE,
    foregroundBright: COLORS.GREY_200,
    border: COLORS.GREY_700,
  },
  borderRadius: '0px',
  margins: MARGINS,
  font: {
    color: COLORS.BLACK,
    highlightBackground: COLORS.GREY_200,
    familySansSerif: `'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif`,
    sizeTitle: '40px',
    sizeTitleMobile: '20px',
    sizeLarge: '18px',
    sizeBase: '14px',
    sizeSmall: '12px',
    sizeTiny: '10px',
  },
  dropShadow: {
    s1: `0 5px 12px -2px rgba(0, 0, 0, 0.2)`,
  },
  searchBar: {
    buttonColor: COLORS.GREY_700,
    buttonTextColor: COLORS.WHITE,
    buttonColorHover: COLORS.GREY_600,
    barBackgroundColor: COLORS.WHITE,
  }
};

export const THEME = LIGHT_THEME;