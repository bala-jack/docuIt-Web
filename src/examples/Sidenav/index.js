

import { useEffect, useState } from "react";

// react-router-dom components
import { useLocation, NavLink, useNavigate } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Icon from "@mui/material/Icon";

// DocuIt React components
import MDBox from "../../components/MDBox";
import MDTypography from "components/MDTypography";

// DocuIt React example components
import SidenavCollapse from "../../examples/Sidenav/SidenavCollapse";

// Custom styles for the Sidenav
import SidenavRoot from "examples/Sidenav/SidenavRoot";
import sidenavLogoLabel from "examples/Sidenav/styles/sidenav";

// DocuIt React context
import {
  useMaterialUIController,
  setMiniSidenav,
  setTransparentSidenav,
  setWhiteSidenav,
} from "context";
import { logout } from "services";
import { useAuth } from "context/AuthContext";
import { Avatar, Collapse, ListItemButton, ListItemText } from "@mui/material";
import Assets from "layouts/Documents/Assets";
import { findUser } from "services";
import { ExpandLess, ExpandMore } from "@mui/icons-material";


function Sidenav({ color, brand, brandName, routes, ...rest }) {
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentSidenav, whiteSidenav, darkMode } = controller;
  const navigate = useNavigate();
  const location = useLocation();
  const collapseName = location.pathname.replace("/", "");
  const { logoutSuccess, UserData, category, setcategory } = useAuth()
  //Praveen Change
  const [openCollapse, setOpenCollapse] = useState(null);
  const [categoryDetails, setCategoryDetails] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);



  let textColor = "white";

  if (transparentSidenav || (whiteSidenav && !darkMode)) {
    textColor = "dark";
  } else if (whiteSidenav && darkMode) {
    textColor = "inherit";
  }

  const closeSidenav = () => setMiniSidenav(dispatch, true);

  useEffect(() => {

    // A function that sets the mini state of the sidenav.
    function handleMiniSidenav() {
      setMiniSidenav(dispatch, window.innerWidth < 1200);
      setTransparentSidenav(dispatch, window.innerWidth < 1200 ? false : transparentSidenav);
      setWhiteSidenav(dispatch, window.innerWidth < 1200 ? false : whiteSidenav);
    }

    /** 
     The event listener that's calling the handleMiniSidenav function when resizing the window.
    */
    window.addEventListener("resize", handleMiniSidenav);

    // Call the handleMiniSidenav function to set the state with the initial value.
    handleMiniSidenav();
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleMiniSidenav);
  }, [dispatch, location, findUser]);

  const handleSidenave = (name, route) => {
    if (route && route.route) {
      setOpenCollapse(route.key); // Highlight the active collapse
      navigate(route.route); // Navigate to the specified route
    } else if (name === 'Logout') {
      logout();
      logoutSuccess();
      navigate("/signIn");
    }
    // if (name === 'Logout') {
    //   logout()
    //   logoutSuccess()
    // }

    console.log(name)
  }

  const handleToggleCollapse = async (key) => {
    try {
      const userId = UserData?.id;
      const { data } = await findUser(userId);

      if (data?.response?.categoryDetails) {
        const extractedData = data.response.categoryDetails.map((categoryDetails) => ({
          categoryId: categoryDetails.categoryId,
          categoryName: categoryDetails.categoryName,
          fileCount: categoryDetails.fileCount
        }));
        setOpenCollapse((prevOpenCollapse) => (prevOpenCollapse === key ? null : key));
        setCategoryDetails(extractedData);
      }
    } catch (err) {
      console.error("API call failed:", err);
    }
  };
  // const handleToggleNavigate = (categoryId, categoryName) => {
  //   navigate(`/documents/${categoryName}`);
  //   setActiveCategory(categoryName);
  // } 
  const handleSubmenuClick = (category) => {
    navigate(`/documents`)
    setcategory(category);
    console.log('categoryName:::::', category);
  }
  // Render all the routes from the routes.js (All the visible items on the Sidenav)
  const renderRoutes = (routes || []).map(({ type, name, icon, fileCount, count, title, noCollapse, key, href, route, subRoute }) => {
    let returnValue;

    if (name === "Documents") {
      returnValue = (
        <div key={key}>
          <ListItemButton onClick={() => handleToggleCollapse(key)}>
            <SidenavCollapse name={name} icon={icon} key={key} route={route} active={key === collapseName} />
            {openCollapse === key ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openCollapse} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 4 }} style={{display:'flow'}}>
                {categoryDetails.map((item, index) => (
                  <div
                    key={item.categoryId}
                    onClick={() => handleSubmenuClick(item)}
                  >

                    <SidenavCollapse
                      name={item.categoryName}
                      icon={icon}
                      active={
                        openCollapse === item.categoryId ||
                        (item === item.categoryName) ||
                        location.pathname === `/documents`
                      }
                    />
                  </div>
                ))}
              </ListItemButton>
            </List>
          </Collapse>
          {/* {openCollapse === key && (
            <List style={{ paddingLeft: '22px' }}>
              {categoryDetails.map((item, index) => (
                <div
                  key={item.categoryId}
                  onClick={() => handleSubmenuClick(item)}
                >

                  <SidenavCollapse
                    name={item.categoryName}
                    icon={icon}
                    active={
                      openCollapse === item.categoryId ||
                      (item === item.categoryName) ||
                      location.pathname === `/documents`
                    }
                  />
                </div>
              ))}
            </List>
          )} */}
        </div>
      );
    } else if (type === "collapse") {
      returnValue = href ? (
        <Link
          href={href}
          key={key}
          target="_blank"
          rel="noreferrer"
          sx={{ textDecoration: "none" }}
        >
          <SidenavCollapse
            name={name}
            icon={icon}
            active={key === collapseName}
            noCollapse={noCollapse}
          />
        </Link>

      ) : (
        <NavLink key={key} to={route} onClick={() => handleSidenave(name)}>
          <SidenavCollapse name={name} icon={icon} active={key === collapseName} />
        </NavLink>
      );
    } else if (type === "title") {
      returnValue = (
        <MDTypography
          key={key}
          color={textColor}
          display="block"
          variant="caption"
          fontWeight="bold"
          textTransform="uppercase"
          pl={3}
          mt={2}
          mb={1}
          ml={1}
        >
          {title}
        </MDTypography>
      );
    } else if (type === "divider") {
      returnValue = (
        <Divider
          key={key}
          light={
            (!darkMode && !whiteSidenav && !transparentSidenav) ||
            (darkMode && !transparentSidenav && whiteSidenav)
          }
        />
      );
    }

    return returnValue;
  });

  //Avatar Color
  const stringAvatar = (name) => {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name ? name.charAt(0).toUpperCase() : ''}`,
    };
  };

  const stringToColor = (string) => {
    if (!string) {
      return '#000000';
    }
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = Math.abs(hash).toString(16).substring(0, 6);
    return `#${'0'.repeat(6 - color.length)}${color}`;
  };
  //Avatar color ends

  return (
    <SidenavRoot
      {...rest}
      variant="permanent"
      ownerState={{ transparentSidenav, whiteSidenav, miniSidenav, darkMode }}
    >
      <MDBox pt={3} pb={1} px={4} textAlign="center">
        <MDBox
          display={{ xs: "block", xl: "none" }}
          position="absolute"
          top={0}
          right={0}
          p={1.625}
          onClick={closeSidenav}
          sx={{ cursor: "pointer" }}
        >
          <MDTypography variant="h6" color="secondary">
            <Icon sx={{ fontWeight: "bold" }}>close</Icon>
          </MDTypography>
        </MDBox>

        <MDBox component={NavLink} to="/dashboard" display="flex" alignItems='flex-start'>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {brand && <MDBox component="img" src={brand} alt="Brand" width="2rem" />}
            <div style={{ display: 'flex', paddingLeft: '48px', alignItems: 'center' }}>
              <span style={{ paddingRight: '5px' }}><Avatar {...stringAvatar(UserData?.name)} /></span>
              <span>
                <h4 style={{ color: 'white' }}>{UserData?.name}</h4>
              </span>
            </div>
          </div>
          <MDBox
            width={!brandName && "100%"}
            sx={(theme) => sidenavLogoLabel(theme, { miniSidenav })}
          >
            <MDTypography component="h6" variant="h3" fontWeight="medium" color={textColor}>
              {/* {brandName.slice(1)} */}
            </MDTypography>
          </MDBox>
        </MDBox>
      </MDBox>
      <Divider
        light={
          (!darkMode && !whiteSidenav && !transparentSidenav) ||
          (darkMode && !transparentSidenav && whiteSidenav)
        }
      />
      <List>{renderRoutes}</List>

    </SidenavRoot>
  );
}

// Setting default values for the props of Sidenav
Sidenav.defaultProps = {
  color: "info",
  brand: "",
};

// Typechecking props for the Sidenav
Sidenav.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  brand: PropTypes.string,
  brandName: PropTypes.string.isRequired,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Sidenav;
