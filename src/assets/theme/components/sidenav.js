// DocuIt React Base Styles
import colors from "assets/theme/base/colors";

// DocuIt React helper functions
import pxToRem from "assets/theme/functions/pxToRem";

const { white } = colors;

const sidenav = {
  styleOverrides: {
    root: {
      width: pxToRem(250),
      whiteSpace: "nowrap",
      border: "none",
    },

    paper: {
      width: pxToRem(250),
      backgroundColor: white.main,
      // height: `calc(100vh - ${pxToRem(32)})`,
      // margin: pxToRem(16),
      // borderRadius: borderRadius.xl,
      border: "none",
    },

    paperAnchorDockedLeft: {
      borderRight: "none",
    },
  },
};

export default sidenav;
