import { Avatar } from "@mui/material";
import { useAuth } from "context/AuthContext";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";



function Topnav() {
     const { UserData } = useAuth()
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
     return (
          <>
               <div style={{ display: 'flex', padding: '5px 5px', alignItems: 'center', backgroundColor: 'rgb(65,65,72)', justifyContent: 'end' }}>
                    <span style={{ paddingRight: '5px' }}><Avatar {...stringAvatar(UserData?.name)} /></span>
               </div>

          </>
     )
}
export default Topnav;