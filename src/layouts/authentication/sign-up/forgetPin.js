import axios from "axios";
// @mui material components
import Card from "@mui/material/Card";

// DocuIt React components
import MDBox from "components/MDBox";
import MDTypography from "../../../components/MDTypography";
import MDInput from "../../../components/MDInput";
import MDButton from "../../../components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/bg-sign-in-basic.png";
import brandWhite from "assets/images/logo_dockit.png";

import './signUp.css'

import React, { useState, useEffect } from 'react';
import 'react-dropdown/style.css';

import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";

import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';
import { forgetpin } from "../../../services/index";
import LoadingSpinner from './LoadingSpinner';

function Basic() {

  var [phoneNumber, setphoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [loginErrorMsg, setLoginErrorMsg] = useState('');
  const formik = useFormik({
  });
  var values;
  const enabled = phoneNumber.length > 11;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginErrorMsg('')
    setIsLoading(true)
    phoneNumber = (phoneNumber.substring(phoneNumber.length - 10, phoneNumber.length));
    values = phoneNumber
    forgetpin(values).then(({ data, response }) => {
      if (data) {
        setIsLoading(false)
        navigate('/signIn');
      } else {
        setIsLoading(false)
        setLoginErrorMsg(response.data.message)
      }
    }).catch((err) => {
      setIsLoading(false)
      setLoginErrorMsg(err.response.message)
    });
    // try {
    //   const response = await axios.post('http://13.234.66.106:8081/dockitservice/auth/forgotPin?phoneNumber=' + phoneNumber,
    //     {
    //       headers: {
    //         "Content-Type": "application/json",
    //         'Access-Control-Allow-Origin': '*'
    //       }
    //     }
    //   );
    //   navigate('/signIn');
    // }
    // catch (err) {
    //   setLoginErrorMsg(err.response.data.message)
    // }
  };

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDTypography variant="h4" fontWeight="medium" color="docuit" m={'auto'} pt={4}>
          <img src={brandWhite} alt="Dockit Logo" style={{ width: '40px', height: 'auto', marginBottom: '-14px' }} />
        </MDTypography>
        <MDBox pt={4} pb={3} px={3}>
          <form onSubmit={handleSubmit}>

            <MDBox mb={2}>
              <PhoneInput
                placeholder="Phone Number"
                country={'in'}
                value={phoneNumber}
                onChange={(phoneNumber) => setphoneNumber(phoneNumber)}
                inputProps={{
                  required: true,
                }}
                style={{
                  width: "100%",
                  borderRadius: 25,
                  paddingLeft: 7,
                  position: "relative",
                  marginBottom: "20px",
                }}
              />
            </MDBox>

            {isLoading ? <LoadingSpinner />:             <MDBox mt={4} mb={1}>
              <MDButton
                type="submit"
                variant="contained"
                color="docuit"
                sx={{
                  width: "100%",
                  borderRadius: 25,
                  fontSize: '15px',
                  height: '50px',
                  textTransform: 'capitalize',
                  fontWeight: 700
                }}
                disabled={!enabled}
              >
                submit
              </MDButton>


            </MDBox> }


            {/* <MDBox mt={4} mb={1}>
              <MDButton
                type="submit"
                variant="contained"
                color="docuit"
                sx={{
                  width: "100%",
                  borderRadius: 25,
                  fontSize: '15px',
                  height: '50px',
                  textTransform: 'capitalize',
                  fontWeight: 700
                }}
                disabled={!enabled}
              >
                submit
              </MDButton>


            </MDBox> */}

            {loginErrorMsg &&
              <Stack sx={{ width: '100%', marginTop: 4 }} spacing={4}>
                <Alert severity="error">
                  <AlertTitle>Error</AlertTitle>
                  {loginErrorMsg}
                </Alert>
              </Stack>
            }
          </form>
        </MDBox>
      </Card>
    </BasicLayout>
  );

}

export default Basic;

