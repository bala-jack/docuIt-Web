import React, { useEffect, useState } from 'react';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Alert, Box, Card, Slide, Snackbar, TextField, Divider, FormHelperText } from '@mui/material';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import { useAuth } from "context/AuthContext";
import { changePin } from 'services';
import MDButton from 'components/MDButton';
import { logout } from "services";


function Settings() {
     // useauth.
     const { UserData, logoutSuccess } = useAuth();

     //  useState
     const [UserPin, setUserPin] = useState('');
     const [ConfirmPin, setConfirmPin] = useState('');
     const [isSaveButtonDisabled, setSaveButtonDisabled] = useState(true);

     // for dialog box
     const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

     // useState for snackbar.
     const [snackbarOpen, setSnackbarOpen] = useState(false);
     const [snackbarMessage, setSnackbarMessage] = useState('');
     const [snackbarType, setSnackbarType] = useState('success');
     const [UserPhno, setUserPhno] = useState('')
     const [showEnterPin, setShowEnterPin] = useState(false);
     const [showConfirmPin, setShowConfirmPin] = useState(false);

     // Pin Validation variables
     const pinValidation = /^[0-9]+$/;
     const isEnterPinValid = pinValidation.test(UserPin);
     const isConfirmPinValid = pinValidation.test(ConfirmPin);


     useEffect(() => {
          profileData();
     }, [UserData]);

     // Transfer data from useAuth to local useState
     function profileData() {
          console.log("UserData:::::::", UserData);
          const profileDetails = UserData;
          console.log("profileDetails:::::::", profileDetails);
          if (profileDetails) {
               setUserPhno(profileDetails.phone);
          }
          console.log("UserPhno:{:{:{:{:{:{:{:{:", UserPhno)
     };

     // Change pin API call
     const userPinchange = async () => {

          try {
               const params = {
                    "phone": UserPhno,
                    "pinNumber": UserPin,
               }

               console.log("params", params);
               const { data } = await changePin(params);
               console.log("data", data);

               if (data?.status === "SUCCESS") {
                    handleSnackbarOpen(data?.message, 'success');
                    localStorage.clear();
                    setTimeout(() => {
                         localStorage.clear();
                         logout();
                         logoutSuccess();
                    }, 2500);
               }
          }
          catch (error) {
               console.error("Error unable to change pin", error);
          }
     };

     // Snackbar handling function - message, type(severity), open-close
     const handleSnackbarOpen = (message, type) => {
          setSnackbarMessage(message);
          setSnackbarType(type);
          setSnackbarOpen(true);
     };

     // Pin match confirmation and final validation
     function handleChangePin() {

          if (!isEnterPinValid || !isConfirmPinValid) {
               handleSnackbarOpen("Pin must have numbers only.", 'error');
          }
          else if (UserPin !== ConfirmPin) {
               handleSnackbarOpen("Pins do not match. Please Try again!", 'error');
          }
          else if (UserPin === ConfirmPin) {
               userPinchange();
               setSaveButtonDisabled(true);
               closeDeleteDialog();
          }
     }

     const openDeleteDialog = () => {
          setDeleteDialogOpen(true);
     };

     const closeDeleteDialog = () => {
          setDeleteDialogOpen(false);
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
                         severity={snackbarType}
                         sx={{ width: '100%', color: '#ffffff', backgroundColor: snackbarType === 'success' ? '#236925' : '#b92525' }}
                    >
                         {snackbarMessage}
                    </Alert>
               </Snackbar>
               <h2 style={{ margin: 25 }}>General</h2>
               <form style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                    <Card
                         sx={{ minWidth: '80%', display: "flex", flexDirection: "column", alignItems: "center" }}
                    >
                         <h3 style={{ margin: 20 }}>Change pin</h3>
                         <Box sx={{ verticalAlign: "middle" }}>
                              <TextField
                                   sx={{ m: 3, width: '40ch' }}
                                   inputProps={{ maxLength: 4 }}
                                   label="Enter PIN"
                                   type={showEnterPin ? 'text' : 'password'}
                                   onChange={(e) => setUserPin(e.target.value)}
                                   InputProps={{
                                        endAdornment: (
                                             <InputAdornment position="end">
                                                  <IconButton onClick={() => setShowEnterPin(!showEnterPin)} edge="end">
                                                       {showEnterPin ? <VisibilityOffRoundedIcon /> : <VisibilityRoundedIcon />}
                                                  </IconButton>
                                             </InputAdornment>
                                        ),
                                   }}
                              />
                              {!isEnterPinValid && UserPin !== '' ? (
                                   <FormHelperText
                                        className="pinerrormsg"
                                        style={{ marginLeft: "25px", color: 'red' }}
                                   >
                                        {"* Pin must have numbers only."}
                                   </FormHelperText>
                              ) : null}
                         </Box>

                         <Box sx={{ verticalAlign: "middle" }}>
                              <TextField
                                   sx={{ m: 3, width: '40ch' }}
                                   inputProps={{ maxLength: 4 }}
                                   label="Confirm PIN"
                                   type={showConfirmPin ? 'text' : 'password'}
                                   onChange={(e) => {
                                        setConfirmPin(e.target.value);
                                        setSaveButtonDisabled(false);
                                   }}
                                   InputProps={{
                                        endAdornment: (
                                             <InputAdornment position="end">
                                                  <IconButton onClick={() => setShowConfirmPin(!showConfirmPin)} edge="end">
                                                       {showConfirmPin ? <VisibilityOffRoundedIcon /> : <VisibilityRoundedIcon />}
                                                  </IconButton>
                                             </InputAdornment>
                                        ),
                                   }}
                              />
                              {!isConfirmPinValid && ConfirmPin !== '' ? (
                                   <FormHelperText
                                        className="pinerrormsg"
                                        style={{ marginLeft: "25px", color: 'red' }}
                                   >
                                        {"* Pin must have numbers only."}
                                   </FormHelperText>
                              ) : null}
                         </Box>

                         <MDButton
                              sx={{ m: 3 }}
                              variant="contained"
                              type="button"
                              color="success"
                              disabled={isSaveButtonDisabled}
                              onClick={() => {
                                   openDeleteDialog();
                              }}
                         >
                              Submit
                         </MDButton>
                         <Dialog open={isDeleteDialogOpen} onClose={closeDeleteDialog}>
                              <DialogTitle>Confirm pin change</DialogTitle>
                              <DialogContent>
                                   Are you certain you wish to modify the PIN?
                                   <br />
                                   <small>(Proceeding will terminate the current session, requiring you to sign in again.)</small>
                              </DialogContent>
                              <DialogActions>
                                   <Button onClick={closeDeleteDialog}>Cancel</Button>
                                   <Button onClick={handleChangePin}>Submit</Button>
                              </DialogActions>
                         </Dialog>
                    </Card>
               </form>
               <h2 style={{ margin: 25, }}>Terms & Conditions</h2>
               <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                    <Card
                         sx={{ minWidth: '80%', display: "flex", flexDirection: "column", alignItems: "left" }}
                    >
                         <h3 style={{ margin: 25 }}>* Terms & conditions</h3>
                         <Divider variant="middle" sx={{ m: 0 }} />
                         <h3 style={{ margin: 25 }}>* Privacy policy</h3>
                    </Card>
               </div>
          </DashboardLayout >
     )
}
export default Settings;