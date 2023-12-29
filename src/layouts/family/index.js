import React, { useState, useEffect } from 'react';
import { Button, Card, Icon, Input, Switch, Table, TableContainer, TableCell, TableHead, TableRow, TableBody, IconButton, MenuItem, Menu } from "@mui/material";
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
                    // navigate(`/family/${familyItem.name}`);
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
               const isNameExistsoverall = familyData.find(
                    (item) =>
                         item.name.toLocaleLowerCase() === isEditing.toLocaleLowerCase()
               )

               if (
                    isNameExistsoverall?.name.trim().toLocaleLowerCase() ===
                    isEditing.trim().toLocaleLowerCase()
               ) {
                    setShowPopup(false);
                    setErrorFlashMessage("Family name is already registered");
                    setTimeout(() => {
                         setErrorFlashMessage("");
                    }, 1000);
                    return;
               }

               const constructObject = {
                    name: isEditing,
                    familyId: popupindex,
                    adminId: UserData.id,
               };

               const { data } = await editFamily(constructObject);

               if (data?.status === "SUCCESS") {
                    setFlashMessage(data.message);
                    setShowPopup(false);
                    setTimeout(() => {
                         setFlashMessage("");
                    }, 1000);
                    fetchData();
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
          }
     };


     const toggleEdit = (id, name) => {
          setpopupindex(id);
          setShowPopup(true);
          setIsEditing(name);
     };

     const togglePopup = () => {
          setShowPopup(!showPopup);
          setpopupindex(null);
          setAddPop(false);
     };

     const handleDelete = async (familyIdd) => {

          try {
               const adminId = UserData.id;
               const familyId = familyIdd;
               const values = { familyId: familyId, adminId: adminId };
               const { data } = await deleteFamily(values);
               if (data?.status === 'SUCCESS') {
                    setFamilyData(prevData => prevData.filter(item => item.id !== familyId));
                    setFlashMessage('Family Deleted successfully!');
                    setTimeout(() => {
                         setFlashMessage('');
                    }, 1000);
               } else {
                    // console.error('Failed to delete family.');
               }
          } catch (err) {
               console.error('Error deleting family:', err);
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
               console.log('>>>>>>>>>>>memberinvite FamilyID', familyId)
               const invitedBy = UserData.id;
               const { data } = await inviteUser({ familyId, invitedBy, phoneNumbers: [phoneNumbers[0]] });
               console.log('Succes', data);
               if (data?.status === 'SUCCESS') {
                    setInvitePop(false);
                    setphoneNumbers('');
                    setFlashMessage('User invited successfully');
                    setTimeout(() => {
                         setFlashMessage('');
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
               const adminIdAdd = Add;

               const isNameExistsoverall = familyData.find((item) => item.name.trim().toLocaleLowerCase() === Add.trim().toLocaleLowerCase());

               if (isNameExistsoverall?.name === Add.trim().toLocaleLowerCase()) {
                    setAddPop(false);
                    setErrorFlashMessage("Family name is already registered");
                    setAdd("");
                    setTimeout(() => {
                         setErrorFlashMessage("");
                    }, 1000);
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
                    setFlashMessage(data?.message);
                    setAdd("");
                    setTimeout(() => {
                         setFlashMessage("");
                    }, 1000);
                    await fetchData();
               }

               else {
                    setAddPop(false);
                    setErrorFlashMessage("Error. Please try again!!");
                    setAdd("");
                    setTimeout(() => {
                         setErrorFlashMessage("");
                    }, 1000);
               }
          } catch (error) {
               console.error("Error Save family:", error);
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

     // const handleChangeUserId = (value) => {
     //      setphoneNumbers(value);
     // }
     // console.log('familyData', familyData)

     // const handleMenuOpen = (e) => {
     //      setMenuAnchorEl(e.currentTarget);
     // };

     // const handleMenuClose = () => {
     //      setMenuAnchorEl(null);
     // };

     return (
          //           <DashboardLayout className='mainContent'>
          //                <DashboardNavbar />
          //                <Card>
          //                     {flashMessage && (
          //                          <div>
          //                               <div className="overlay">
          //                                    <div className="popup">
          //                                         <div className="popup-content">
          //                                              <div className='flash-message'>
          //                                                   {flashMessage}
          //                                              </div>
          //                                         </div>
          //                                    </div>
          //                               </div>
          //                          </div>
          //                     )}
          //                </Card>
          //                {hlistFamily && (


          //                     <MDBox className="mdbboxfamily">
          //                          <div className="addbtn">

          //                               <h2>Family Management</h2>
          //                               <div>
          //                                    <Button variant="contained" onClick={handleAdd} className="btnfamilylist">Add + </Button>
          //                               </div>
          //                          </div>

          //                          <Card style={{ width: '37%' }}>

          //                               <Card>
          //                                    {ErrorflashMessage && (
          //                                         <div>
          //                                              <div className="overlay" onClick={closePopup}>
          //                                                   <div className="popup">
          //                                                        <div className="popup-content">
          //                                                             <div className='Errorflash-message'>
          //                                                                  {ErrorflashMessage}
          //                                                             </div>
          //                                                        </div>
          //                                                   </div>
          //                                              </div>
          //                                         </div>
          //                                    )}
          //                               </Card>
          //                               <Card>
          //                                    {Addpop && (
          //                                         <div>                      
          //                                              <div className="overlay" onClick={closePopup}>
          //                                                   <div className="popup" onClick={preventClose}>
          //                                                        <div className="popup-content">
          //                                                             <div className='pop-input-div'>
          //                                                                  <h3 style={{ padding: '28px' }}>Enter Family Name</h3>
          //                                                                  <div className='edit-Input'>
          //                                                                       <Icon fontSize="small">diversity_3</Icon>
          //                                                                       <Box
          //                                                                            component="form"
          //                                                                            sx={{
          //                                                                                 "& .MuiTextField-root": {
          //                                                                                      m: 1,
          //                                                                                      width: "25ch",
          //                                                                                 },
          //                                                                            }}
          //                                                                            noValidate
          //                                                                            autoComplete="off"
          //                                                                       >
          //                                                                            <div>
          //                                                                                 <TextField
          //                                                                                      className="pop-up-input"
          //                                                                                      label="Enter family name"
          //                                                                                      type="text"
          //                                                                                      onChange={(e) => handleAddInput(e)}
          //                                                                                      variant="standard"
          //                                                                                 />

          //                                                                                 {Add.trim() !== "" && (
          //                                                                                      <FormHelperText
          //                                                                                           className="erroraddpopmsg"
          //                                                                                           sx={{ width: "280px" }}
          //                                                                                           style={{ color: 'red' }}
          //                                                                                      >
          //                                                                                           {Addpoperrormsg
          //                                                                                                ? "*Family name cannot have numbers or special characters."
          //                                                                                                : ""}
          //                                                                                      </FormHelperText>
          //                                                                                 )}
          //                                                                            </div>
          //                                                                       </Box>
          //                                                                  </div>
          //                                                             </div>
          //                                                             {/* for Add new family member */}
          //                                                             <div className='btn-pop'>
          //                                                                  <MDButton variant="contained" color="error" onClick={togglePopup} className='btn-pop'>Close</MDButton>
          //                                                                  {AddpopDisablebutton ? (
          //                                                                       <MDButton
          //                                                                            variant="contained"
          //                                                                            disabled={AddpopDisablebutton}
          //                                                                            color="success"
          //                                                                       > Save </MDButton>
          //                                                                  ) : (
          //                                                                       <MDButton
          //                                                                            variant="contained"
          //                                                                            color="success"
          //                                                                            onClick={() => handleAddsave()}
          //                                                                       >Save</MDButton>
          //                                                                  )}
          //                                                             </div>
          //                                                        </div>
          //                                                   </div>
          //                                              </div>
          //                                         </div>
          //                                    )}


          //                               </Card>

          //                               <Table className='family-Table'>
          //                                    <MDBox>
          //                                         <tbody>
          //                                              <tr>
          //                                                   <th>Family Name</th>
          //                                                   <th>Action</th>
          //                                              </tr>
          //                                              {familyData.map((item, index) => (

          //                                                   <>
          //                                                        <tr key={index}>
          //                                                             <td>
          //                                                                   {showPopup &&popupindex === item.id && (
          //                                                                       <div>
          //                                                                            <div className="overlay" onClick={closePopup}>
          //                                                                                 <div className="popup" onClick={preventClose}>
          //                                                                                      <div className="popup-content">
          //                                                                                           <div className='pop-input-div'>
          //                                                                                                <h3 style={{ padding: '28px' }}>Change Family Name</h3>
          //                                                                                                <div className='edit-Input'>
          //                                                                                                     <Icon fontSize="small">diversity_3</Icon>
          //                                                                                                     <Box
          //                                                                                                          component="form"
          //                                                                                                          sx={{
          //                                                                                                               "& .MuiTextField-root": {
          //                                                                                                                    m: 1,
          //                                                                                                                    width: "25ch",
          //                                                                                                               },
          //                                                                                                          }}
          //                                                                                                          noValidate
          //                                                                                                          autoComplete="off"
          //                                                                                                     >
          //                                                                                                          <div>
          //                                                                                                               <TextField
          //                                                                                                                    className="pop-up-input"
          //                                                                                                                    label="Family name"
          //                                                                                                                    type="text"
          //                                                                                                                    defaultValue={isEditing}
          //                                                                                                                    onChange={(e) => handleEditInput(index, e.target.value)}
          //                                                                                                                    variant="standard" />

          //                                                                                                               {isEditing.trim() !== "" && (
          //                                                                                                                    <FormHelperText
          //                                                                                                                         className="errorpopupmsg"
          //                                                                                                                         sx={{ width: "280px" }}
          //                                                                                                                         style={{ color: popuperrormsg ? 'red' : 'success' }}
          //                                                                                                                    >
          //                                                                                                                         {popuperrormsg
          //                                                                                                                              ? "*Family name cannot have numbers or special characters."
          //                                                                                                                              : ""}
          //                                                                                                                    </FormHelperText>
          //                                                                                                               )}
          //                                                                                                          </div>
          //                                                                                                     </Box>
          //                                                                                                </div>
          //                                                                                           </div>
          //                                                                                           {/* for Edit family member */}
          //                                                                                           <div className="btn-pop">
          //                                                                                                <MDButton
          //                                                                                                     variant="contained"
          //                                                                                                     color="error"
          //                                                                                                     onClick={togglePopup}
          //                                                                                                >Close</MDButton>
          //                                                                                                {isButtonDisabled ? (
          //                                                                                                     <MDButton
          //                                                                                                          variant="contained"
          //                                                                                                          disabled={isButtonDisabled}
          //                                                                                                          color="success"
          //                                                                                                     > Save </MDButton>
          //                                                                                                ) : (
          //                                                                                                     <MDButton
          //                                                                                                          variant="contained"
          //                                                                                                          color="success"
          //                                                                                                          onClick={() => {
          //                                                                                                               handleSave(item);
          //                                                                                                          }}
          //                                                                                                     > Save </MDButton>)}
          //                                                                                           </div>
          //                                                                                           <Card>
          //                                                                                                {ErrorflashMessage && (
          //                                                                                                     <div>
          //                                                                                                          <div className="overlay" onClick={closePopup}>
          //                                                                                                               <div className="popup">
          //                                                                                                                    <div className="popup-content">
          //                                                                                                                         <div className='Errorflash-message'>
          //                                                                                                                              {ErrorflashMessage}
          //                                                                                                                         </div>
          //                                                                                                                    </div>
          //                                                                                                               </div>
          //                                                                                                          </div>
          //                                                                                                     </div>
          //                                                                                                )}
          //                                                                                           </Card>
          //                                                                                      </div>
          //                                                                                 </div>
          //                                                                            </div>
          //                                                                       </div>
          //                                                                  )}
          //                                                                  <div onClick={() => handleFamilyNameClick(item)} className='hover-click'>{item.name}</div>
          //                                                             </td>

          //                                                             <td style={{ display: item.createdBy === UserData.id ? 'none' : 'flex', justifyContent: 'center' }}>
          //                                                                  <Icon onClick={() => handleFamilyNameClick(item)} style={{ cursor: 'pointer', color: 'rgb(26,115,232)', margin: '6px 0px' }}>visibility</Icon>
          //                                                             </td>

          //                                                             <td style={{ display: item.createdBy === UserData.id ? 'flex' : 'none' }}>
          //                                                                  <Button onClick={() => toggleEdit(item.id, item.name)}><Icon>edit</Icon></Button>
          //                                                                  <Button className="btn-delete" onClick={() => handleDelete(item.id)}><Icon>delete</Icon></Button>
          //                                                             </td>
          //                                                        </tr >
          //                                                   </>
          //                                              ))}
          //                                         </tbody>

          //                                    </MDBox>
          //                               </Table>
          //                          </Card>
          //                     </MDBox>
          //                )
          //                }
          //                <div>
          //                     {sFamilyMember &&
          //                          <>
          //                               <MDBox className="mdbboxfamily">
          //                                    <div className="addbtn">
          //                                         <h2>Family Users Management</h2>
          //                                         <div>
          //                                              {/* <Button className="btnNotofication" onClick={handleNotofication}><Icon size="large"><h3>notifications</h3></Icon> </Button> */}
          //                                              <Button variant="contained" className="btnfamilylist" onClick={handleInvite}>Invite + </Button>
          //                                         </div>
          //                                    </div>
          //                                    <Card style={{ width: '34%' }}>
          //                                         <>
          //                                              <div>
          //                                                   <Table className='family-Table'>
          //                                                        <MDBox>
          //                                                             <thead>
          //                                                                  <tr>
          //                                                                       <th>Family Member</th>
          //                                                                       <th>Action</th>
          //                                                                  </tr>
          //                                                             </thead>
          //                                                             <tbody>
          //                                                                  {console.log('familyMemberData??????????', familyMemberData)}
          //                                                                  {familyMemberData.map((item, index) => (
          //                                                                       <tr key={index}>
          //                                                                            <td>
          //                                                                                 <div>{item.user.name}</div>
          //                                                                            </td>
          //                                                                            {console.log('item:::::::>>>>', item)}
          //                                                                            <td>
          //                                                                                 {item.inviteStatus === 'Invited' ? (
          //                                                                                      <div>
          //                                                                                           <Button className="btn-delete"><Icon>add_reaction</Icon></Button>
          //                                                                                      </div>
          //                                                                                 ) : (
          //                                                                                      null
          //                                                                                 )}
          //                                                                                 {UserData.id === familyItems.createdBy && item.inviteStatus === 'Accepted' ? (
          //                                                                                      <div>
          //                                                                                           <Button className="btn-delete"><Icon>delete</Icon></Button>
          //                                                                                      </div>
          //                                                                                 ) : (
          //                                                                                      null
          //                                                                                 )}
          //                                                                            </td>
          //                                                                            {invitePop && (
          //                                                                                 <div className="overlay" onClick={closePopup}>
          //                                                                                      <div className="popup" onClick={preventClose}>
          //                                                                                           <div className="popup-content">
          //                                                                                                <div className='pop-input-div'>
          //                                                                                                     <form>
          //                                                                                                          <MDBox mb={2}>
          //                                                                                                               <h3>Invite User</h3>
          //                                                                                                               <Input
          //                                                                                                                    placeholder="Phone Number"
          //                                                                                                                    label="phoneNumbers"
          //                                                                                                                    country={'in'}
          //                                                                                                                    value={phoneNumbers}
          //                                                                                                                    fullWidth
          //                                                                                                                    onChange={(e) => handleInviteChange(e.target.value)}
          //                                                                                                                    inputProps={{
          //                                                                                                                         required: true,
          //                                                                                                                    }}

          //                                                                                                               />
          //                                                                                                          </MDBox>
          //                                                                                                     </form>
          //                                                                                                     <MDBox mt={4} mb={1}>
          //                                                                                                          {familyData.length > 0 && (
          //                                                                                                               <MDButton
          //                                                                                                                    key={familyData[0].id}
          //                                                                                                                    type="submit"
          //                                                                                                                    variant="gradient"
          //                                                                                                                    onClick={() => handleInviteSubmit(familyData[0].id)}
          //                                                                                                                    color="docuit"
          //                                                                                                                    fullWidth
          //                                                                                                                    disabled={!enabled}
          //                                                                                                               >
          //                                                                                                                    Invite

          //                                                                                                               </MDButton>
          //                                                                                                          )}
          //                                                                                                     </MDBox>

          //                                                                                                </div>
          //                                                                                           </div>
          //                                                                                      </div>
          //                                                                                 </div>
          //                                                                            )}
          //                                                                       </tr>

          //                                                                  ))}
          //                                                             </tbody>
          //                                                        </MDBox>
          //                                                   </Table>
          //                                              </div>

          //                                         </>

          //                                    </Card >

          //                               </MDBox >

          //                          </>
          //                     }
          //                </div >
          //           </DashboardLayout >
          //      );

          // }

          // export default Family;


          <DashboardLayout className='mainContent'>
               <DashboardNavbar />
               <Card>
                    {/* Flash Message */}
                    {flashMessage && (
                         <div>
                              <div className="overlay">
                                   <div className="popup">
                                        <div className="popup-content">
                                             <div className='flash-message'>
                                                  {flashMessage}
                                             </div>
                                        </div>
                                   </div>
                              </div>
                         </div>
                    )}
               </Card>

               {hlistFamily && (
                    // Family Management Section
                    <MDBox className="mdbboxfamily">
                         {/* Add Family Button */}
                         <div className="addbtn">
                              <h2>Family Management</h2>
                              <div>
                                   <Button variant="contained" onClick={handleAdd} className="btnfamilylist">Add + </Button>
                              </div>
                         </div>

                         <Card style={{ width: '100%' }}>
                              {/* Error Flash Message */}
                              <Card>
                                   {ErrorflashMessage && (
                                        <div>
                                             <div className="overlay" onClick={closePopup}>
                                                  <div className="popup">
                                                       <div className="popup-content">
                                                            <div className='Errorflash-message'>
                                                                 {ErrorflashMessage}
                                                            </div>
                                                       </div>
                                                  </div>
                                             </div>
                                        </div>
                                   )}
                              </Card>

                              <Card>
                                   {/* Add Family Popup */}
                                   {Addpop && (
                                        <div>
                                             <div className="overlay" onClick={closePopup}>
                                                  <div className="popup" onClick={preventClose}>
                                                       <div className="popup-content">
                                                            <div className='pop-input-div'>
                                                                 {/* ... */}
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

                              {/* Family Table */}
                              <TableContainer component={Paper} style={{ width: '100%' }} >
                                   <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table"
                                   >
                                        <TableHead style={{ display: 'contents' }}>
                                             {/* Table Headers */}
                                             <TableRow>
                                                  <TableCell align="justify">Family Name</TableCell>
                                                  <TableCell align="center">Created At</TableCell>
                                                  <TableCell align="center">Created By</TableCell>
                                                  {/* <TableCell align="center">View </TableCell> */}
                                                  <TableCell align="center">Actions</TableCell>
                                             </TableRow>
                                        </TableHead>

                                        {/* Table Body */}
                                        <TableBody style={{ color: 'black' }}>
                                             {/* Mapping through familyData to create rows */}
                                             {familyData.map((item, index) => (
                                                  <TableRow key={index}>
                                                       {/* ... */}

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
                                                                                     <Card>
                                                                                          {ErrorflashMessage && (
                                                                                               <div>
                                                                                                    <div className="overlay" onClick={closePopup}>
                                                                                                         <div className="popup">
                                                                                                              <div className="popup-content">
                                                                                                                   <div className='Errorflash-message'>
                                                                                                                        {ErrorflashMessage}
                                                                                                                   </div>
                                                                                                              </div>
                                                                                                         </div>
                                                                                                    </div>
                                                                                               </div>
                                                                                          )}
                                                                                     </Card>
                                                                                </div>
                                                                           </div>
                                                                      </div>
                                                                 </div>
                                                            )}
                                                            <div onClick={() => handleFamilyNameClick(item)} className='hover-click' >{item.name}</div>
                                                       </TableCell>
                                                       {/* <TableCell align='center'>{item.createdAt}</TableCell> */}
                                                       <TableCell align='center'>
                                                            {new Date(item.createdAt).toLocaleString('en-IN', {
                                                                 timeZone: 'Asia/Kolkata',
                                                                 hour12: false,
                                                            })}
                                                       </TableCell>
                                                       {console.log("itemi", item)}
                                                       <TableCell>{item.id}</TableCell>
                                                       <TableCell align="center" style={{ display: 'flex', justifyContent: 'center' }}>
                                                            {item.createdBy === UserData.id ? (
                                                                 <>
                                                                      <IconButton onClick={() => toggleEdit(item.id, item.name)}>
                                                                           <EditIcon style={{ color: 'green' }} />
                                                                      </IconButton>
                                                                      <IconButton onClick={() => handleDelete(item.id)}>
                                                                           <DeleteIcon style={{ color: 'red' }} />
                                                                      </IconButton>

                                                                 </>
                                                            ) : (
                                                                 <Icon onClick={() => handleFamilyNameClick(item)} style={{ cursor: 'pointer', color: 'rgb(26,115,232)', margin: '6px 0px' }}>visibility</Icon>
                                                            )}
                                                       </TableCell>



                                                  </TableRow>

                                             ))}
                                        </TableBody>
                                   </Table>
                              </TableContainer>
                         </Card>
                    </MDBox>
               )}

               {sFamilyMember && (
                    <>
                         <MDBox className="mdbboxfamily">
                              <div className="addbtn">
                                   <h2>Family Users Management</h2>
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
                                                                      {new Date(item.user.createdAt).toLocaleString('en-IN', {
                                                                           timeZone: 'Asia/Kolkata',
                                                                           hour12: false,
                                                                      })}
                                                                 </TableCell>
                                                                 <TableCell align='center'>
                                                                      {item.inviteStatus === 'Invited' ? (
                                                                           <div>
                                                                                <Button className="btn-delete"><Icon>add_reaction</Icon></Button>
                                                                           </div>
                                                                      ) : null}
                                                                      {UserData.id === familyItems.createdBy && item.inviteStatus === 'Accepted' ? (
                                                                           <div>
                                                                                <Button className="btn-delete" onClick={() => handleDelete(item.id)}><Icon>delete</Icon></Button>
                                                                           </div>
                                                                      ) : null}
                                                                 </TableCell>

                                                            </TableRow>
                                                       ))}
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
                                                                                               onClick={() => handleInviteSubmit(familyData[0].id)}
                                                                                               color="docuit"
                                                                                               fullWidth
                                                                                               disabled={!enabled}
                                                                                          >
                                                                                               Invite
                                                                                          </MDButton>
                                                                                     )}
                                                                                </MDBox>
                                                                           </div>
                                                                      </div>
                                                                 </div>
                                                            </div>
                                                       )}
                                                  </TableBody>
                                             </Table>
                                        </TableContainer>
                                   </div>
                              </Card>
                         </MDBox>
                    </>
               )}



          </DashboardLayout>
     );
}

export default Family;