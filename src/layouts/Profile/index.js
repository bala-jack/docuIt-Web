import React, { useEffect, useState } from 'react';
import { Avatar, Alert, Box, Button, Card, FormHelperText, Grid, Select } from "@mui/material";
import { InputLabel, MenuItem, TextField, Snackbar, FormControl, Slide } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useAuth } from "context/AuthContext";
import { updateProfile } from "services"

function Profile() {
     const { UserData, setuserdata } = useAuth();
     const [ProfileDetails, setProfileDetails] = useState({});
     const [username, setUsername] = useState("");
     const [gender, setGender] = useState('');
     const [userDetails, setUserDetails] = useState({});
     const [useremail, setUseremail] = useState([]);
     const [userphone, setUserphone] = useState([]);
     const [ProfilePic, setProfilePic] = useState('');
     const [snackbarOpen, setSnackbarOpen] = useState(false);
     const [snackbarMessage, setSnackbarMessage] = useState('');
     const [snackbarType, setSnackbarType] = useState('success');

     const nameregex = /^[A-Za-z ]+$/;
     const popuperrormsg = !nameregex.test(username.trim());

     useEffect(() => {
          UserProfile();
     }, [UserData]);

     const UserProfile = () => {

          const userdetails = UserData;

          if (userdetails) {
               const extractedData = {
                    username: userdetails.name,
                    gender: userdetails.gender,
                    email: userdetails.email,
                    phonenumber: userdetails.phone,
                    profilepic: userdetails.imageUrl
               };
               setUserDetails(userdetails)
               setGender(userdetails.gender)
               setUsername(userdetails.name)
               setUseremail(userdetails.email)
               setUserphone(userdetails.phone)
               setProfilePic(userdetails.profilepic)
          }
     }

     const handleSnackbarOpen = (message, type) => {
          setSnackbarMessage(message);
          setSnackbarType(type);
          setSnackbarOpen(true);
     };

     const handleProfileEdit = async () => {
          try {
               const params = {
                    "userId": userDetails.id,
                    "name": username,
                    "gender": gender,
                    "imageUrl": ProfilePic
               }
               console.log("params", params);
               const { data } = await updateProfile(params);
               console.log("data", data);

               if (data?.status === "SUCCESS") {
                    setuserdata(data?.response?.userDetails);
                    localStorage.setItem('docuItToken', data?.response?.token);
                    localStorage.setItem('docuItuserDetails', JSON.stringify(data?.response?.userDetails));
                    handleSnackbarOpen("Username is changed successfully", 'success');
               }
               else {
                    handleSnackbarOpen("Invalid entry. Please try again!", 'error');
               }

               console.log("data", data);
          } catch (err) {
               console.error('Error inviting user:', err);
          }
     }

     const selecthandleChange = (event) => {
          setGender(event.target.value);
          console.log("gender value", event.target.value);
     };

     return (
          <DashboardLayout className='mainContent'>
               <DashboardNavbar />
               <Snackbar
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    open={snackbarOpen}
                    autoHideDuration={1500}
                    onClose={() => setSnackbarOpen(false)}
                    TransitionComponent={(props) => <Slide {...props} direction="left" />}
               >
                    <Alert
                         severity={snackbarType === 'success' ? 'success' : 'error'}
                         sx={{ width: '100%', color: '#ffffff', backgroundColor: snackbarType === 'success' ? '#236925' : '#b92525' }}
                    >
                         {snackbarMessage}
                    </Alert>
               </Snackbar>
               <Card
                    sx={{
                         width: '80%',
                         m: 'auto'
                    }}>
                    <Box component="form"
                         sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              m: 1,
                              mt: 5
                         }}>
                         <h2>My Profile</h2>
                         <Avatar sx={{ m: 1, width: 124, height: 124 }}
                              alt={username} src={ProfilePic} />
                    </Box>

                    <Grid
                         container
                         spacing={0}
                         direction="column"
                         justify="center"
                         alignItems="center"
                         alignContent="center"
                         rowGap="1em"
                         wrap="nowrap"
                    >
                         <Box
                              component="form"
                              sx={{
                                   "& .MuiTextField-root": {
                                        m: 1,
                                        width: "40ch",
                                   },
                                   "& .MuiFormHelperText-root": {
                                        ml: 1,
                                        width: "60ch",
                                   }
                              }}
                              noValidate
                              autoComplete="off"
                         >
                              <div>
                                   <TextField
                                        className="Editname"
                                        label="Name"
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                   />
                                   <FormHelperText
                                        className="erroraddpopmsg"
                                        style={{ color: 'red' }}
                                   >
                                        {popuperrormsg
                                             ? "*Name cannot have numbers or special characters."
                                             : ""}
                                   </FormHelperText>
                              </div>
                         </Box>
                         <FormControl sx={{ m: 1, minWidth: "40ch" }}>
                              <InputLabel id="demo-simple-select-autowidth-label">Gender</InputLabel>
                              <Select
                                   labelId="demo-simple-select-autowidth-label"
                                   id="demo-simple-select-autowidth"
                                   onChange={selecthandleChange}
                                   value={gender}
                                   autoWidth
                                   label="Gender"
                                   sx={{ p: 1.5 }}
                              >
                                   <MenuItem value="">
                                        <em>None</em>
                                   </MenuItem>
                                   <MenuItem value="Male">Male</MenuItem>
                                   <MenuItem value="Female">Female</MenuItem>
                                   <MenuItem value="Other">Other</MenuItem>
                                   <MenuItem value="Unspecified">Unspecified</MenuItem>
                              </Select>
                         </FormControl>
                         <Box
                              component="form"
                              sx={{
                                   "& .MuiTextField-root": {
                                        m: 1,
                                        width: "40ch",
                                   },
                              }}
                              noValidate
                              autoComplete="off"
                         >
                              <div>
                                   <TextField
                                        className="Editemail"
                                        label="Email"
                                        type='email'
                                        disabled
                                        value={useremail}
                                   />
                                   <FormHelperText
                                        className="errorpopupmsg"
                                        sx={{ width: "280px" }}
                                   >
                                        {/* Display any error messages related to the name field */}
                                   </FormHelperText>
                              </div>
                         </Box>
                         <Box
                              component="form"
                              sx={{
                                   "& .MuiTextField-root": {
                                        m: 1,
                                        width: "40ch",
                                   },
                              }}
                              noValidate
                              autoComplete="off"
                         >
                              <div>
                                   <TextField
                                        className="Editphno"
                                        label="Phonenumber"
                                        type='text'
                                        disabled
                                        value={userphone}
                                   />
                                   <FormHelperText
                                        className="errorpopupmsg"
                                        sx={{ width: "280px" }}
                                   >
                                        {/* Display any error messages related to the name field */}
                                   </FormHelperText>
                              </div>
                         </Box>
                         <Button
                              sx={{
                                   m: 1,
                              }}
                              variant="contained"
                              onClick={() => handleProfileEdit()}>
                              Save</Button>
                    </Grid>
               </Card>
          </DashboardLayout>
     );
}

export default Profile;