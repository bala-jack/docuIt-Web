import { Box, Button, Card, Icon, SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import { useAuth } from "context/AuthContext";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useEffect, useState } from "react";
import { Grid } from "react-loader-spinner";
import Moment from "react-moment";
import { UsercategoryList, uploadDocuments } from "services";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import styled from "@emotion/styled";
import { saveDocuments } from "services";
import { useParams } from "react-router-dom";

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

function LifeIns() {
     const { category, UserData } = useAuth();
     const [LifeData, setLifeData] = useState([]);
     const [selectFile, setSelectedFile] = useState(null);
     const [uploadClicked, setUploadClicked] = useState(false);
     const [isLoading, setIsLoading] = useState(false);
     const [flashMessage, setFlashMessage] = useState('');
     const userId = UserData?.id;

     console.log('categoryId---------', category)
     useEffect(() => {
          const fetchData = async () => {
               try {
                    const categoryId = category.categoryId;
                    console.log("categoryIds >>>>", categoryId);
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
               // let bodyFormData = new FormData()
               // let fileObj = { uri: uploadFilePath, name: documentName + '.pdf', type: 'application/pdf' }
               // bodyFormData.append('file', fileObj)

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
                              categoryId: category[0].categoryId,
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

     // const fileData = () => {
     //      if (selectFile) {
     //           return (
     //                <div>
     //                     <h2>File Details:</h2>
     //                     <p> Name: {selectFile.name}</p>
     //                     <p> Type: {selectFile.type}</p>
     //                     <p>
     //                          Last Modified:{" "}
     //                          {selectFile.lastModifiedDate.toDateString()}
     //                     </p>
     //                </div>
     //           );
     //      } else {
     //           return (
     //                <div>
     //                     <br />
     //                     <h4>Choose before Pressing the Upload button</h4>
     //                </div>
     //           );
     //      }
     // };

     return (
          <DashboardLayout className='mainContent'>
               <DashboardNavbar />
               <div className="addbtn card-head">
                    <h2>Life Insurance</h2>
                    <div>
                         <Button className="btnfamilylist" onClick={handleUploadButtonClick} component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                              Upload File
                              <VisuallyHiddenInput type="file" onChange={handleFileChange} />
                         </Button>
                    </div>
               </div>
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
               {isLoading && (
                    <Grid></Grid>
               )}
               {LifeData.map((item, index) => (
                    <Card>
                         <div className="thumbnail-container" key={index}>
                              <div className="recent-view">
                                   <div>
                                        {/* <Viewer fileUrl={corsAnywhereUrl + item.url} className="pdf-img" /> */}
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

          </DashboardLayout>
     )
}
export default LifeIns;