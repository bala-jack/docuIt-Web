import styled from "@emotion/styled";
import { Button, Card } from "@mui/material";
import MDBox from "components/MDBox";
import { useAuth } from "context/AuthContext";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useEffect, useState } from "react";
import Moment from "react-moment";
import { UsercategoryList } from "services";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

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

function Assets() {
     const { category, UserData } = useAuth();
     const [AssetsData, setAssetsData] = useState([]);
     const userId = UserData?.id;

     useEffect(() => {
          const fetchData = async () => {
               try {
                    const categoryId = category[1].categoryId;

                    const values = { userId, categoryId };
                    const { data } = await UsercategoryList(values);
                    console.log("UsercategoryList >>>>", data);
                    if (data.status === 'SUCCESS') {
                         setAssetsData(data?.response?.documentDetailsList);
                    }
               }
               catch (err) {
                    console.error("API call failed:", err);
               }
          };
          fetchData();
     }, [userId, category])

     console.log('AssetsData>>>', AssetsData);

     return (
          <DashboardLayout className='mainContent'>
               <DashboardNavbar />
               <div className="addbtn card-head">
                    <h2>Assets</h2>
                    <div>
                         <Button className="btnfamilylist" component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                              Upload file
                              <VisuallyHiddenInput type="file" />
                         </Button>
                    </div>
               </div>
               {AssetsData.length === 0 ? (
                     <h3>There's no data.</h3>
               ) : (
                    <>
               {AssetsData.map((item, index) => (
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
               </>
               )}

          </DashboardLayout>
     )
}
export default Assets;