import { useState, useEffect } from "react";

// react-router components
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// DocuIt React example components
import Sidenav from "./examples/Sidenav";

// DocuIt React themes
import theme from "assets/theme";

// DocuIt React routes
import routes from "routes";

// DocuIt React contexts
import { useMaterialUIController, setMiniSidenav } from "./context/index";

// Images
import brandWhite from "assets/images/logo_dockit.png";
import { useAuth } from "context/AuthContext";
import SignIn from './layouts/authentication/sign-in'
export default function App() {
  const [controller, dispatch] = useMaterialUIController();
  const { isAuthenticated } = useAuth();
  const {
    miniSidenav,
    layout,
    sidenavColor,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const { pathname } = useLocation();

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };
  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        return isAuthenticated ? <Route exact path={route.route} element={route.component} key={route.key} />
        : <Route path="/signIn" element={<SignIn />} key='signIn' />;
      }

      return null;
    });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {layout === "dashboard" && isAuthenticated && (
        <>
          <Sidenav
            color={sidenavColor}
            brand={brandWhite}
            brandName="DocuIt"
            routes={routes}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
          />
        </>
      )}
      <Routes>
        {getRoutes(routes, isAuthenticated)}
        <Route path="*" element={<Navigate to="/signIn" />} />
      </Routes>
    </ThemeProvider>
  );
}
