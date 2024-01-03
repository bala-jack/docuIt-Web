import React, { useEffect, useState, useRef } from 'react';
import { styled } from '@mui/material/styles';
import { Avatar, Alert, Box, Card, Grid, Select } from "@mui/material";
import { IconButton, InputLabel, MenuItem, TextField, Snackbar, Slide, Badge, FormControl, FormHelperText } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useAuth } from "context/AuthContext";
import { updateProfile } from "services";
import MDButton from 'components/MDButton';
import EditIcon from '@mui/icons-material/Edit';
import { uploadDocuments } from 'services';

function Profile() {
     // useauth.
     const { UserData, setuserdata } = useAuth();

     // state for user data.
     const [userDetails, setUserDetails] = useState({});
     const [userName, setUserName] = useState("");
     const [Gender, setGender] = useState('');
     const [userEmail, setUserEmail] = useState('');
     const [userPhone, setUserPhone] = useState('');
     const [userPic, setUserPic] = useState('');
     const [selectedFile, setSelectedFile] = useState(null);
     const [isSaveButtonDisabled, setSaveButtonDisabled] = useState(true);

     // snackbar.
     const [snackbarOpen, setSnackbarOpen] = useState(false);
     const [snackbarMessage, setSnackbarMessage] = useState('');
     const [snackbarType, setSnackbarType] = useState('success');

     // Variables for validation.
     const nameregex = /^[A-Za-z ]+$/;
     const popuperrormsg = !nameregex.test(userName.trim());
     const fileInputRef = useRef(null);

     useEffect(() => {
          UserProfile();
     }, [UserData]);

     // Useauth for getting details 
     const UserProfile = () => {

          const profiledetails = UserData;

          if (profiledetails) {
               setUserDetails(profiledetails)
               setUserName(profiledetails.name)
               setGender(profiledetails.gender)
               setUserPhone(profiledetails.phone)
               setUserEmail(profiledetails.email)
               setUserPic(profiledetails.imageUrl)
          }
     }

     // API call for saving changes to server
     const handleProfileEdit = async (e, imageUrl) => {
          try {

               const params = {
                    "userId": userDetails.id,
                    "name": userName,
                    "gender": Gender,
                    "imageUrl": imageUrl ?? userPic
               }

               console.log("params", params);
               const { data } = await updateProfile(params);
               console.log("data", data);

               if (data?.status === "SUCCESS") {
                    setuserdata(data?.response?.userDetails);
                    localStorage.clear();
                    localStorage.setItem('docuItuserDetails', JSON.stringify(data?.response?.userDetails));
                    handleSnackbarOpen("Profile details updated successfully.", 'success');
                    setSaveButtonDisabled(true);
               }

               else {
                    console.log("Update failed:", data?.message);
                    handleSnackbarOpen("Invalid entry. Please try again!", 'error');
               }

          } catch (err) {
               console.error('Error updating profile:', err);
               handleSnackbarOpen('Error updating profile:', err);
          }
     };

     // Snackbar handling function - message, type(severity), open-close
     const handleSnackbarOpen = (message, type) => {
          setSnackbarMessage(message);
          setSnackbarType(type);
          setSnackbarOpen(true);
     };

     // Name input textfield
     const handleNameEdit = (e) => {
          setUserName(e);
          if (e === "") {
               setSaveButtonDisabled(true);
          }
          else {
               setSaveButtonDisabled(false);
          }
     }

     // Gender select input field
     const selecthandleChange = (event) => {
          setGender(event.target.value);
          setSaveButtonDisabled(false);
     };

     // For Avatar Profile picture uploading
     const handleFileInputChange = async (e) => {
          const file = e.target.files[0];
          // const url = URL.createObjectURL(file);
          // setSelectedFile(url);
          // setUserPic(selectedFile);

          const bodyFormData = new FormData();
          bodyFormData.append('file', file);
          try {
               const { data } = await uploadDocuments(userDetails.id, bodyFormData);
               if (data.documentUrl) {
                    handleProfileEdit(e, data.documentUrl);
               }
               else {
                    handleSnackbarOpen("Unable to upload Image. Please try again", 'error');
               }
          }
          catch {
               handleSnackbarOpen("Something went wrong please try again", 'error');
          }
     }

     //Avatar profile name
     const stringAvatar = (name) => {
          const words = name.split(' ');
          const initials = words.map(word => word.charAt(0).toUpperCase());
          return initials.join('');
     };

     //Avatar Color
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

     // Edit profile pic button/badge
     const handleSmallAvatarClick = () => {
          if (fileInputRef.current) {
               fileInputRef.current.click();
          }
     };

     // Upload profile pic button/badge styles
     const SmallAvatar = styled(Avatar)(({ theme }) => ({
          backgroundColor: '#44b700',
          color: '#ffffff',
          width: 26,
          height: 26,
          cursor: PointerEvent,

     }));

     const handleBadgeClick = () => {
          if (fileInputRef.current) {
               fileInputRef.current.click();
          }
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
                    <Box
                         sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              m: 1,
                              mt: 5
                         }}>
                         <h2>My Profile</h2>

                         <Badge
                              overlap="circular"
                              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                              badgeContent={
                                   <>
                                        <IconButton onClick={handleBadgeClick} component="div">
                                             <SmallAvatar
                                                  alt="Edit"
                                                  sx={{ '& > button': { color: 'transparent', height: '100%', width: '100%' } }}
                                             >
                                                  <EditIcon />
                                             </SmallAvatar>
                                        </IconButton>
                                        <input
                                             id="fileInput"
                                             type="file"
                                             accept="image/jpeg, image/jpg"
                                             ref={fileInputRef}
                                             style={{ display: 'none' }}
                                             onChange={handleFileInputChange}
                                        />
                                   </>
                              }
                         >
                              <Avatar
                                   sx={{
                                        m: 1,
                                        width: 124,
                                        height: 124,
                                        objectFit: 'cover',
                                        '& > img': {
                                             height: '100% !important',
                                        },
                                        bgcolor: stringToColor(userName),
                                        fontSize: '4rem'
                                   }}
                                   style={{
                                        border: '3px solid #2f53acbb',
                                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                   }}
                                   onClick={handleBadgeClick}
                                   alt={userName}
                                   src={userPic}
                              >
                                   {stringAvatar(userName)}
                              </Avatar>
                         </Badge>
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
                         sx={{ mb: 4 }}
                    >
                         <Box
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
                         >
                              <div>
                                   <TextField
                                        className="Editname"
                                        label="Name"
                                        type="text"
                                        value={userName}
                                        onChange={(e) => {
                                             handleNameEdit(e.target.value);
                                        }}
                                   />

                                   {userName.trim() !== "" && (
                                        <FormHelperText
                                             className="erroraddpopmsg"
                                             style={{ color: 'red' }}
                                        >
                                             {popuperrormsg
                                                  ? "*Name cannot have numbers or special characters."
                                                  : ""}
                                        </FormHelperText>
                                   )}
                              </div>
                         </Box>
                         <FormControl sx={{ m: 1, maxWidth: "57ch", }}>

                              <InputLabel>Gender</InputLabel>
                              <Select
                                   labelId="demo-simple-select-autowidth-label"
                                   onChange={selecthandleChange}
                                   value={Gender}
                                   label="Gender"
                                   sx={{
                                        minWidth: "57ch", pt: 1.2, pb: 1.2,
                                        "& > input": {
                                             color: 'transparent',
                                             width: "100%",
                                             height: "100%",
                                        }
                                   }}
                              >
                                   <MenuItem value="">
                                        <em></em>
                                   </MenuItem>
                                   <MenuItem value="Male">Male</MenuItem>
                                   <MenuItem value="Female">Female</MenuItem>
                                   <MenuItem value="Other">Other</MenuItem>
                                   <MenuItem value="Unspecified">Unspecified</MenuItem>
                              </Select>
                         </FormControl>

                         <Box
                              sx={{
                                   "& .MuiTextField-root": {
                                        m: 1,
                                        width: "40ch",
                                   },
                              }}
                         >
                              <div>
                                   <TextField
                                        className="Editemail"
                                        label="Email"
                                        type='email'
                                        disabled
                                        value={userEmail}
                                   />
                              </div>
                         </Box>
                         <Box
                              sx={{
                                   "& .MuiTextField-root": {
                                        m: 1,
                                        width: "40ch",
                                   },
                              }}
                         >
                              <div>
                                   <TextField
                                        className="Editphno"
                                        label="Phonenumber"
                                        type='text'
                                        disabled
                                        value={userPhone}
                                   />
                              </div>
                         </Box>
                         <Box
                              sx={{
                                   Width: "40ch"
                              }}>
                              <MDButton
                                   sx={{
                                        m: 1
                                   }}
                                   variant="contained"
                                   color="success"
                                   disabled={isSaveButtonDisabled}
                                   onClick={() => handleProfileEdit()}>
                                   Save</MDButton>
                         </Box>
                    </Grid>
               </Card>
          </DashboardLayout >
     );
}

export default Profile;