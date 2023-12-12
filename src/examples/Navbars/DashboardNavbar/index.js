// react-router components
import { useLocation, useNavigate } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @material-ui core components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Icon from "@mui/material/Icon";

// DocuIt React components
import MDBox from "components/MDBox";

// DocuIt React example components
import Breadcrumbs from "../../Breadcrumbs";

// Custom styles for DashboardNavbar
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarMobileMenu,
} from "./styles";

import '../DashboardNavbar/style.css';

// DocuIt React context
import {
  useMaterialUIController,
  setMiniSidenav,
} from "../../../context";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";


function DashboardNavbar({ absolute, light, isMini }) {
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentNavbar, darkMode } = controller;
  const route = useLocation().pathname.split("/").slice(1);

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);

  const navigate = useNavigate();
  const location = useLocation();
  const [inviteCount, setInviteCount] = useState(0);

  // Styles for the navbar icons
  const iconsStyle = ({ palette: { dark, white, text }, functions: { rgba } }) => ({
    color: () => {
      let colorValue = light || darkMode ? white.main : dark.main;

      if (transparentNavbar && !light) {
        colorValue = darkMode ? rgba(text.main, 0.6) : text.main;
      }

      return colorValue;
    },
  });

  const handleNotofication = () => {
    navigate('/pendinginvites');
    // history.push('/pendinginvites');
    setInviteCount(0);
    console.log('Clicked');
  }

  const checkInviteData = () => {
    // Replace this with your actual logic to check for invite data
    const hasPendingInvites = Math.random() < 0.5; // Example: 50% chance of having invites

    if (hasPendingInvites) {
      setInviteCount((prevCount) => prevCount + 1);
    }
  };

  useEffect(() => {
    checkInviteData();
  }, [location]);

  return (
    <AppBar
      position={"static"}
      color="inherit"
      sx={(theme) => navbar(theme, { transparentNavbar, absolute, light, darkMode })}
    >
      <Toolbar sx={(theme) => navbarContainer(theme)}>
        <MDBox color="inherit" mb={{ xs: 1, md: 0 }} sx={(theme) => navbarRow(theme, { isMini })}>
          <Breadcrumbs icon="home" title={route[route.length - 1]} route={route} light={light} />
        </MDBox>
        <div style={{ width: '80%', display: 'flex', justifyContent: 'end' }}>
          <Button onClick={handleNotofication}>
            <Icon size="large">
              <h3>notifications</h3>
            </Icon>
            {inviteCount > 0 && <div className="notification-badge">{inviteCount}</div>}
          </Button>
        </div>

        {isMini ? null : (
          <MDBox sx={(theme) => navbarRow(theme, { isMini })}>
            <MDBox pr={1}>
            </MDBox>
            <MDBox color={light ? "white" : "inherit"}>
              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarMobileMenu}
                onClick={handleMiniSidenav}
              >
                <Icon sx={iconsStyle} fontSize="medium">
                  {miniSidenav ? "menu_open" : "menu"}
                </Icon>
              </IconButton>
            </MDBox>
          </MDBox>
        )}
      </Toolbar>
    </AppBar>
  );
}

// Setting default values for the props of DashboardNavbar
DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

// Typechecking props for the DashboardNavbar
DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default DashboardNavbar;
