import { Logout, PersonAdd, Settings } from "@mui/icons-material";
import { Avatar, Box, Button, Divider, Icon, IconButton, ListItemIcon, Menu, MenuItem, Tooltip, Typography } from "@mui/material";
import { useAuth } from "context/AuthContext";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";



function Topnav() {
     const { UserData } = useAuth()
     const [inviteCount, setInviteCount] = useState(0);
     const [openProfile, setOpenprofile] = useState(false);
     const navigate = useNavigate();
     const location = useLocation();

     useEffect(() => {
          checkInviteData();
     }, [location]);

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


     const checkInviteData = () => {
          // Replace this with your actual logic to check for invite data
          const hasPendingInvites = Math.random() < 0.5; // Example: 50% chance of having invites

          if (hasPendingInvites) {
               setInviteCount((prevCount) => prevCount + 1);
          }
     };

     const handleNotofication = () => {
          navigate('/pendinginvites');
          // history.push('/pendinginvites');
          setInviteCount(0);
          console.log('Clicked');
     }

     const handleProfile = () => {
          console.log('cliked profile');
     }

     const [anchorEl, setAnchorEl] = useState(null);
     const open = Boolean(anchorEl);
     const handleClick = (event) => {
          setAnchorEl(event.currentTarget);
     };
     const handleClose = () => {
          setAnchorEl(null);
     };

     return (
          <>
               <div style={{ display: 'flex', paddingRight: '18px', alignItems: 'center', backgroundColor: 'rgb(65,65,72)', justifyContent: 'end', position: 'fixed', zIndex: '1200', width: '84%', right: '-5px' }}>
                    <Tooltip title="Notification">

                              <Icon size="large" onClick={handleNotofication} style={{color:'rgb(3,159,226)', marginRight:'20px'}}>
                                   <h3 style={{ cursor: 'pointer' }}>notifications</h3>
                              </Icon>
                              {/* {inviteCount > 0 && <div className="notification-badge">{inviteCount}</div>} */}
                        
                    </Tooltip>
                    <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                         <Tooltip title="Account settings">
                              <IconButton
                                   onClick={handleClick}
                                   size="small"
                                   sx={{ mr: 1 }}
                                   aria-controls={open ? 'account-menu' : undefined}
                                   aria-haspopup="true"
                                   aria-expanded={open ? 'true' : undefined}
                              >
                                   <Avatar {...stringAvatar(UserData?.name)} style={{ cursor: 'pointer' }} onClick={handleProfile} />
                              </IconButton>
                         </Tooltip>
                    </Box>
                    <Menu
                         anchorEl={anchorEl}
                         id="account-menu"
                         open={open}
                         onClose={handleClose}
                         onClick={handleClose}
                         PaperProps={{
                              elevation: 0,
                              sx: {
                                   overflow: 'visible',
                                   filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                   mt: 1.5,
                                   '& .MuiAvatar-root': {
                                        width: 32,
                                        height: 32,
                                        ml: -0.5,
                                        mr: 1,
                                   },
                                   '&:before': {
                                        content: '""',
                                        display: 'block',
                                        position: 'absolute',
                                        top: 0,
                                        right: 14,
                                        width: 10,
                                        height: 10,
                                        bgcolor: 'background.paper',
                                        transform: 'translateY(-50%) rotate(45deg)',
                                        zIndex: 0,
                                   },
                              },
                         }}
                         transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                         anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                         <MenuItem onClick={handleClose}>
                              <Avatar {...stringAvatar(UserData?.name)} /> Profile
                         </MenuItem>
                         <MenuItem onClick={handleClose}>
                              <Avatar /> My account
                         </MenuItem>
                         <Divider />
                         <MenuItem onClick={handleClose}>
                              <ListItemIcon>
                                   <Settings fontSize="small" />
                              </ListItemIcon>
                              Settings
                         </MenuItem>
                         <MenuItem onClick={handleClose}>
                              <ListItemIcon>
                                   <Logout fontSize="small" />
                              </ListItemIcon>
                              Logout
                         </MenuItem>
                    </Menu>
               </div>
          </>
     )
}
export default Topnav;