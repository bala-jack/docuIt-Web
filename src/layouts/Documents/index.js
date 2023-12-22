import { useAuth } from "context/AuthContext";
import React, { useEffect } from "react";
import { UsercategoryList } from "services";
import { Box, Button, Card, Dialog, DialogActions, DialogContent, DialogTitle, Fade, FormControl, FormControlLabel, FormLabel, Icon, Input, Modal, Paper, Popper, RadioGroup, Tooltip, Typography } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useState } from "react";
import { Grid } from "react-loader-spinner";
import Radio from '@mui/material/Radio';
import Moment from "react-moment";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// import styled from "@emotion/styled";
import { saveDocuments } from "services";
import { uploadDocuments } from "services";
import { pdfjs } from 'react-pdf';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import Popover from '@mui/material/Popover';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
import { deleteDocument } from "services";
import { Link, useLocation } from "react-router-dom";
import { findUser } from "services";
import { updateDocument } from "services";
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import { getFamilyWithMembers } from "services";
import Checkbox from '@mui/material/Checkbox';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';


// import { useLocation, NavLink, useNavigate } from "react-router-dom";

// const isButtonDisabled = isEditing.trim() === '';

// const VisuallyHiddenInput = styled('input')({
//      clip: 'rect(0 0 0 0)',
//      clipPath: 'inset(50%)',
//      height: 1,
//      overflow: 'hidden',
//      position: 'absolute',
//      bottom: 0,
//      left: 0,
//      whiteSpace: 'nowrap',
//      width: 1,
// });

const Accordion = styled((props) => (
     <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
     border: `1px solid ${theme.palette.divider}`,
     '&:not(:last-child)': {
          borderBottom: 0,
     },
     '&:before': {
          display: 'none',
     },
}));

const AccordionSummary = styled((props) => (
     <MuiAccordionSummary
          expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
          {...props}
     />
))(({ theme }) => ({
     backgroundColor:
          theme.palette.mode === 'dark'
               ? 'rgba(255, 255, 255, .05)'
               : 'rgba(0, 0, 0, .03)',
     flexDirection: 'row-reverse',
     '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
          transform: 'rotate(90deg)',
     },
     '& .MuiAccordionSummary-content': {
          marginLeft: theme.spacing(1),
     },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
     padding: theme.spacing(2),
     borderTop: '1px solid rgba(0, 0, 0, .125)',
}));


function Documents() {

     const { UserData, isAuthenticated, ListFamily } = useAuth();
     const [flashMessage, setFlashMessage] = useState('');
     const [isLoading, setIsLoading] = useState(false);
     const [LifeData, setLifeData] = useState([]);
     const [categoryList, setCategoryList] = useState([]);
     const [selectFile, setSelectedFile] = useState(null);
     const [targetCategory, setTargetCategory] = useState("");
     const [tooltipOpen, setTooltipOpen] = useState(false);
     const [openMove, setopenMove] = useState(false);
     const [openShare, setopenShare] = useState(false);
     const [catListdata, setcatListdata] = useState([]);
     const [isExpanded, setIsExpanded] = useState(false);
     const [expanded, setExpanded] = React.useState`<String | false>('panel1')`;
     const [selectedFile, setmoveSelect] = useState(false);
     const [FamilyListwithMembers, setFamilyListWithMembers] = useState([]);
     const [FamilyMembers, setFamilyMembers] = useState([]);
     const [checked, setChecked] = React.useState([true, false]);
     const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
     const [deleteDocumentId, setDeleteDocumentId] = useState([])
     const location = useLocation();
     const category = location.state?.category;
     const currentCategory = category.categoryId;
     console.log('props', location);
     // const [uploadedFiles, setUploadedFiles] = useState([]);
     const ALLOWED_FILE_TYPES = ["application/pdf"];
     const userId = UserData?.id;
     pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`;

     const style = {
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          transition: 'transform 0.3s cubic-bezier(0.2, 1, 0.0, 0.0)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 20,
          borderRadius: 5,
          border: 'none',
          p: 4,
     };

     useEffect(() => {
          fetchData();
     }, [userId, category])

     const fetchData = async () => {
          try {
               const categoryId = category.categoryId;
               console.log("categoryIds >>>>", category);
               const values = { userId, categoryId };

               const { data } = await UsercategoryList(values);
               console.log("data Usercat : ", data)
               if (data.status === 'SUCCESS') {
                    setLifeData(data?.response?.documentDetailsList);
               }
          }
          catch (err) {
               console.error("API call failed:", err);
          }
     };
     const handleFileChange = (event) => {
          event.preventDefault(event);
          console.log('handleFileChange Called')
          console.log("event.target::::::::::", event.target.file)
          const files = event.target.files[0];
          if (files) {
               console.log("event.target12::::::::::", files)
               if (ALLOWED_FILE_TYPES.includes(files.type)) {
                    console.log("event.target12235::::::::::", files)
                    console.log('event.target.files[0]>>>>>>', files)
                    handleUploadButtonClick(files);

               } else {
                    console.error("Invalid selectFile type. Please select a PDF or PNG selectFile.");
               }
               // setSelectedFile(files);
         
               console.log("handleupload", files)
          }
     }
     console.log("selectFile::::::::::", selectFile)

     const handleUploadButtonClick = async (files) => {
          console.log("selectFile???????", selectFile);
          // if (!selectFile) {
          //      console.error('Please select a selectFile.');
          //      console.log("If Called???????");
          //      return;
          // }
          // else {
          console.log("Else Called???????");
          try {
               const file = new FormData();
               file.append('file', files);
               console.log('file>>>>>>>>', file);
               setSelectedFile(null);
               setIsLoading(true);
               const { data } = await uploadDocuments(userId, file);
               console.log('uploadResponse>>>>>>>>', data);

               if (data) {
                    try {
                         const parmValues = {
                              documentDetails: [
                                   {
                                        documentName: data.fileName,
                                        documentUrl: data.documentUrl,
                                        documentSize: data.size,
                                        documentType: data.fileType,
                                   }
                              ],
                              categoryId: category.categoryId,
                              uploadedBy: userId,
                         }

                         const saveResponse = await saveDocuments(parmValues);
                         console.log('Save response:', saveResponse);
                         if (saveResponse.status === 200 && saveResponse?.data?.response) {
                              const responseData = saveResponse?.data?.response
                              const {
                                   id,
                                   documentName,
                                   documentSize,
                                   documentType,
                                   url
                              } = responseData[0]

                              setIsLoading(false);
                              setFlashMessage('Document saved successfully');
                              // const newDocument = saveResponse.data.response[0];
                              // setUploadedFiles([...uploadedFiles, newDocument]);
                              setTimeout(() => {
                                   setFlashMessage('');
                              }, 1000);
                              const documentDetails = {
                                   documentId : id,
                                   documentName,
                                   documentSize,
                                   documentType,
                                   url
                              }
                              setLifeData(prevLifeData => [...prevLifeData, documentDetails]);
                              console.log("uploadData", [...LifeData, documentDetails]);
                              setSelectedFile(null);

                              fetchData();
                         }
                    } catch (err) {
                         console.error("API call failed:", err);
                    }
               }
               console.log("uploadResponse>>>>>>", data);
          } catch (err) {
               console.error('Error Upload Docs:', err);
               setIsLoading(false);
               setSelectedFile(null);
          }
     }

     const handleClose = () => {
          setopenMove(false);
          setopenShare(false);
     }

     const handleMove = async (item) => {
          setIsLoading(true);
          if (!item || !targetCategory) {
               console.error("Please select a document and a target category.");
               return;
          }
          else {
               try {
                    const userId = UserData?.id;
                    const params = {
                         familyId: [
                              // item.familyId
                         ],
                         documentId: item.documentId,
                         categoryId: targetCategory,
                         revokeAccess: [

                         ],
                         provideAccess: [

                         ],
                         documentName: item.documentName,
                         updatedBy: userId
                    }

                    const { data } = await updateDocument(params);
                    console.log('updateDocument"""""":', data);
                    if (data.status === 'SUCCESS') {
                         setTooltipOpen(false);
                         setopenMove(false);
                         setTimeout(() => {
                              setIsLoading(false);
                         }, 1000);
                         fetchData();
                    }
               } catch (err) {
                    console.error('Error Upload Docs:', err);
                    setIsLoading(false);
               }
          }
     }

     const handleMovePop = async (item) => {
          console.log('item>>>>>>>>>sas', item.documentId)
          setopenMove(true);
          setmoveSelect(item.documentId);
          setTargetCategory("");
          setTooltipOpen(false);
          try {
               const userId = UserData?.id;
               const { data } = await findUser(userId);
               if (data?.response?.categoryDetails) {
                    console.log('findUserdata', data)
                    const extractedData = data.response.categoryDetails.map((categoryDetails) => ({
                         categoryId: categoryDetails.categoryId,
                         categoryName: categoryDetails.categoryName,
                         fileCount: categoryDetails.fileCount
                    }));
                    setcatListdata(extractedData);
               }
          } catch (err) {
               console.error("API call failed:", err);
          }
     }
     console.log("LifeData::", LifeData);

     const handleDelete = async (documentId) => {
          try {
               console.log("Item>>>", documentId);
               const DocumentId = documentId.documentId
               const { data } = await deleteDocument(DocumentId);
               if (data) {
                    setTooltipOpen(false);
                    const lifedata = LifeData.filter((card) => card.documentId !== DocumentId)
                    setLifeData(lifedata)
                    console.log("lifes", lifedata);
               }
          } catch (err) {
               console.error('Error Upload Docs:', err);
          } finally {
               setDeleteDialogOpen(false);
               setDeleteDocumentId(null);
          }
     }

     const handleViewPdf = (docDetails) => {
          const pdfUrl = docDetails.documentUrl;
          window.open(pdfUrl, '_blank');
     }

     const handleDownloadPDF = (docDetails) => {
          const PDFurl = docDetails.documentUrl;
          console.log('PDFURL', PDFurl);
          const documentName = docDetails.documentName;
          fetch('https://cors-anywhere.herokuapp.com/' + PDFurl, {
               method: 'GET',
               headers: {
                    'Content-Type': 'application/pdf',
               },
          })
               .then(response => response.blob())
               .then(blob => {
                    const url = window.URL.createObjectURL(new Blob([blob]));

                    const link = document.createElement('a');
                    link.href = url;
                    link.download = documentName;

                    document.body.appendChild(link);

                    link.click();

                    link.parentNode.removeChild(link);
               });
     };

     const toggleExpansion = (categoryId) => {
          console.log('catIDExapmnd', categoryId.documentId)
          setIsExpanded(!isExpanded);
     };

     const truncateText = (text, maxLength) => {
          if (text.length <= maxLength) {
               return text;
          }
          // If the text is longer than maxLength, truncate and add ellipsis
          return `${text.slice(0, maxLength)}...`;
     };
     console.log('ListFamily???', ListFamily);

     const handleShare = async () => {
          setopenShare(true);
          setTooltipOpen(false);
          try {
               const { data } = await getFamilyWithMembers(userId);
               console.log('data??', data)
               if (data.status === 'SUCCESS') {
                    const getFamilyWithMembers = data.response.familyListWithMembers.map((familyListWithMembers) => ({
                         id: familyListWithMembers.id,
                         name: familyListWithMembers.name,
                         membersList: familyListWithMembers.membersList.map((member) => ({
                              id: member.id,
                              inviteStatus: member.inviteStatus,
                              status: member.status,
                              user: {
                                   id: member.user.id,
                                   name: member.user.name,
                                   phone: member.user.phone
                              }
                         }))
                    }));
                    setFamilyListWithMembers(getFamilyWithMembers);

                    const allFamilyMembers = data.response.familyListWithMembers.reduce((members, family) => {
                         return members.concat(family.membersList);
                    }, []);
                    const familyMembers = allFamilyMembers.map((member) => ({
                         id: member.id,
                         name: member.user.name,
                         phone: member.user.phone
                    }));
                    setFamilyMembers(familyMembers);
               }
          } catch (error) {
               console.error('Error while ListFamilyMembers', error);
          }
     }

     const handleChange = (index) => (event, newExpanded) => {
          setExpanded(newExpanded ? index : false);
     };

     const openDeleteDialog = (documentId) => {
          setDeleteDocumentId(documentId);
          setDeleteDialogOpen(true);
     };

     const closeDeleteDialog = () => {
          setDeleteDialogOpen(false);
          setDeleteDocumentId(null);
     };

     console.log('FamilyListwithMembers>>>', FamilyListwithMembers)
     console.log('FamilyMembers>>>', FamilyMembers)

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

               <div className="addbtn card-head">
                    {console.log("category.categoryNamee>>>>", category.categoryName)}

                    <h2>{category.categoryName}</h2>
                    <div>
                         <Button className="btnfamilylist" component="label" variant="contained" startIcon={<CloudUploadIcon />} onChange={handleFileChange}>
                              Upload File
                              <Input style={{ display: 'none' }} type="file" />
                         </Button>
                    </div>
               </div>

               {LifeData.length === 0 ? (
                    <h2>No Data Found</h2>
               ) : (
                    <>
                         <Modal
                              open={openShare}
                              onClose={handleClose}
                              aria-labelledby="modal-modal-title"
                              aria-describedby="modal-modal-description"
                         >
                              <Box sx={style}>
                                   <FormControl>
                                        <FormLabel id="demo-radio-buttons-group-label">Share Document</FormLabel>
                                        <div style={{ alignItems: 'center' }}>
                                             {FamilyListwithMembers.map((item, familyIndex) => (
                                                  <div key={familyIndex}>
                                                       <Accordion expanded={expanded === familyIndex} onChange={handleChange(familyIndex)}>
                                                            <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                                                                 <Typography>
                                                                      {item.name}
                                                                 </Typography>
                                                                 <Checkbox
                                                                      type="checkbox"
                                                                 // value={category.categoryId}
                                                                 // checked={targetCategory === category.categoryId}
                                                                 // onChange={() => setTargetCategory(category.categoryId)}
                                                                 // style={{ display: currentCategory === category.categoryId ? 'none' : 'flex' }}
                                                                 />
                                                            </AccordionSummary>
                                                            <AccordionDetails>
                                                                 {FamilyMembers.map((member, memberIndex) => {
                                                                      if (member.id === item.id) {
                                                                           return (
                                                                                <Typography key={memberIndex} sx={{ display: 'flex', justifyContent: 'center' }}>
                                                                                     <Checkbox
                                                                                          type="checkbox"
                                                                                          style={{ display: member.name === UserData.name ? 'none' : 'flex' }}
                                                                                     />
                                                                                     <div style={{ display: member.name === UserData.name ? 'none' : 'flex' }}>{member.name}</div>
                                                                                </Typography>
                                                                           );
                                                                      }
                                                                      return null; // Render nothing if the member is not part of the current family
                                                                 })}
                                                            </AccordionDetails>
                                                       </Accordion>
                                                  </div>
                                             ))}
                                        </div>

                                        <Button variant="contained" color='inherit'>Share</Button>
                                   </FormControl>
                              </Box>
                         </Modal>
                         {LifeData.length > 0 && (
                              <Box>
                                   <Modal
                                        open={openMove}
                                        onClose={handleClose}
                                        aria-labelledby="modal-modal-title"
                                        aria-describedby="modal-modal-description"
                                   >
                                        <Box sx={style}>
                                             {LifeData.map((item, index) => (
                                                  <>
                                                       {item.documentId === selectedFile && (
                                                            <div key={index}>
                                                                 <div>{item.documentName}</div>
                                                                 {catListdata.map((category) => (
                                                                      <div style={{ display: 'flex', alignItems: 'center' }} key={category.categoryId}>
                                                                           <Radio
                                                                                type="radio"
                                                                                value={category.categoryId}
                                                                                checked={targetCategory === category.categoryId}
                                                                                onChange={() => setTargetCategory(category.categoryId)}
                                                                                style={{ display: currentCategory === category.categoryId ? 'none' : 'flex' }}
                                                                           />
                                                                           <p style={{ display: currentCategory === category.categoryId ? 'none' : 'flex' }}>{category.categoryName}</p>
                                                                      </div>
                                                                 ))}
                                                                 {console.log('target?????', targetCategory)}
                                                                 <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                      <Button variant="contained" onClick={() => handleMove(item)}>
                                                                           Move
                                                                      </Button>
                                                                 </div>
                                                            </div>
                                                       )
                                                       }
                                                  </>
                                             ))}

                                        </Box>
                                   </Modal>
                              </Box>
                         )}

                         {
                              isLoading && (
                                   <Grid></Grid>
                              )
                         }
                         <TableContainer component={Paper}>
                              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                   <TableHead style={{ display: 'contents' }}>
                                        <TableRow>
                                             <TableCell align="center">Name</TableCell>
                                             <TableCell align="center">Size</TableCell>
                                             <TableCell align="center">Created at</TableCell>
                                             <TableCell align="center">Owner</TableCell>
                                             <TableCell align="center">Share</TableCell>
                                             <TableCell align="center">View Document</TableCell>
                                             <TableCell align="center">Actions</TableCell>
                                        </TableRow>
                                   </TableHead>
                                   <TableBody style={{ color: 'black' }}>

                                        {LifeData.map((item, index) => (
                                             <TableRow key={index}>
                                                  <TableCell align="centerr">{item.documentName}</TableCell>
                                                  <TableCell align="center">{item.documentSize >= 1024 * 1024 ? `${(item.documentSize / (1024 * 1024)).toFixed(1)}MB` : item.documentSize >= 1024 ? `${(item.documentSize / 1024).toFixed(1)}KB` : `${item.documentSize} bytes`}</TableCell>
                                                  <TableCell align="center">{item.updatedDate}</TableCell>
                                                  <TableCell align="center">{item.uploadedByName}</TableCell>
                                                  <TableCell align="center">
                                                       {item.sharedBy === null ? (
                                                            <p>No</p>
                                                       ) : (
                                                            <React.Fragment>
                                                                 <p>Yes</p>
                                                            </React.Fragment>
                                                       )}</TableCell>
                                                  <TableCell align="center"> <Icon sx={{ cursor: 'pointer' }} onClick={() => { handleViewPdf(item); setTooltipOpen(true); }}>visibility</Icon></TableCell>
                                                  <TableCell align="center">
                                                       <Box sx={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
                                                            <PopupState variant="popover" popupId="demo-popup-popover">
                                                                 {(popupState) => (
                                                                      <div>
                                                                           <Icon fontSize="small" sx={{ cursor: 'pointer' }} {...bindTrigger(popupState)} item={item}>menu_open</Icon>
                                                                           <Popover
                                                                                {...bindPopover(popupState)}
                                                                                anchorOrigin={{
                                                                                     vertical: 'bottom',
                                                                                     horizontal: 'center',
                                                                                }}
                                                                                transformOrigin={{
                                                                                     vertical: 'top',
                                                                                     horizontal: 'center',
                                                                                }}
                                                                           >
                                                                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                                                                     {userId === item.uploadedBy && (
                                                                                          <Tooltip title="Move Document" sx={{ m: 1 }} placement="top">
                                                                                               <Icon onClick={() => { handleMovePop(item); setTooltipOpen(true); }}>drive_file_move</Icon>
                                                                                          </Tooltip>
                                                                                     )}
                                                                                     {userId === item.uploadedBy && (
                                                                                          <Tooltip title="Share Document" sx={{ m: 1 }} placement="top">
                                                                                               <Icon onClick={handleShare}>share</Icon>
                                                                                          </Tooltip>
                                                                                     )}
                                                                                     <Tooltip title="View Document" sx={{ m: 1 }} placement="top">
                                                                                          <Icon onClick={() => { handleViewPdf(item); setTooltipOpen(true); }}>visibility</Icon>
                                                                                     </Tooltip>
                                                                                     <Tooltip title="Download Document" sx={{ m: 1 }} placement="top">
                                                                                          <Link href={item.documentUrl}
                                                                                               download={item.documentName}
                                                                                               target="_blank"
                                                                                               style={{ color: '#212121', display: 'flex', justifyContent: 'center', textDecoration: 'none' }}
                                                                                               rel="noreferrer"> <Icon onClick={(e) => { e.preventDefault(); handleDownloadPDF(item); setTooltipOpen(true); }}>download_for_offline</Icon>
                                                                                          </Link>
                                                                                     </Tooltip>
                                                                                     {userId === item.uploadedBy && (
                                                                                          <Tooltip title="Delete Document" sx={{ m: 1 }} placement="top">
                                                                                               <Icon onClick={() => openDeleteDialog(item)}>delete</Icon>
                                                                                          </Tooltip>
                                                                                     )}
                                                                                     <Dialog open={isDeleteDialogOpen} onClose={closeDeleteDialog}>
                                                                                          <DialogTitle>Confirm Delete</DialogTitle>
                                                                                          <DialogContent>
                                                                                               Are you sure you want to delete this document?
                                                                                          </DialogContent>
                                                                                          <DialogActions>
                                                                                               <Button onClick={closeDeleteDialog}>Cancel</Button>
                                                                                               <Button onClick={() => { handleDelete(deleteDocumentId); setTooltipOpen(true); }}>Delete</Button>
                                                                                          </DialogActions>
                                                                                     </Dialog>
                                                                                </Box>
                                                                           </Popover>
                                                                      </div>
                                                                 )}
                                                            </PopupState>
                                                       </Box>
                                                  </TableCell>
                                             </TableRow>
                                        ))}
                                   </TableBody>
                              </Table>
                         </TableContainer>
                    </>
               )}
          </DashboardLayout >
     )
}
export default Documents;