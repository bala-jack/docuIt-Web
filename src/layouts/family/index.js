import React, { useState, useEffect } from 'react';
import { Button, Card, Icon, Input, Switch, Table, TableContainer, TableCell, TableHead, TableRow, TableBody, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from "@mui/material";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { listFamily, editFamily, deleteFamily, addFamily } from "services";
import { useAuth } from "context/AuthContext";
import '../family/listfamily.css';
import '../family/family.scss';
import { Form, Link, Navigate, Route, unstable_HistoryRouter, useParams } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { useNavigate, useHistory } from 'react-router-dom';
import { listFamilyMembers } from 'services';
import { inviteUser } from 'services';
import { Label } from '@mui/icons-material';
import MDInput from 'components/MDInput';
import { useFormik } from "formik";
import MDButton from 'components/MDButton';
import * as yup from 'yup'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import FormHelperText from '@mui/material/FormHelperText';
import Paper from '@mui/material/Paper';
import MoreVertIcon from '@mui/icons-material/MoreVert'
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import Snackbar from '@mui/material/Snackbar';
import Slide from '@mui/material/Slide';
import Alert from '@mui/material/Alert';
import { Grid } from "react-loader-spinner";
import Backdrop from '@mui/material/Backdrop';








function Family() {

     const { UserData, setFamilyMemberData, FamilyMemberData, setListFamily } = useAuth();
     const [familyData, setFamilyData] = useState([]);
     const [familyMemberData, setfamilyMemberData] = useState([]);
     const [showPopup, setShowPopup] = useState(false);
     const [popupindex, setpopupindex] = useState('');
     const [isEditing, setIsEditing] = useState('');
     const [flashMessage, setFlashMessage] = useState('');
     const [ErrorflashMessage, setErrorFlashMessage] = useState('');
     const [Addpop, setAddPop] = useState(false);
     const [Add, setAdd] = useState('');
     const [sFamilyMember, setsFamilyMember] = useState(false)
     const [hlistFamily, setHideListFamily] = useState(true);
     const [invitePop, setInvitePop] = useState(false);
     const [phoneNumbers, setphoneNumbers] = useState([]);
     const [familyId, setFamilyid] = useState('');
     const [invitedBy, setInviteBy] = useState('');
     const [isFamilyMembersPage, setIsFamilyMembersPage] = useState(false);
     const [familyItems, setFamilyItems] = useState([]);
     const { familyName } = useParams();
     const navigate = useNavigate();
     const enabled = phoneNumbers.length < 9;
     const nameregex = /^[A-Za-z ]+$/;
     const popuperrormsg = !nameregex.test(isEditing.trim());
     const isButtonDisabled = isEditing.trim() === "";
     const AddpopDisablebutton = Add.trim() === "";
     const Addpoperrormsg = !nameregex.test(Add.trim());
     const [menuAnchorEl, setMenuAnchorEl] = useState(null)
     const [details, setDetails] = useState('')
     const [snackbarOpen, setSnackbarOpen] = useState(false);
     const [snackbarMessage, setSnackbarMessage] = useState('');
     const [snackbarType, setSnackbarType] = useState('success');
     const editDeleteIconSize = 18
     const [isLoading, setIsLoading] = useState(false);
     const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
     const [deleteFamilyId, setDeleteFamilyId] = useState([])



     useEffect(() => {
          fetchData();
     }, [UserData, setFamilyData, setFamilyMemberData, sFamilyMember]);

     const fetchData = async () => {
          try {
               const { data } = await listFamily(UserData.id);
               if (data?.response?.familyList) {
                    const extractedData = data.response.familyList.map((familyItem) => ({
                         name: familyItem.name,
                         id: familyItem.id,
                         createdBy: familyItem.createdBy,
                         createdAt: familyItem.createdAt
                    }));
                    setFamilyData(extractedData);
                    console.log('extractedDta', extractedData)
                    // setListFamily(extractedData);
                    // localStorage.setItem('docuItFamilyData', JSON.stringify(extractedData));
               }
          } catch (err) {
               console.error("API call failed:", err);
          }
     };
     const handleFamilyNameClick = async (familyItem) => {
          try {
               const familId = familyItem.id;
               const { data } = await listFamilyMembers(familId);
               console.log('>>>>>>>>>>>>>', data);
               if (data?.status === 'SUCCESS') {
                    setsFamilyMember(true);
                    setHideListFamily(false);
                    setIsFamilyMembersPage(true);
               }
               if (data && data.response && Array.isArray(data.response.MemberList)) {
                    let memberList = data.response.MemberList.filter(filterItem => filterItem.user.id !== UserData.id)
                    console.log('memberList<<<<<<<<<<<<<', memberList, UserData.id, familyItem.createdBy)
                    let combinedData = UserData.id === familyItem.createdBy ? memberList : memberList.filter(filterItem => filterItem.inviteStatus === "Accepted");
                    setfamilyMemberData(combinedData);
                    setFamilyMemberData(data.response.MemberList.map(member => member.user));
                    setFamilyItems(familyItem);
                    // localStorage.setItem('docuItMemberDetails', JSON.stringify(data?.response?.MemberList?.user));
               } else {
                    console.error('Invalid data structure:', data);
               }
          }
          catch (error) {
               console.error('Error fetching data:', error);
          }
     };

     const handleInvite = () => {
          setInvitePop(true);
     }

     const handleEditInput = (index, value) => {
          // const updatedData = [...familyData];
          // updatedData[index].name = value;
          setIsEditing(value);
     };

     const handleInviteUser = async (i) => {
          console.log('cliked-inviteUser')
     }

     const handleSave = async () => {
          try {
               setIsLoading(true)
               const isNameExistsoverall = familyData.find(
                    (item) =>
                         item.name.toLocaleLowerCase() === isEditing.toLocaleLowerCase()
               )

               if (
                    isNameExistsoverall?.name.trim().toLocaleLowerCase() ===
                    isEditing.trim().toLocaleLowerCase()
               ) {
                    setShowPopup(false);
                    setIsLoading(false)
                    handleSnackbarOpen("Family name is already registered", 'error')
                    return;
               }

               const constructObject = {
                    name: isEditing,
                    familyId: popupindex,
                    adminId: UserData.id,
               };

               const { data } = await editFamily(constructObject);

               if (data?.status === "SUCCESS") {
                    setShowPopup(false);
                    setTimeout(() => {
                         setIsLoading(false);
                         handleSnackbarOpen(`Family Name Changed Successfully`, 'success');
                         fetchData();
                    }, 1000);
               }
               else {
                    setShowPopup(false);
                    setErrorFlashMessage("Error. Please try again!");
                    setTimeout(() => {
                         setErrorFlashMessage("");
                    }, 1000);
                    return;
               }
          } catch (err) {
               console.error("Error saving family:", err);
               setErrorFlashMessage(err.response.error.message);
               setIsLoading(false);
          }
          finally {

          }

     };


     const toggleEdit = (id, name) => {
          setpopupindex(id);
          setShowPopup(true);
          setIsEditing(name);
          console.log("name", name);

     };

     const togglePopup = () => {
          setShowPopup(!showPopup);
          setpopupindex(null);
          setAddPop(false);
     };

     const handleDelete = async (familyIdd) => {
          console.log('handleDelete', familyIdd);
          try {
               const adminId = UserData.id;
               // const familyId = familyIdd && familyIdd.family ? familyIdd.family.id : null;
               const familyId = familyIdd;
               const values = { familyId: familyId, adminId: adminId };
               const { data } = await deleteFamily(values);
               setIsLoading(true);
               if (data?.status === 'SUCCESS') {
                    setTimeout(() => {
                         setFamilyData(prevData => prevData.filter(item => item.id !== familyId));
                         setIsLoading(false)
                         handleSnackbarOpen('Family deleted successfully', 'success');
                    }, 1000);

               } else {
                    // console.error('Failed to delete family.');
               }
          } catch (err) {
               console.error('Error deleting family:', err);
          } finally {
               setDeleteDialogOpen(false);
               setDeleteFamilyId(null);

          }
     };

     const handleAdd = () => {
          setAddPop(true);
     }

     const handleInviteChange = (value) => {
          setphoneNumbers([value]);
     };

     const handleInviteSubmit = async (familyId) => {
          try {
               setIsLoading(true)
               console.log('>>>>>>>>>>>memberinvite FamilyID', familyId)
               const invitedBy = UserData.id;
               const { data } = await inviteUser({ familyId, invitedBy, phoneNumbers: [phoneNumbers[0]] });
               console.log('Succes', data);
               if (data?.status === 'SUCCESS') {
                    setInvitePop(false);
                    setphoneNumbers('');

                    setTimeout(() => {
                         setIsLoading(false);
                         handleSnackbarOpen(`User Invited SuccessFully`, 'success');
                    }, 1000);
               } else {
                    console.error('Failed to invite user.', data.error);
               }
          } catch (err) {
               console.error('Error inviting user:', err);
          }
     }

     const handleAddInput = (e) => {
          setAdd(e.target.value);
     }

     const handleAddsave = async () => {
          try {

               setIsLoading(true)

               const adminIdAdd = Add;

               const isNameExistsoverall = familyData.find((item) => item.name.trim().toLocaleLowerCase() === Add.trim().toLocaleLowerCase());

               if (isNameExistsoverall?.name === Add.trim().toLocaleLowerCase()) {
                    setAddPop(false);

                    // setErrorFlashMessage("Family name is already registered");
                    handleSnackbarOpen(`Family name is already registered`, 'error')
                    setAdd("");
                    // setTimeout(() => {
                    //      setErrorFlashMessage("");
                    // }, 1000);
                    return;
               }

               const val = { name: adminIdAdd, adminId: UserData.id };
               const { data } = await addFamily(val);

               if (data?.status === "SUCCESS") {
                    const newFamily = data?.response?.familyDetails;
                    const newDetails = newFamily?.member[0].invitedBy
                    console.log("invitedby", newDetails)
                    setAddPop(false);

                    setFamilyData((prevData) => [...prevData, newFamily]);
                    setFamilyData((prevData) => [...prevData, newDetails])
                    // setFamilyData((prevData) => [...prevData, newDetails])
                    // setDetails(newDetails)

                    console.log(" familyData", newFamily)
                    // setFlashMessage(data?.message);
                    setTimeout(() => {
                         setIsLoading(false);
                         handleSnackbarOpen(`Family Added SuccessFully`, 'success')
                    }, 1000)




                    setAdd("");

                    await fetchData();
               }

               else {
                    setAddPop(false);
                    setTimeout(() => {
                         setIsLoading(false)
                         handleSnackbarOpen("Error. Please try again!!", 'error');
                    }, 1000);

                    setAdd("");

               }
          } catch (error) {
               console.error("Error Save family:", error);
               handleSnackbarOpen(`Error Save family`, 'error')
          }
     };

     const closePopup = () => {
          setAddPop(false);
          setShowPopup(false);
          setInvitePop(false);
     }
     const preventClose = (e) => {
          e.stopPropagation();
     }

     const handleSnackbarOpen = (message, type) => {
          setSnackbarMessage(message);
          setSnackbarType(type);
          setSnackbarOpen(true);
     };

     const handleSnackbarClose = () => {
          setSnackbarOpen(false);
     };

     const formatDate = (dateString) => {
          const documentDate = new Date(dateString);

          const day = documentDate.getDate();
          const month = documentDate.toLocaleString('en-US', { month: 'long' });
          const year = documentDate.getFullYear();

          return `${day}-${month}-${year}`;
     };

     const openDeleteDialog = (familyId) => {
          setDeleteFamilyId(familyId);
          setDeleteDialogOpen(true);
     };

     const closeDeleteDialog = () => {
          setDeleteDialogOpen(false);
          setDeleteFamilyId(null);
     };

     return (
          <DashboardLayout className='mainContent'>
               <DashboardNavbar />

               {isLoading && (
                    <Backdrop
                         sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                         open={isLoading}
                    >
                         <Grid color='#FCC600' />
                    </Backdrop>
               )}
               {hlistFamily && (
                    <MDBox className="mdbboxfamily">
                         <div className="addbtn">
                              <h2>Family Management</h2>
                              <div>
                                   <Button variant="contained" onClick={handleAdd} className="btnfamilylist">Add + </Button>
                              </div>
                         </div>

                         <Card style={{ width: '100%' }}>
                              <Card>
                                   {/* Add Family Popup */}
                                   {Addpop && (
                                        <div>
                                             <div className="overlay" onClick={closePopup}>
                                                  <div className="popup" onClick={preventClose}>
                                                       <div className="popup-content">
                                                            <div className='pop-input-div'>
                                                                 <h3 style={{ padding: '28px' }}>Enter Family Name</h3>
                                                                 <div className='edit-Input'>
                                                                      <Icon fontSize="small">diversity_3</Icon>
                                                                      <Box
                                                                           component="form"
                                                                           sx={{
                                                                                "& .MuiTextField-root": {
                                                                                     m: 1,
                                                                                     width: "25ch",
                                                                                },
                                                                           }}
                                                                           noValidate
                                                                           autoComplete="off"
                                                                      >
                                                                           <div>
                                                                                <TextField
                                                                                     className="pop-up-input"
                                                                                     label="Enter family name"
                                                                                     type="text"
                                                                                     onChange={(e) => handleAddInput(e)}
                                                                                     variant="standard"
                                                                                />

                                                                                {Add.trim() !== "" && (
                                                                                     <FormHelperText
                                                                                          className="erroraddpopmsg"
                                                                                          sx={{ width: "280px" }}
                                                                                          style={{ color: 'red' }}
                                                                                     >
                                                                                          {Addpoperrormsg
                                                                                               ? "*Family name cannot have numbers or special characters."
                                                                                               : ""}
                                                                                     </FormHelperText>
                                                                                )}
                                                                           </div>
                                                                      </Box>
                                                                 </div>
                                                            </div>
                                                            <div className='btn-pop'>
                                                                 <MDButton variant="contained" color="error" onClick={togglePopup} className='btn-pop'>Close</MDButton>
                                                                 {AddpopDisablebutton ? (
                                                                      <MDButton
                                                                           variant="contained"
                                                                           disabled={AddpopDisablebutton}
                                                                           color="success"
                                                                      > Save </MDButton>
                                                                 ) : (
                                                                      <MDButton
                                                                           variant="contained"
                                                                           color="success"
                                                                           onClick={() => handleAddsave()}
                                                                      >Save</MDButton>
                                                                 )}
                                                            </div>
                                                       </div>
                                                  </div>
                                             </div>
                                        </div>
                                   )}
                              </Card>
                              <TableContainer component={Paper} style={{ width: '100%' }} >
                                   <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table"
                                   >
                                        <TableHead style={{ display: 'contents' }}>
                                             <TableRow>
                                                  <TableCell align="justify">Family Name</TableCell>
                                                  <TableCell align="center">Created At</TableCell>
                                                  <TableCell align="center">Created By</TableCell>
                                                  <TableCell align="center">Actions</TableCell>
                                             </TableRow>
                                        </TableHead>

                                        <TableBody style={{ color: 'black' }}>
                                             {familyData.map((item, index) => (
                                                  <TableRow key={index}>
                                                       <TableCell align="justify">
                                                            {showPopup && popupindex === item.id && (
                                                                 <div>
                                                                      <div className="overlay" onClick={closePopup}>
                                                                           <div className="popup" onClick={preventClose}>
                                                                                <div className="popup-content">
                                                                                     <div className='pop-input-div'>
                                                                                          <h3 style={{ padding: '28px' }}>Change Family Name</h3>
                                                                                          <div className='edit-Input'>
                                                                                               <Icon fontSize="small">diversity_3</Icon>
                                                                                               <Box
                                                                                                    component="form"
                                                                                                    sx={{
                                                                                                         "& .MuiTextField-root": {
                                                                                                              m: 1,
                                                                                                              width: "25ch",
                                                                                                         },
                                                                                                    }}
                                                                                                    noValidate
                                                                                                    autoComplete="off"
                                                                                               >

                                                                                                    <div>
                                                                                                         <TextField
                                                                                                              className="pop-up-input"
                                                                                                              label="Family name"
                                                                                                              type="text"
                                                                                                              defaultValue={isEditing}
                                                                                                              onChange={(e) => handleEditInput(index, e.target.value)}
                                                                                                              variant="standard" />

                                                                                                         {isEditing.trim() !== "" && (
                                                                                                              <FormHelperText
                                                                                                                   className="errorpopupmsg"
                                                                                                                   sx={{ width: "280px" }}
                                                                                                                   style={{ color: popuperrormsg ? 'red' : 'success' }}
                                                                                                              >
                                                                                                                   {popuperrormsg
                                                                                                                        ? "*Family name cannot have numbers or special characters."
                                                                                                                        : ""}
                                                                                                              </FormHelperText>
                                                                                                         )}
                                                                                                    </div>
                                                                                               </Box>
                                                                                          </div>
                                                                                     </div>
                                                                                     {/* for Edit family member */}
                                                                                     <div className="btn-pop">
                                                                                          <MDButton
                                                                                               variant="contained"
                                                                                               color="error"
                                                                                               onClick={togglePopup}
                                                                                          >Close</MDButton>
                                                                                          {isButtonDisabled ? (
                                                                                               <MDButton
                                                                                                    variant="contained"
                                                                                                    disabled={isButtonDisabled}
                                                                                                    color="success"
                                                                                               > Save </MDButton>
                                                                                          ) : (
                                                                                               <MDButton
                                                                                                    variant="contained"
                                                                                                    color="success"
                                                                                                    onClick={() => {
                                                                                                         handleSave(item);
                                                                                                    }}
                                                                                               > Save </MDButton>)}
                                                                                     </div>
                                                                                </div>
                                                                           </div>
                                                                      </div>
                                                                 </div>
                                                            )}
                                                            <div onClick={() => handleFamilyNameClick(item)} className='hover-click' >{item.name}</div>
                                                       </TableCell>

                                                       <TableCell align='center'>
                                                            {formatDate(item.createdAt)}
                                                       </TableCell>

                                                       <TableCell align='center'>
                                                            {UserData.id === item.createdBy ? UserData.name : 'Others'}
                                                       </TableCell>
                                                       <TableCell align="center" style={{ display: 'flex', justifyContent: 'center' }}>
                                                            {item.createdBy === UserData.id ? (
                                                                 <>

                                                                      <Tooltip title="Edit" placement="top" sx={{ m: 1, cursor: 'pointer' }}>
                                                                           <EditIcon style={{ color: 'black', fontSize: editDeleteIconSize }} onClick={() => toggleEdit(item.id, item.name)} />
                                                                      </Tooltip>


                                                                      <Tooltip title="Delete" placement="top" sx={{ m: 1, cursor: 'pointer' }}>
                                                                           <DeleteIcon style={{ color: 'black', fontSize: editDeleteIconSize }} onClick={() => openDeleteDialog(item.id)} />
                                                                      </Tooltip>

                                                                 </>
                                                            ) : (
                                                                 <Tooltip title="Visibility" placement="top">
                                                                      <Icon onClick={() => handleFamilyNameClick(item)} style={{ cursor: 'pointer', color: 'black', margin: '6px 0px', fontSize: editDeleteIconSize }}>
                                                                           visibility
                                                                      </Icon>
                                                                 </Tooltip>
                                                            )}
                                                       </TableCell>

                                                       <Snackbar
                                                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                                            open={snackbarOpen}
                                                            autoHideDuration={2000}
                                                            onClose={handleSnackbarClose}
                                                            TransitionComponent={(props) => <Slide {...props} direction="left" />}
                                                       >
                                                            <Alert
                                                                 severity={snackbarType}
                                                                 sx={{ width: '100%', color: '#ffffff', backgroundColor: snackbarType === 'success' ? '#236925' : '#b92525' }}
                                                            >
                                                                 {snackbarMessage}
                                                            </Alert>
                                                       </Snackbar>
                                                  </TableRow>
                                             ))}
                                        </TableBody>
                                   </Table>

                              </TableContainer>
                              <Dialog
                                   open={isDeleteDialogOpen}
                                   onClose={closeDeleteDialog}
                                   fullWidth
                                   maxWidth="xs"
                              >

                                   <DialogTitle>Confirm Delete</DialogTitle>
                                   <DialogContent>
                                        Are you sure you want to delete this Family?
                                   </DialogContent>
                                   {console.log('DialogContent', deleteFamilyId)}
                                   <DialogActions>
                                        <Button onClick={closeDeleteDialog}>Cancel</Button>
                                        <Button onClick={() => handleDelete(deleteFamilyId)}>Delete</Button>
                                   </DialogActions>

                              </Dialog>

                         </Card>

                    </MDBox>
               )}

               {sFamilyMember && (
                    <>
                         <MDBox className="mdbboxfamily">
                              <div className="addbtn">
                                   {familyMemberData.length === 0 ? (
                                        <h2>No Family Users</h2>
                                   ) : (
                                        <>
                                             {familyMemberData.map((item, index) => (
                                                  <h2 key={index}>{item.family.name}</h2>
                                             ))}
                                        </>
                                   )}


                                   <div>
                                        <Button variant="contained" className="btnfamilylist" onClick={handleInvite}>Invite + </Button>
                                   </div>
                              </div>
                              <Card style={{ width: '100%' }}>
                                   <div>
                                        <TableContainer component={Paper}>
                                             <Table aria-label="simple table">
                                                  <TableHead style={{ display: 'contents' }}>
                                                       <TableRow>
                                                            <TableCell align='center'>Family Member</TableCell>
                                                            <TableCell align='center'>created at</TableCell>
                                                            <TableCell align='center'>Action</TableCell>
                                                       </TableRow>
                                                  </TableHead>
                                                  <TableBody>
                                                       {familyMemberData.map((item, index) => (
                                                            <TableRow key={index}>
                                                                 <TableCell align='center'>
                                                                      {item.user.name}
                                                                 </TableCell>
                                                                 <TableCell align='center'>
                                                                      {formatDate(item.user.createdAt)}
                                                                 </TableCell>
                                                                 <TableCell align='center'>
                                                                      {console.log("item.inviteS", item.inviteStatus)}
                                                                      {item.inviteStatus === 'Invited' ? (
                                                                           <div>
                                                                                <Button className="btn-delete"><Icon>add_reaction</Icon></Button>
                                                                           </div>
                                                                      ) : null}
                                                                      {UserData.id === familyItems.createdBy && item.inviteStatus === 'Accepted' ? (
                                                                           <div>
                                                                                <Button className="btn-delete" onClick={() => handleDelete()}><Icon>delete</Icon></Button>
                                                                           </div>
                                                                      ) : null}
                                                                 </TableCell>
                                                            </TableRow>
                                                       ))}
                                                  </TableBody>
                                             </Table>
                                        </TableContainer>
                                        {invitePop && (
                                             <div className="overlay" onClick={closePopup}>
                                                  <div className="popup" onClick={preventClose}>
                                                       <div className="popup-content">
                                                            <div className='pop-input-div'>
                                                                 <form>
                                                                      <MDBox mb={2}>
                                                                           <h3>Invite User</h3>
                                                                           <Input
                                                                                placeholder="Phone Number"
                                                                                label="phoneNumbers"
                                                                                country={'in'}
                                                                                value={phoneNumbers}
                                                                                fullWidth
                                                                                onChange={(e) => handleInviteChange(e.target.value)}
                                                                                inputProps={{
                                                                                     required: true,
                                                                                }}
                                                                           />
                                                                      </MDBox>
                                                                 </form>
                                                                 <MDBox mt={4} mb={1}>
                                                                      {familyData.length > 0 && (
                                                                           <MDButton
                                                                                key={familyData[0].id}
                                                                                type="submit"
                                                                                variant="gradient"
                                                                                onClick={(e) => handleInviteSubmit(familyData.map((item) => item.id))}
                                                                                color="docuit"
                                                                                fullWidth
                                                                                disabled={!enabled}
                                                                           >
                                                                                {console.log("familyData[0].id", familyData)}
                                                                                Invite
                                                                           </MDButton>
                                                                      )}
                                                                 </MDBox>
                                                            </div>
                                                       </div>
                                                  </div>
                                             </div>
                                        )}
                                   </div>
                              </Card>
                         </MDBox>
                    </>
               )}



          </DashboardLayout>
     );
}

export default Family;