import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import React, { useEffect, useState } from 'react';
import { userdashboard } from "../../services/index";
import { Card, CardActionArea, CardContent, CardMedia, Grid, Typography } from "@mui/material";
import Moment from 'react-moment';
import 'moment-timezone';
import { useAuth } from "context/AuthContext";
//import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
// import './userdash.css';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';


function Dashboard() {
  const [datas, setData] = useState([]);
  const { UserData, isAuthenticated } = useAuth();
  const vals = UserData?.id;
  pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`;
  console.log(UserData?.id);


  useEffect(() => {
    userdashboard(vals)
      .then(({ data, response }) => {

        if (data) {
          setData(data?.response);
        }
      })
      .catch((err) => {
        // Handle errors here
      });

  }, [vals]);


  return (
    <>
      <DashboardLayout>
        <DashboardNavbar />
        <h2 className="card-head">Recent Activity</h2>
        {console.log('UDData>>>>>', datas)}
        <Grid container spacing={2}>
          {datas.map((item, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <Card sx={{ height: '25rem' }}>
                <CardActionArea sx={{ height: '100%' }}>
                  <div className="thumbnail"
                    style={{ height: '50%', margin: '10px', border: '3px, solid, #D3D3D3' }}>
                    <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
                      <Viewer
                        //fileUrl={item.url}
                        fileUrl='http://drive.google.com/file/d/1TYw28C8vT7rC8CwhkQAcJL0hk_DFENxY/view'
                        httpHeaders={{ Authorization: `Bearer ${isAuthenticated}`, 'Content-Type': 'application/pdf' }}
                        className="pdf-img"
                        onError={(error) => {
                          console.error('PDF Viewer Error:', error);
                          return (<div style={{ padding: '20px', textAlign: 'center' }}>Failed to fetch PDF</div>);
                        }}
                      />
                    </Worker>
                  </div>
                  <CardContent>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="div"
                      sx={{ minHeight: '5rem', overFlow: 'hidden' }}>
                      {item.documentName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <span> Created At :
                        <Moment format="MMM D YYYY, hh:mm:ss a">{item.createdAt}</Moment>
                      </span>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Size :{(item.documentSize / (1024 * 1024)).toFixed(2)}MB
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </DashboardLayout>
    </>
  );
}


export default Dashboard;
