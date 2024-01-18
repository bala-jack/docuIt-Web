import React, { useEffect, useState } from 'react';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Alert, Box, Card, Slide, Snackbar, TextField, Divider, FormHelperText, CardActionArea } from '@mui/material';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import { useAuth } from "context/AuthContext";
import { changePin } from 'services';
import MDButton from 'components/MDButton';
import { logout } from "services";
import { DOCUIT_SETTINGS_SCREEN } from 'utilities/strings';


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
               handleSnackbarOpen(DOCUIT_SETTINGS_SCREEN.setting_pin_error, 'error');
          }
          else if (UserPin !== ConfirmPin) {
               handleSnackbarOpen(DOCUIT_SETTINGS_SCREEN.setting_pin_notmatch, 'error');
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

     const termsandConditionsUrl = () => {
          window.open('http://infeneo.com/terms', '_blank');
     };

     const privacyPolicyUrl = () => {
          window.open('http://infeneo.com/terms', '_blank');
     }

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
               <h2 style={{ margin: 25 }}>{DOCUIT_SETTINGS_SCREEN.setting_header}</h2>
               <form style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                    <Card
                         sx={{ minWidth: '80%', display: "flex", flexDirection: "column", alignItems: "center" }}
                    >
                         <h3 style={{ margin: 20 }}>{DOCUIT_SETTINGS_SCREEN.settinf_changepin}</h3>
                         <Box sx={{ verticalAlign: "middle" }}>
                              <TextField
                                   sx={{ m: 3, width: '40ch' }}
                                   inputProps={{ maxLength: 4 }}
                                   label={DOCUIT_SETTINGS_SCREEN.setting_enterpin_label}
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
                                   label={DOCUIT_SETTINGS_SCREEN.setting_confirmpin_label}
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
                              < DialogTitle > {DOCUIT_SETTINGS_SCREEN.setting_dialog_title}</DialogTitle >
                              <DialogContent>
                                   {DOCUIT_SETTINGS_SCREEN.setting_dialog_content}
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
               < h2 style={{ margin: 25, }}> {DOCUIT_SETTINGS_SCREEN.setting_terms}</h2 >
               <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                    <Card sx={{ minWidth: '80%', display: "flex", flexDirection: "column", alignItems: "left" }}>
                         <CardActionArea onClick={termsandConditionsUrl}>
                              <h2 style={{ margin: 25 }}>{DOCUIT_SETTINGS_SCREEN.setting_terms_header}</h2>
                         </CardActionArea>
                         <Divider variant="middle" sx={{ m: 0 }} />
                         <CardActionArea onClick={privacyPolicyUrl}>
                              <h2 style={{ margin: 25 }}>{DOCUIT_SETTINGS_SCREEN.setting_privacy}</h2>
                         </CardActionArea>
                    </Card>
               </div>
          </DashboardLayout >
     )
}
export default Settings;