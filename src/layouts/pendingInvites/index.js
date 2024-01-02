import { Box, Button, Card, CardContent, CardMedia, Icon, IconButton, Table, Typography } from "@mui/material";
import MDBox from "components/MDBox";
import { useAuth } from "context/AuthContext";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
// import DashboardProfile from "examples/Navbars/DashboardProfile";
import { useState } from "react";
import { useEffect } from "react";
import { listPendingInvites } from "services";
import '../pendingInvites/invites.css';
import { acceptInvite } from "services";

function PendingInvites() {
     const { UserData } = useAuth();
     const [invitesPending, setInvitesPending] = useState([]);
     const [Hide, setHide] = useState(false);
     const userId = UserData?.id;

     useEffect(() => {
          const fetchData = async () => {
               try {

                    const { data } = await listPendingInvites(userId);
                    console.log('listPendingInvites--------->', data)
                    if (data?.status === "SUCCESS") {
                         setInvitesPending(data?.response || []);

                    }
               } catch (err) {
                    console.error("API call failed:", err);
               }
          };
          fetchData();
     }, [userId, setInvitesPending])

     const handleAccept = async (familyId) => {
          const inviteStatus = "Accepted";
          try {
               const values = { userId, familyId, inviteStatus }
               const { data } = await acceptInvite(values);
               console.log('acceptInvite--------->', data)
               if (data?.status === "SUCCESS") {

                    setHide(true);
               }
          } catch (err) {
               console.error("API call failed:", err);
          }

     }

     console.log('setInvitesPending', invitesPending);
     return (
          <DashboardLayout>

               <DashboardNavbar />
               <MDBox className='mdbboxfamily'>
                    <h2>Pending Invites</h2>
                    {invitesPending.length === 0 ? (
                         <Card className="noneData">
                              <h4>No more Pending Invites</h4>
                         </Card>

                    ) : (
                         <Table>
                              <MDBox className='pending-invites'>
                                   <Card>
                                        <thead>
                                        </thead>
                                        <tbody>

                                             {invitesPending.map((invite) => (
                                                  <div key={invite.id}>

                                                       <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                            <CardContent style={{ display: 'flex', alignItems: 'center' }}>
                                                                 <Typography component="div" variant="h5">
                                                                      {invite.family.name} is invited to his Family
                                                                 </Typography>
                                                                 <Button className="accept-invite" onClick={() => handleAccept(invite.family.id)}><Icon><h3>done</h3></Icon><span style={{ fontSize: '16px', paddingLeft: '5px' }}>Accept</span></Button>
                                                                 <Button className="reject-invite"><Icon><h3>close</h3></Icon><span style={{ fontSize: '16px', paddingLeft: '5px' }}>Reject</span></Button>

                                                                 {/* <Typography variant="subtitle1" color="text.secondary" component="div">
                                                                           Mac Miller
                                                                      </Typography> */}
                                                            </CardContent>
                                                            {/* <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', pl: 1, pb: 1 }}>
                                                       <IconButton aria-label="previous">
                                                           
                                                       </IconButton>
     
                                                       <IconButton aria-label="next">
                                                       </IconButton>
                                                  </Box> */}
                                                       </Box>
                                                  </div>
                                             ))}

                                        </tbody>
                                   </Card>
                              </MDBox>

                         </Table>
                    )}


               </MDBox>
          </DashboardLayout>
     )
}

export default PendingInvites;