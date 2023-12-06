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

     const { UserData, setFamilyMemberData, FamilyMemberData } = useAuth();
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

     useEffect(() => {
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
                         localStorage.setItem('docuItFamilyData', JSON.stringify(extractedData));
                    }
               } catch (err) {
                    console.error("API call failed:", err);
               }
          };

          const storedFamilyData = localStorage.getItem('docuItFamilyData');
          if (storedFamilyData) {
               try {
                    const parsedFamilyData = JSON.parse(storedFamilyData);
                    setFamilyData(parsedFamilyData);
               } catch (error) {
                    console.error('Error parsing JSON:', error);
               }
          }

          const localeStorageMember = localStorage.getItem('docuItMemberDetails');
          if (localeStorageMember && !isFamilyMembersPage) {
               try {
                    const MemberDetails = JSON.parse(localeStorageMember);
                    setFamilyMemberData(MemberDetails);
               } catch (error) {
                    console.error('Error parsing JSON:', error);
               }
          }


          fetchData();
     }, [UserData, setFamilyData, setFamilyMemberData, sFamilyMember]);

     useEffect(() => {
          // Check if the family name is present in the URL
          if (familyName) {
               // Set the family name in localStorage
               localStorage.setItem('docuItFamilyData', familyData);
               setIsFamilyMembersPage(true);
               setsFamilyMember(true);
               setHideListFamily(false);
               handleFamilyNameClick();
          }
     }, [familyName]);

     const handleFamilyNameClick = async (familyItem) => {
          navigate(`/family/${familyItem.name}`);
          setsFamilyMember(true);
          setHideListFamily(false);
          setIsFamilyMembersPage(true);

          try {
               const familId = familyItem.id;
               const { data } = await listFamilyMembers(familId);
               console.log('>>>>>>>>>>>>>', data);
               if (data && data.response && Array.isArray(data.response.MemberList)) {
                    setfamilyMemberData(data.response.MemberList.map(member => member.user));
                    setFamilyMemberData(data.response.MemberList.map(member => member.user));
                    localStorage.setItem('docuItMemberDetails', JSON.stringify(data?.response?.MemberList?.user));
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

     const handleInviteUser = async (index) => {
          console.log('cliked-inviteUser')
     }

     const handleSave = async (index) => {
          try {
               const isNameExists = familyData.find(item => item.id === index);
               if (isNameExists?.name === isEditing) {
                    setErrorFlashMessage('Family name is already registered');
                    setShowPopup(false);
                    setTimeout(() => {
                         setErrorFlashMessage('');
                    }, 1000);
                    return;
               }

               const updatedData = familyData.map(item => {
                    if (item.id === index) {
                         return {
                              ...item,
                              name: isEditing
                         };
                    }
                    return item;
               });

               const constructObject = {
                    name: isEditing,
                    familyId: isNameExists.id,
                    adminId: isNameExists.createdBy
               };

               const { data } = await editFamily(constructObject);
               console.log('dat', data?.name);
               if (data?.status === 'SUCCESS') {
                    setFamilyData(updatedData);
                    setFlashMessage('Family saved successfully!');
                    setShowPopup(false);
                    setTimeout(() => {
                         setFlashMessage('');

                    }, 1000);
               }
          } catch (err) {
               console.error('Error saving family:', err);
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
          // const phoneNumber = value.phoneNumbers;
          setphoneNumbers([value]);
     };

     const handleInviteSubmit = async (familyId) => {
          // const phonenumberpattern = /(7|8|9)\d{9}|[+]91\d{10}|[+]1\d{10}/;
          // if (phoneNumbers === '') {
          //      setphoneNumbersError('* Docult UserId is required');
          // } else if (!phonenumberpattern.test(phoneNumbers)) {
          //     
          //      setphoneNumbersError('Invalid Userid format');
          // } else {
          //      setphoneNumbersError('');
          // }
          try {

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
               const val = { name: adminIdAdd, adminId: UserData.id }
               const { data } = await addFamily(val);
               if (data?.status === 'SUCCESS') {
                    const newFamily = data?.response?.familyDetails;
                    setFamilyData(prevData => [...prevData, newFamily]);
                    setFlashMessage('Family Added successfully!');
                    setAddPop(false);
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
     const handleNotofication = () => {
          console.log('handleNotofication clicked')
     }
     console.log('familyMemberData????????????????', FamilyMemberData);
     console.log('UserData>>>>>>>>>>>', UserData);
     console.log('familyData--------------', familyData);

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

                         <Card>

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
                                                            <div className='flash-message'>
                                                                 <Input type="text"
                                                                      placeholder="Enter...."
                                                                      value={Add}
                                                                      onChange={(e) => handleAddInput(e)}
                                                                      className='pop-up-input' />

                                                            </div>
                                                            <Button variant="contained" color="error" onClick={togglePopup} className='btn-pop'>Close</Button>
                                                            <Button variant="contained" color="success" onClick={() => handleAddsave()}>Save</Button>
                                                       </div>
                                                  </div>
                                             </div>
                                        </div>
                                   )}


                              </Card>
                              <Table>

                                   <MDBox>

                                        <thead>
                                             <tr>
                                                  <th>Family Name</th>
                                                  <th>Action</th>
                                             </tr>
                                        </thead>
                                        <tbody>
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
                                                                                               <Input
                                                                                                    type="text"
                                                                                                    value={isEditing}
                                                                                                    onChange={(e) => handleEditInput(index, e.target.value)}
                                                                                                    className='pop-up-input'
                                                                                               />
                                                                                          </div>

                                                                                          <Button variant="contained" color="error" onClick={togglePopup} className='btn-pop'>Close</Button>
                                                                                          <Button variant="contained" color="success" onClick={() => handleSave(item.id)}>Save</Button>

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
                                                       </tr>
                                                  </>
                                             ))}
                                        </tbody>

                                   </MDBox>
                              </Table>
                         </Card>
                    </MDBox>
               )}
               <div>
                    {sFamilyMember &&
                         <>
                              <MDBox className="mdbboxfamily">
                                   <div className="addbtn">
                                        <h2>Family Users Management</h2>
                                        <div>
                                             <Button className="btnNotofication" onClick={handleNotofication}><Icon size="large"><h3>notifications</h3></Icon> </Button>
                                             <Button variant="contained" className="btnfamilylist" onClick={handleInvite}>Invite + </Button>
                                        </div>
                                   </div>
                                   <Card>
                                        <>
                                             <div>
                                                  <Table>
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
                                                                                                    <MDBox mb={2}>
                                                                                                         <h3>Invite User</h3>
                                                                                                         <Input
                                                                                                              name="phoneNumbers"
                                                                                                              label="phoneNumbers"
                                                                                                              country={'in'}
                                                                                                              fullWidth
                                                                                                              onChange={(e) => handleInviteChange(e.target.value)}
                                                                                                              value={phoneNumbers}
                                                                                                         />
                                                                                                    </MDBox>
                                                                                                    <MDBox mt={4} mb={1}>
                                                                                                         {familyData.map((item) => (
                                                                                                              <MDButton
                                                                                                                   type="submit"
                                                                                                                   variant="gradient"
                                                                                                                   onClick={() => handleInviteSubmit(item.id)}
                                                                                                                   color="docuit"
                                                                                                                   fullWidth
                                                                                                              >
                                                                                                                   Invite
                                                                                                              </MDButton>
                                                                                                         ))}

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

export default Family;
