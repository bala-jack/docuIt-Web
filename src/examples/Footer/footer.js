import React from 'react';
import CopyrightIcon from '@mui/icons-material/Copyright';
import { Typography } from '@mui/material';

function Footer() {
     return (
          <footer style={{
               display: 'flex',
               alignItems: 'center',
               paddingLeft: '250px',
               paddingRight: '10px',
               backgroundColor: 'rgb(30,30,31)',
               justifyContent: 'flex-end',
               position: 'fixed',
               bottom: 0,
               paddingTop: 10,
               paddingBottom: 10,
               zIndex: '1200',
               width: '100%',
          }}>
               <Typography
                    variant="body2"
                    color="#9E9E9E"
                    fontSize='14px'
                    fontStyle={'italic'}>
                    <CopyrightIcon /> 2023 Dock.It All rights reserved.
               </Typography>
          </footer>
     );
}

export default Footer;