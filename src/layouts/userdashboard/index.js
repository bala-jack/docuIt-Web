import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import React, { useEffect, useState } from 'react';
import { userdashboard } from "../../services/index";
import { Card, CardActionArea, CardContent, Grid, Typography, CardMedia } from "@mui/material";
import Moment from 'react-moment';
import 'moment-timezone';
import { useAuth } from "context/AuthContext";
//import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
// import './userdash.css';
// import { Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { DOCUIT_DASHBOARD_SCREEN } from "utilities/strings";
import NoDocumentsFoundImage from "assets/images/No_Documents_Found.webp";


function Dashboard() {
  const [datas, setData] = useState([]);
  const { UserData } = useAuth();
  const vals = UserData?.id;
  pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`;
  console.log(UserData?.id);

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return `${text.slice(0, maxLength)}...`;
  };

  useEffect(() => {
    userdashboard(vals)
      .then(({ data, response }) => {

        if (data) {
          setData(data?.response);
        }
      })
      .catch((error) => {
        console.error(error ?? "Something went wrong try later.")
      });

  }, [vals]);


  return (
    <>
      <DashboardLayout>
        <DashboardNavbar />
        <h2 className="card-head">{DOCUIT_DASHBOARD_SCREEN.userdashboard_header}</h2>
        {console.log('UDData>>>>>', datas)}
        <Grid container spacing={2}>
          {datas.length === 0 ? (
            <>
              <Card sx={{ minWidth: '100%', minHeight: '50vh', textAlign: 'center', alignItems: 'center' }}>
                <div style={{ margin: 'auto' }}>
                  <img style={{ maxHeight: 100, maxWidth: 100 }} src={NoDocumentsFoundImage} alt='No_Documents_Found_Image' />
                  <h2>No documents uploaded or shared yet</h2>
                  <span>
                    Upload documents to view and share them.
                  </span>
                </div>
              </Card>
            </>
          ) : (
            <>
              {datas.map((item, index) => (
                <Grid item key={index} xs={12} sm={6} md={4}>
                  <Card style={{ Width: '50vh' }}>
                    <CardActionArea sx={{ height: '100%' }}>
                      <CardMedia style={{ width: '90%', height: '100%', overflow: 'hidden', objectFit: "contain" }}>
                        <div className="thumbnail d-flex"
                          style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                          {/* <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
                      <Viewer
                        //fileUrl={item.url}
                        fileUrl='https://www.africau.edu/images/default/sample.pdf'
                        // httpHeaders={{ Authorization: `Bearer ${isAuthenticated}`, 'Content-Type': 'application/pdf' }}
                        className="pdf-img"
                        onError={(error) => {
                          console.error('PDF Viewer Error:', error);
                          return (<div style={{ padding: '20px', textAlign: 'center' }}>Failed to fetch PDF</div>);
                        }}
                      />
                    </Worker> */}
                          <iframe scrolling='no' title={item.fileName} style={{ width: '200%', height: '200%', border: 'none', overflow: 'hidden !important' }} src={item.url} allowfullscreen />
                        </div>
                      </CardMedia>
                      <CardContent>
                        <Typography
                          gutterBottom
                          variant="h5"
                          component="div"
                          sx={{ minHeight: '5rem', overFlow: 'hidden' }}>
                          {item.documentName}
                          {truncateText(item.documentName, 1)}
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
            </>)
          }
        </Grid>
      </DashboardLayout>
    </>
  );
}


export default Dashboard;
