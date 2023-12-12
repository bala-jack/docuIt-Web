// DocuIt React layouts
// import Dashboard from "./layouts/dashboard";
import Categories from "./layouts/categories";
import SignIn from "./layouts/authentication/sign-in";
//import SignUp from "./layouts/authentication/sign-up";
import Dashboard from "./layouts/userdashboard";
// @mui icons
import Icon from "@mui/material/Icon";
import Family from "layouts/family";
import AdminDashboard from "./layouts/dashboard";
import FamilyMembers from "layouts/familyMembers";
import FamilyMember from "./layouts/family";
import PendingInvites from "layouts/pendingInvites";
import Documents from "layouts/Documents";
import Assets from "layouts/Documents/Assets";
import LifeIns from "layouts/Documents/lifeInsurance";
import HealthIns from "layouts/Documents/healthInsurance";
import FinanceAcc from "layouts/Documents/financeAcoounts";



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
  // {
  //   type: "collapse",
  //   name: "AdminDashboard",
  //   key: "admindashboard",
  //   icon: <Icon fontSize="small">dashboard</Icon>,
  //   route: "/dashboard",
  //   component: <AdminDashboard />,
  //   role : 'admin',
  // },

  {
    type: "collapse",
    name: "Documents",
    key: "documents",
    icon: <Icon fontSize="small">text_snippet</Icon>,
    route: "/documents",
    component: <Documents />,
    role: 'User',
    // subRoute: [
    //   {
    //     name: "Assets",
    //     key: "assets",
    //     icon: <Icon fontSize="small">source</Icon>,
    //     route: "/documents/assets",
    //     component: <Assets />,
    //     role: 'User',
    //   },]
    //   {
    //     name: "Life Insurance",
    //     key: "lifeinsurance",
    //     icon: <Icon fontSize="small">source</Icon>,
    //     route: "/documents/lifeinsurance",
    //     component: <LifeIns />,
    //     role: 'User',
    //   },
    //   {
    //     name: "Health Insurance",
    //     key: "healthinsurance",
    //     icon: <Icon fontSize="small">source</Icon>,
    //     route: "/documents/healthinsurance",
    //     component: <HealthIns />,
    //     role: 'User',
    //   },
    //   {
    //     name: "Finance Accounts",
    //     key: "financeaccounts",
    //     icon: <Icon fontSize="small">source</Icon>,
    //     route: "/documents/financeaccounts",
    //     component: <FinanceAcc />,
    //     role: 'User',
    //   },
    // ]
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
