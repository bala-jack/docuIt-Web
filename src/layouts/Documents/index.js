import { useAuth } from "context/AuthContext";
import { useEffect } from "react";
import { UsercategoryList } from "services";
import { Button, Card, Icon } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useState } from "react";
import { Grid } from "react-loader-spinner";
import Moment from "react-moment";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import styled from "@emotion/styled";
import { saveDocuments } from "services";
import { uploadDocuments } from "services";
import { pdfjs } from 'react-pdf';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

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
     const { category, UserData, isAuthenticated } = useAuth();
     const [flashMessage, setFlashMessage] = useState('');
     const [isLoading, setIsLoading] = useState(false);
     const [LifeData, setLifeData] = useState([]);
     const [uploadClicked, setUploadClicked] = useState(false);
     const [selectFile, setSelectedFile] = useState(null);
     const userId = UserData?.id;
     pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`;

     useEffect(() => {
          const fetchData = async () => {
               try {
                    const categoryId = category.categoryId;
                    console.log("categoryIds >>>>", category);
                    const values = { userId, categoryId };
                    const { data } = await UsercategoryList(values);
                    console.log("data : ", data)
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

     useEffect(() => {
          if (selectFile && uploadClicked) {
               handleUpload(); // Call handleUpload when both conditions are met
               setUploadClicked(false); // Reset the state after handling the upload
          }
     }, [selectFile, uploadClicked])

     const handleUploadButtonClick = () => {
          setUploadClicked(true); // Set the state to indicate the upload button is clicked
     }

     const handleFileChange = (event) => {
          if (event.target.files[0]) {
               if (ALLOWED_FILE_TYPES.includes(event.target.files[0].type)) {
                    setSelectedFile(event.target.files[0]);
                    console.log('event.target.files[0]>>>>>>', event.target.files[0])
               } else {
                    console.error("Invalid selectFile type. Please select a PDF or PNG selectFile.");
               }
          }
     }

     const handleUpload = async () => {
          if (!selectFile) {
               console.error('Please select a selectFile.');
               return;
          }
          try {
               const file = new FormData();
               file.append('file', selectFile);
               const { data } = await uploadDocuments(userId, file);
               console.log('uploadResponse>>>>>>>>', data);

               if (data.documentUrl === '') {
                    console.log("Doc is Empty");
                    return;
               }
               else {
                    try {
                         setIsLoading(true);
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
                         console.log('Save response:', saveResponse.status);
                         if (saveResponse.status === 200) {
                              setIsLoading(false);
                              setFlashMessage('Document saved successfully');
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
     }
     console.log("LifeData::", LifeData);
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
                         <Button className="btnfamilylist" onClick={handleUploadButtonClick} component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                              Upload File
                              <VisuallyHiddenInput type="file" onChange={handleFileChange} />
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
                         {LifeData.map((item, index) => (
                              <Card style={{ marginTop: '40px', marginBottom: '40px' }} key={index}>
                                   <div style={{display:'flex', justifyContent:'end', padding:'10px', cursor:'pointer'}}>
                                     <Icon fontSize="small">more_vert</Icon>
                                     </div>
                                   <div className="thumbnail-container">
                                        <div className="recent-view">
                                             <div style={{ height: '96%' }}>
                                                  <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
                                                       <Viewer
                                                            // fileUrl={`https://cors-anywhere.herokuapp.com/${item.url}`}
                                                            fileUrl={'http://s3.ap-south-1.amazonaws.com/docuit-dev/dockit/f1ecde14-cd12-4aea-9d56-407b450d0e97/reactjs_session1.pdf'}
                                                            httpHeaders={{ Authorization: `Bearer ${isAuthenticated}`, 'Content-Type': 'application/pdf' }}
                                                            className="pdf-img"
                                                            onError={(error) => console.error('PDF Viewer Error:', error)}
                                                       />
                                                  </Worker>
                                             </div>
                                             <div className="doc-details">
                                                  <h5>{item.documentName}</h5>
                                                  <h5><Moment format="MMM D YYYY, hh:mm:ss a" >{item.createdAt}</Moment></h5>
                                                  <h5>Size: {(item.documentSize / (1024 * 1024)).toFixed(2)}MB</h5>
                                             </div>
                                        </div>
                                   </div>
                              </Card>
                         ))}
                    </>
               )}



          </DashboardLayout>
     )
}
export default Documents;