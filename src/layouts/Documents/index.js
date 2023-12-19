import { useAuth } from "context/AuthContext";
import { useEffect } from "react";
import { UsercategoryList } from "services";
import { Box, Button, Card, Fade, FormControl, FormControlLabel, FormLabel, Icon, Modal, Paper, Popper, RadioGroup, Tooltip, Typography } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useState } from "react";
import { Grid } from "react-loader-spinner";
import Radio from '@mui/material/Radio';
import Moment from "react-moment";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import styled from "@emotion/styled";
import { saveDocuments } from "services";
import { uploadDocuments } from "services";
import { pdfjs } from 'react-pdf';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import Popover from '@mui/material/Popover';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
import { deleteDocument } from "services";
import { Link } from "react-router-dom";
import { findUser } from "services";
import { updateDocument } from "services";

const VisuallyHiddenInput = styled('input')({
     clip: 'rect(0 0 0 0)',
     clipPath: 'inset(50%)',
     height: 1,
     overflow: 'hidden',
     position: 'absolute',
     bottom: 0,
     left: 0,
     whiteSpace: 'nowrap',
     width: 1,
});

const ALLOWED_FILE_TYPES = ["application/pdf", "image/png"];

function Documents() {
     const { category, UserData, isAuthenticated, ListFamily } = useAuth();
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

     // const [uploadedFiles, setUploadedFiles] = useState([]);
     const userId = UserData?.id;
     pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`;

     const style = {
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
     };

     useEffect(() => {
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
          fetchData();
     }, [userId, category])

     const handleFileChange = (event) => {
          console.log("event.target::::::::::", event.target.file)
          const files = event.target.files[0];
          if (files) {
               console.log("event.target12::::::::::", files)
               if (ALLOWED_FILE_TYPES.includes(files.type)) {
                    console.log("event.target12235::::::::::", files)
                    console.log('event.target.files[0]>>>>>>', files)

               } else {
                    console.error("Invalid selectFile type. Please select a PDF or PNG selectFile.");
               }
               // setSelectedFile(files);
               handleUploadButtonClick(files);
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
               const { data } = await uploadDocuments(userId, file);
               console.log('uploadResponse>>>>>>>>', data);

               if (data) {
                    setSelectedFile(null);
                    setIsLoading(true);

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
                         if (saveResponse.status === 200) {
                              setIsLoading(false);
                              setFlashMessage('Document saved successfully');
                              // const newDocument = saveResponse.data.response[0];
                              // setUploadedFiles([...uploadedFiles, newDocument]);
                              setTimeout(() => {
                                   setFlashMessage('');
                              }, 1000);
                         }
                    } catch (err) {
                         console.error("API call failed:", err);
                    }
               }
               console.log("uploadResponse>>>>>>", data);
          } catch (err) {
               console.error('Error Upload Docs:', err);
          }
          // }

     }

     const handleClose = () => {
          setopenMove(false);
          setopenShare(false);
     }

     const handleMove = async (item) => {
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
                         // window.location.reload();
                    }
               } catch (err) {
                    console.error('Error Upload Docs:', err);
               }
          }
     }

     const handleMovePop = async (document) => {
          // setSelectedFile(document);
          // setTargetCategory("");
          setopenMove(true);
          setTooltipOpen(false);
          try {
               const userId = UserData?.id;
               const { data } = await findUser(userId);
               console.log('dataFind User', data)
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
               const { data } = await deleteDocument(documentId.documentId);
               if (data) {
                    setTooltipOpen(false);
                    const indexToRemove = LifeData.findIndex(card => card.id === documentId);
                    if (indexToRemove === -1) {
                         const updatedCards = [...LifeData];
                         updatedCards.splice(indexToRemove, 1);
                         setLifeData(updatedCards);
                    }
               }
          } catch (err) {
               console.error('Error Upload Docs:', err);
          }
     }

     const handleViewPdf = (docDetails) => {
          const pdfUrl = docDetails.documentUrl;
          window.open(pdfUrl, '_blank');
     }

     const handleDownloadPDF = (docDetails) => {
          const PDFurl = docDetails.documentUrl;
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
     const handleShare = () => {

          setopenShare(true);
          setTooltipOpen(false);

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

               <div className="addbtn card-head">
                    {console.log("category.categoryNamee>>>>", category.categoryName)}

                    <h2>{category.categoryName}</h2>
                    <div>
                         <Button className="btnfamilylist" component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                              Upload File
                              <VisuallyHiddenInput type="file" onClick={handleFileChange} />
                         </Button>
                    </div>
               </div>
               {LifeData.length === 0 ? (
                    <h2>No Data Found</h2>
               ) : (
                    <>
                         {isLoading && (
                              <Grid></Grid>
                         )}

                         <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                              {LifeData.map((item, index) => (
                                   <>
                                        <Modal
                                             open={openMove}
                                             onClose={handleClose}
                                             aria-labelledby="modal-modal-title"
                                             aria-describedby="modal-modal-description"
                                        >
                                             <Box sx={style}>
                                                  <div>{item.documentName}</div>
                                                  {catListdata.map((category) => (
                                                       <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            <Radio
                                                                 type="radio"
                                                                 value={category.categoryId}
                                                                 checked={targetCategory === category.categoryId}
                                                                 onChange={() => setTargetCategory(category.categoryId)}
                                                            />
                                                            <p>{category.categoryName}</p>
                                                       </div>
                                                  ))}
                                                  {console.log('target?????', targetCategory)}
                                                  <Button variant="contained" onClick={() => handleMove(item)}>Move</Button>

                                             </Box>
                                        </Modal>

                                        {/* <Modal
                                             open={openShare}
                                             onClose={handleClose}
                                             aria-labelledby="modal-modal-title"
                                             aria-describedby="modal-modal-description"
                                        >
                                             <Box sx={style}>
                                                  <FormControl>
                                                       <FormLabel id="demo-radio-buttons-group-label">Share Document</FormLabel>

                                                       <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                <Radio
                                                                      type="radio"
                                                                      value={category.categoryId}
                                                                      checked={targetCategory === category.categoryId}
                                                                      onChange={() => setTargetCategory(category.categoryId)}
                                                                 />
                                                                 <p></p>
                                                            </div>

                                                       <Button variant="contained" color='inherit'>Share</Button>
                                                  </FormControl>
                                             </Box>
                                        </Modal> */}

                                        <Box sx={{ flexBasis: '33%', boxSizing: 'border-box', padding: '10px' }} key={index}>
                                             <Card style={{ marginTop: '40px', marginBottom: '40px' }}>
                                                  <Box sx={{ display: 'flex', justifyContent: 'end', padding: '10px' }}>
                                                       <PopupState variant="popover" popupId="demo-popup-popover">
                                                            {(popupState) => (
                                                                 <div>
                                                                      <Icon fontSize="small" sx={{ cursor: 'pointer' }} {...bindTrigger(popupState, item)}>more_vert</Icon>
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
                                                                           <Box sx={{ display: 'flex', flexDirection: 'column', }}>
                                                                                <Tooltip title="Move Document" sx={{ m: 1 }} placement="right">
                                                                                     <Icon onClick={() => { handleMovePop(); setTooltipOpen(true); }}>drive_file_move</Icon>
                                                                                </Tooltip>
                                                                                <Tooltip title="Share Document" sx={{ m: 1 }} placement="right">
                                                                                     <Icon onClick={handleShare}>share</Icon>
                                                                                </Tooltip>
                                                                                <Tooltip title="View Document" sx={{ m: 1 }} placement="right">
                                                                                     <Icon onClick={() => { handleViewPdf(item); setTooltipOpen(true); }}>visibility</Icon>
                                                                                </Tooltip>
                                                                                <Tooltip title="Download Document" sx={{ m: 1 }} placement="right">
                                                                                     <Link href={item.documentUrl}
                                                                                          download={item.documentName}
                                                                                          target="_blank"
                                                                                          style={{ color: '#212121', display: 'flex', justifyContent: 'center', textDecoration: 'none' }}
                                                                                          rel="noreferrer"> <Icon onClick={(e) => { e.preventDefault(); handleDownloadPDF(item); setTooltipOpen(true); }}>download_for_offline</Icon>
                                                                                     </Link>
                                                                                </Tooltip>
                                                                                <Tooltip title="Delete Document" sx={{ m: 1 }} placement="right">
                                                                                     <Icon onClick={() => { handleDelete(item); setTooltipOpen(true); }}>delete</Icon>
                                                                                </Tooltip>
                                                                           </Box>
                                                                      </Popover>
                                                                 </div>
                                                            )}
                                                       </PopupState>

                                                  </Box>
                                                  <Box>
                                                       <Box sx={{ height: '166px' }}>
                                                            <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
                                                                 <Viewer
                                                                      // fileUrl={`https://cors-anywhere.herokuapp.com/${item.url}`}
                                                                      fileUrl={'http://s3.ap-south-1.amazonaws.com/docuit-dev/dockit/f1ecde14-cd12-4aea-9d56-407b450d0e97/reactjs_session1.pdf'}
                                                                      httpHeaders={{ Authorization: `Bearer ${isAuthenticated}`, 'Content-Type': 'application/pdf' }}
                                                                      className="pdf-img"
                                                                      onError={(error) => console.error('PDF Viewer Error:', error)}
                                                                 />
                                                            </Worker>
                                                       </Box>
                                                       <div className="doc-details">
                                                            <h5 style={{ cursor: 'pointer' }} onClick={() => toggleExpansion(item)}>{isExpanded ? item.documentName : truncateText(item.documentName, 35)} <span> {isExpanded}</span></h5>
                                                            {/* <h5><Moment format="MMM D YYYY, hh:mm:ss a" >{item.createdAt}</Moment></h5> */}
                                                            <h5>Size: {(item.documentSize / (1024 * 1024)).toFixed(2)}MB</h5>
                                                       </div>
                                                  </Box>
                                             </Card>
                                        </Box>

                                   </>
                              ))}
                         </Box>
                    </>
               )
               }



          </DashboardLayout >
     )
}
export default Documents;