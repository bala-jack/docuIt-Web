// import { Button } from "@mui/material";
// import MDBox from "components/MDBox";
// import { useAuth } from "context/AuthContext";
// import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
// import DashboardNavbar from "examples/Navbars/DashboardNavbar";
// import { useEffect } from "react";
// import { useLocation } from "react-router-dom";
// import { listFamilyMembers } from "services";


// function FamilyMembers({ familyData }) {
//      // const { UserData } = useAuth();
//      // const familyId = familyData.id;
//      console.log('FamilyMemnebe', familyData);

//      const familyId = 'd7a5d5b7-d2c3-445a-961c-8795cd30b1ce';

//      useEffect(() => {
//           const fetchData = async () => {
//                try {
//                     const { data } = await listFamilyMembers(familyId);
//                     console.log('data', data);
//                     if (!data?.response?.MemberList[0]?.family?.id || data?.response?.MemberList[0]?.family?.id.length === 0) {
//                          console.log('nodata');
//                          return (
//                               <div>
//                                    <h1>No family data available.</h1>
//                                    {/* Additional HTML content when the length is zero */}
//                                    <p>Some additional content...</p>
//                               </div>
//                          );
//                     } else {
//                          // Render HTML content when there is data
//                          return (
//                               <div>
//                                    {/* HTML content for when there is data */}
//                                    <p>Data is available: {data.response.MemberList[0].family.id}</p>
//                               </div>
//                          );
//                     }
//                     if (data?.status === 'SUCCESS') {
//                          console.log('data', data?.response?.MemberList[0]?.family?.id);


//                     }
//                } catch (err) {
//                     console.error("API call failed:", err);
//                }
//           };

//           fetchData();
//      }, [familyData]);
//      return (
//           <DashboardLayout className='mainContent'>
//                <DashboardNavbar />
//                <MDBox className="mdbboxfamily">
//                     <div className="addbtn">

//                          <h2>Family Users  Management</h2>
//                          <div>
//                               <Button variant="contained" className="btnfamilylist">Invite + </Button>
//                          </div>
//                     </div>
//                     <div>
//                          {familyData && familyData.length > 0 && (
//                               familyData.map((item, index) => (
//                                    <div key={index}>{item.name}</div>
//                               ))
//                          )}
//                     </div>
//                </MDBox>

//           </DashboardLayout>
//      );


// }

// export default FamilyMembers;