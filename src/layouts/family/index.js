import React, { useState, useEffect } from 'react';
import { Button, Card, Icon, Input, Switch, Table } from "@mui/material";
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
import FamilyMembers from 'layouts/familyMembers';
import { listFamilyMembers } from 'services';
import { inviteUser } from 'services';
import { Label } from '@mui/icons-material';
import MDInput from 'components/MDInput';
import { useFormik } from "formik";
import MDButton from 'components/MDButton';
import * as yup from 'yup'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'


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
     const [phoneNumbersError, setphoneNumbersError] = useState('');
    

     const { familyName } = useParams();
     const navigate = useNavigate();
     // const history = useHistory();
     const enabled = phoneNumbers.length < 9;
     const isButtonDisabled = isEditing.trim() === '';


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
                         createdBy: familyItem.createdBy
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
                    navigate(`/family/${familyItem.name}`);
                    setsFamilyMember(true);
                    setHideListFamily(false);
                    setIsFamilyMembersPage(true);
               }
               if (data && data.response && Array.isArray(data.response.MemberList)) {
                    setfamilyMemberData(data.response.MemberList.map(member => member.user));
                    setFamilyMemberData(data.response.MemberList.map(member => member.user));
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
          console.log("handlesave callback", familyData.id, isEditing);
          try {
               const isNameExistsoverall = familyData.find(item => item.name === isEditing);

               if (isNameExistsoverall?.name === isEditing) {
                    setShowPopup(false);
                    setErrorFlashMessage('Family name is already registered');
                    setTimeout(() => {
                         setErrorFlashMessage('');
                    }, 1000);
                    return;
               }

               // const updatedData = familyData.map(item => {
               //      if (item.id === index.id) {
               //           return {
               //                ...item,
               //                name: isEditing
               //           };
               //      }
               //      return item;
               // });

               const constructObject = {
                    name: isEditing,
                    familyId: popupindex,
                    adminId: UserData.id
               };

               const { data } = await editFamily(constructObject);

               if (data?.status === 'SUCCESS') {
                    setFlashMessage(data.message);
                    setShowPopup(false);
                    setTimeout(() => {
                         setFlashMessage('');

                    }, 1000);
                    fetchData();
               }

          } catch (err) {
               console.error('Error saving family:', err);
               setErrorFlashMessage(err.response.error.message);
          }

     };


     const toggleEdit = (id, name) => {
          setpopupindex(id);
          setShowPopup(true);
          setIsEditing(name);
     };
     console.log(">>>>>>???????", popupindex);

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

               const isNameExistsoverall = familyData.find(item => item.name === Add);

               if (isNameExistsoverall?.name === Add) {
                    setAddPop(false);
                    setErrorFlashMessage('Family name is already registered');
                    setTimeout(() => {
                         setErrorFlashMessage('');
                    }, 1000);
                    return;
               }
               const val = { name: adminIdAdd, adminId: UserData.id }
               const { data } = await addFamily(val);
               if (data?.status === 'SUCCESS') {
                    const newFamily = data?.response?.familyDetails;
                    setAddPop(false);
                    setFamilyData(prevData => [...prevData, newFamily]);
                    setFlashMessage('Family Added successfully!');
                    setAdd('');
                    setTimeout(() => {
                         setFlashMessage('');
                    }, 1000);

               }

          } catch (error) {
               console.error('Error Save family:', error);
          }

     }

     const closePopup = () => {
          setAddPop(false);
          setShowPopup(false);
          setInvitePop(false);
     }
     const preventClose = (e) => {
          e.stopPropagation();
     }

     const handleChangeUserId = (value) => {
          setphoneNumbers(value);
     }

 
     return (
          <DashboardLayout className='mainContent'>
               <DashboardNavbar />
               <Card>
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


                    <MDBox className="mdbboxfamily">
                         <div className="addbtn">

                              <h2>Family Management</h2>
                              <div>
                                   <Button variant="contained" onClick={handleAdd} className="btnfamilylist">Add + </Button>
                              </div>
                         </div>

                         <Card style={{ width: '37%' }}>

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
                                   {Addpop && (
                                        <div>
                                             <div className="overlay" onClick={closePopup}>
                                                  <div className="popup" onClick={preventClose}>
                                                       <div className="popup-content">
                                                            <div className='pop-input-div'>
                                                                 <h3 style={{ padding: '28px' }}>Enter Family Name</h3>
                                                                 <div className='edit-Input'>
                                                                      <Icon fontSize="small">diversity_3</Icon>
                                                                      <Input type="text"
                                                                           placeholder="Enter...."
                                                                           value={Add}
                                                                           onChange={(e) => handleAddInput(e)}
                                                                           className='pop-up-input' />
                                                                 </div>
                                                            </div>
                                                            {/* for Add new family member */}
                                                            <div className='btn-pop'>
                                                                 <MDButton variant="contained" color="error" onClick={togglePopup} className='btn-pop'>Close</MDButton>
                                                                 {isButtonDisabled ? (
                                                                      <MDButton variant="contained" color="success" onClick={() => handleAddsave()}>Save</MDButton>

                                                                 ) : (
                                                                      <MDButton variant="contained" color="success" onClick={() => handleAddsave()}>Save</MDButton>
                                                                 )}
                                                            </div>
                                                       </div>
                                                  </div>
                                             </div>
                                        </div>
                                   )}


                              </Card>
                              <Table className='family-Table'>
                                   <MDBox>
                                        <tbody>
                                             <tr>
                                                  <th>Family Name</th>
                                                  <th>Action</th>
                                             </tr>
                                             {familyData.map((item, index) => (

                                                  <>
                                                       <tr key={index}>
                                                            <td>
                                                                 {showPopup && popupindex === item.id && (
                                                                      <div>
                                                                           <div className="overlay" onClick={closePopup}>
                                                                                <div className="popup" onClick={preventClose}>
                                                                                     <div className="popup-content">
                                                                                          <div className='pop-input-div'>
                                                                                               <h3 style={{ padding: '28px' }}>Change Family Name</h3>
                                                                                               <div className='edit-Input'>
                                                                                                    <Icon fontSize="small">diversity_3</Icon>
                                                                                                    <Input
                                                                                                         type="text"
                                                                                                         value={isEditing}
                                                                                                         onChange={(e) => handleEditInput(index, e.target.value)}
                                                                                                         className='pop-up-input'
                                                                                                    />
                                                                                               </div>
                                                                                          </div>
                                                                                          {/* for Edit family member */}
                                                                                          <div className='btn-pop'>
                                                                                               <MDButton variant="contained" color="error" onClick={togglePopup}>Close</MDButton>
                                                                                               {isButtonDisabled ? (
                                                                                                    <MDButton variant="contained" disabled={isButtonDisabled} color="success" onClick={() => { console.log(item); handleSave(item); }} >Save</MDButton>


                                                                                               ) : (
                                                                                                    <MDButton variant="contained" color="success" onClick={() => { console.log(item); handleSave(item); }} > Save </MDButton>
                                                                                               )}
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
                                                                 <div onClick={() => handleFamilyNameClick(item)} className='hover-click'>{item.name}</div>
                                                            </td>

                                                            <td>
                                                                 <Button onClick={() => toggleEdit(item.id, item.name)}><Icon>edit</Icon></Button>
                                                                 <Button className="btn-delete" onClick={() => handleDelete(item.id)}><Icon>delete</Icon></Button>
                                                            </td>
                                                       </tr >
                                                  </>
                                             ))}
                                        </tbody>

                                   </MDBox>
                              </Table>
                         </Card>
                    </MDBox>
               )
               }
               <div>
                    {sFamilyMember &&
                         <>
                              <MDBox className="mdbboxfamily">
                                   <div className="addbtn">
                                        <h2>Family Users Management</h2>
                                        <div>
                                             {/* <Button className="btnNotofication" onClick={handleNotofication}><Icon size="large"><h3>notifications</h3></Icon> </Button> */}
                                             <Button variant="contained" className="btnfamilylist" onClick={handleInvite}>Invite + </Button>
                                        </div>
                                   </div>
                                   <Card style={{ width: '34%' }}>
                                        <>
                                             <div>
                                                  <Table className='family-Table'>
                                                       <MDBox>
                                                            <thead>
                                                                 <tr>
                                                                      <th>Family Member</th>
                                                                      <th>Action</th>
                                                                 </tr>
                                                            </thead>
                                                            <tbody>

                                                                 {Array.isArray(familyMemberData) && familyMemberData.map((item, index) => (
                                                                      <tr key={index}>
                                                                           <td style={{ display: item.name === UserData.name ? 'none' : 'block' }}>
                                                                                <div>{item.name}</div>
                                                                           </td>

                                                                           <td>
                                                                                <div style={{ display: item.name === UserData.name ? 'none' : 'block' }}>
                                                                                     <div style={{ display: UserData.id === familyData[0].createdBy ? 'block' : 'none' }}>
                                                                                          <Button className="btn-delete"><Icon>delete</Icon></Button>
                                                                                     </div>
                                                                                </div>
                                                                           </td>
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
                                                                      </tr>

                                                                 ))}
                                                            </tbody>
                                                       </MDBox>
                                                  </Table>
                                             </div>

                                        </>

                                   </Card >

                              </MDBox >

                         </>
                    }
               </div >
          </DashboardLayout >
     );

}

export default Family;