// DocuIt React layouts
// import Dashboard from "./layouts/dashboard";
import Categories from "./layouts/categories";
import SignIn from "./layouts/authentication/sign-in";
//import SignUp from "./layouts/authentication/sign-up";
import Dashboard from "./layouts/userdashboard";
// @mui icons
import Icon from "@mui/material/Icon";
import Family from "layouts/family";
import PendingInvites from "layouts/pendingInvites";
import Documents from "layouts/Documents";


const routes = [

  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
    role: 'User'

  },

  {
    type: "collapse",
    name: "Documents",
    key: "documents",
    icon: <Icon fontSize="small">text_snippet</Icon>,
    route: "/documents",
    component: <Documents />,
    role: 'User',
  },

  {
    type: "collapse",
    name: "Family",
    key: "family",
    icon: <Icon fontSize="small">diversity_3</Icon>,
    route: "/family",
    component: <Family />,
    role: 'User',
  },

  {
    // type: "collapse",
    // name: "FamilyMember",
    key: "/family/:familyname",
    // icon: <Icon fontSize="small">group</Icon>,
    route: "/family/:familyname",
    component: <Family />,
    role: 'User',
  },

  {
    // type: "collapse",
    // name: "Pending Invites",
    key: "pendinginvites",
    // icon: <Icon fontSize="small">notifications</Icon>,
    route: "/pendinginvites",
    component: <PendingInvites />,
    role: 'User',
  },

  // {
  //   type: "collapse",
  //   name: "Categories",
  //   key: "categories",
  //   icon: <Icon fontSize="small">table_view</Icon>,
  //   route: "/categories",
  //   component: <Categories />,
  //   role : 'admin',
  // },
  {
    type: "collapse",
    name: "Logout",
    key: "signIn",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/signIn",
    component: <SignIn />,
    role: 'Comman',
  },
  // {
  //   type: "collapse",
  //   name: "Logout",
  //   key: "signUp",
  //   icon: <Icon fontSize="small">signup</Icon>,
  //   route: "/signUp",
  //   component: <SignUp />,
  // },
];

export default routes;
