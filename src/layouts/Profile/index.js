import { Avatar, Box } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useLocation } from 'react-router-dom';

function Profile() {
     const { state } = useLocation();
     const avatar = state ? state.avatar : null;
     console.log('avatar>>>>>>>',avatar )
     return (
          <>
           <DashboardLayout className='mainContent'>
               <DashboardNavbar />
          <Box>
          {avatar && (
            <Avatar {...avatar} style={{ cursor: 'pointer' }} />
          )}
          </Box>
          </DashboardLayout>
          </>
     )
}
export default Profile;