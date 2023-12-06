// @mui material components
import Grid from "@mui/material/Grid";

// DocuIt React components
import MDBox from "components/MDBox";

// DocuIt React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import ComplexStatisticsCard from "../../examples/Cards/StatisticsCards/ComplexStatisticsCard";
import React, { useEffect, useState } from 'react';
import { dashboard } from "../../services/index";


function Dashboard() {
  const [data, setData] = useState({});

  useEffect(() => {
    (async () => await dashboard().then((res) => {
      console.log(res.data, "");
      if (res.data.code === 200 && res.data.status === 'SUCCESS') {
        const userAndDocumentStatistics = res.data.response.userAndDocumentStatistics;
        setData(userAndDocumentStatistics);
      } else {
        console.error('API Error:', res.data.message);
      }
    }))()

  }, [])


  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container rowSpacing={10} columnSpacing={20}>
          <Grid item xs={6} md={6} lg={5}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="groups"
                heading=" Total Users"
                // title="Active Users"
                count={data.totalUsers}
              />
            </MDBox>
          </Grid>
          <Grid item xs={6} md={6} lg={5}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="info"
                heading="Users in last 30 days"
                icon="person_add"
                count={data.last30DaysUserCount}
              />
            </MDBox>
          </Grid>
          <Grid item xs={6} md={6} lg={5}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="document_scanner"
                heading="Total Documents"
                count={data.totalDocuments}
              />
            </MDBox>
          </Grid>
          <Grid item xs={6} md={6} lg={5}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="cloud_upload"
                heading="Documents in Last 30 days"
                count={data.last30DaysDocumentCount}
              />
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Dashboard;
