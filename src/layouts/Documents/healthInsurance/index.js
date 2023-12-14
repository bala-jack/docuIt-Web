import { Card } from "@mui/material";
import { useAuth } from "context/AuthContext";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useEffect, useState } from "react";
import Moment from "react-moment";
import { UsercategoryList } from "services";

function HealthIns() {
     const { category, UserData } = useAuth();
     const [HealthData, setHealthData] = useState([]);
     const userId = UserData.id;


     useEffect(() => {
          const fetchData = async () => {
               try {
                    const categoryId = category[2].categoryId;
                    console.log("categoryIds >>>>", categoryId);
                    const values = { userId, categoryId };
                    const { data } = await UsercategoryList(values);
                    if (data.status === 'SUCCESS') {
                         setHealthData(data?.response?.documentDetailsList);
                    }
               }
               catch (err) {
                    console.error("API call failed:", err);
               }
          };
          fetchData();
     }, [userId, category])

     return (
          <DashboardLayout className='mainContent'>
               <DashboardNavbar />
               <h2 className="card-head">Health Insurance</h2>
               {HealthData.length === 0 ? (
                     <h3>There's no data.</h3>
               ) : (
                    <>
               {HealthData.map((item, index) => (
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
export default HealthIns;