// DocuIt React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import React, { useEffect, useState } from 'react';
import { userdashboard } from "../../services/index";
import { Card } from "@mui/material";
import Moment from 'react-moment';
import 'moment-timezone';
import { useAuth } from "context/AuthContext";
//import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import './userdash.css';
import './userdash.css';
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

        {datas.map((item, index) => (
          <>
            {console.log('PDF URL:', item.url)}
            <Card key={index} style={{ marginTop: '40px', marginBottom: '40px' }}>
              {console.log('Item:', item.id)}
              <div className="thumbnail-container" key={item.id}>
                <div className="recent-view">
                  <div style={{ height: '96%' }}>
                    <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
                      <Viewer
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
          </>
        ))}
        {/* <PDFViewer
          document={{
            url: 'https://arxiv.org/pdf/quant-ph/0410100.pdf',
          }}
        /> */}

      </DashboardLayout>
    </>
  );
}

export default Dashboard;