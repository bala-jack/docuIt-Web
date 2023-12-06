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

//import React, { useState } from 'react';
import React, { useState, useEffect } from 'react';
import 'react-dropdown/style.css';

import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";

import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';

import { register } from "../../../services/index";
import LoadingSpinner from "./LoadingSpinner";
import { ProgressBar } from 'react-loader-spinner'

function Basic() {

  const [isLoading, setIsLoading] = useState(false);
  var [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const deviceId = '';
  const navigate = useNavigate();

  const [loginErrorMsg, setLoginErrorMsg] = useState('');
  const formik = useFormik({
  });
  const [gender, setSelectedOption] = useState('ChooseGender');
  const enabled = email.length > 0 && name.length > 0 && phone.length > 0 && gender.length < 12;
  var values;


  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true)
    phone = (phone.substring(phone.length - 10, phone.length));
    values = { name: name, email: email, phone: phone, gender: gender, deviceId: deviceId };
    setLoginErrorMsg('')
    register(values)
      .then(({ data, response }) => {
        if (data) {
          setIsLoading(false)
          navigate('/verify', { state: { email: email, phone: phone } });
        }
        else {
          setIsLoading(false)
          setLoginErrorMsg(response.data.message)
        }
      })
      .catch((err) => {
        setIsLoading(false)
        setLoginErrorMsg(err.response.message)
      });


    // try {
    //   const response = await axios.post('http://13.234.66.106:8081/dockitservice/auth/signUp', { name, email, phone, gender, deviceId },
    //     {
    //       headers: {
    //         "Content-Type": "application/json",
    //         'Access-Control-Allow-Origin': '*'
    //       }
    //     }
    //   );
    //   props.email(email);
    //   setLoginErrorMsg('')
    //   //navigate('/verify');
    //   navigate('/verify', { state: { email: email, phone: phone } });
    // }
    // catch (err) {
    //   setLoginErrorMsg(err.response.data.message)
    // }
  };
 
  return (

    <BasicLayout image={bgImage}>
      <Card>
        <MDTypography variant="h4" fontWeight="medium" color="  docuit" m={'auto'} pt={4}>
          <img src={brandWhite} alt="Dockit Logo" style={{ width: '40px', height: 'auto', marginBottom: '-14px' }} />
        </MDTypography>
        <MDBox pt={4} pb={3} px={3}>
          <form onSubmit={handleSubmit}>
            <MDBox mb={2}>
              <input
                style={{
                  color: "grey",
                  fontSize: 13, 
                  textAlign: "left",
                  width: "100%",
                  borderRadius: 5,
                  paddingLeft: 7,
                  position: "relative",
                  height: '40px',
                  // borderColor: 'grey',
                  marginBottom: "5px",
                }}
                placeholder="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                inputProps={{
                  required: true,
                }}

              />
            </MDBox>

            <MDBox mb={2}>
              <PhoneInput
                placeholder="Phone Number"
                country={'in'}
                value={phone}
                onChange={(phone) => setPhone(phone)}
                inputProps={{
                  required: true,
                }}
                style={{
                  width: "100%",
                  borderRadius: 25,
                  paddingLeft: 2,
                  position: "relative",
                  marginBottom: "20px",
                }}
              />
            </MDBox>

            <MDBox mb={2}>
              <input
                style={{
                  color: "grey",
                  fontSize: 13,
                  textAlign: "left",
                  width: "100%",
                  borderRadius: 5,
                  paddingLeft: 7,
                  position: "relative",
                  height: '40px',
                  // borderColor: 'grey',
                  marginBottom: "5px",
                }}
                placeholder="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                inputProps={{
                  required: true,
                }}
              />
            </MDBox>

            <select
              style={{
                color: "grey",
                fontSize: 13,
                textAlign: "left",
                width: "100%",
                borderRadius: 5,
                paddingLeft: 7,
                position: "relative",
                height: '40px',
                borderColor: 'grey',
                marginBottom: "5px",
              }}
              value={gender}
              onChange={e => setSelectedOption(e.target.value)}>
              {
                <>
                  <option key={'Choose Gender'} value={'ChooseGender'}>{'Choose Gender'}</option>
                  <option key={'Male'} value={'Male'}>{'Male'}</option>
                  <option key={'Female'} value={'Female'}>{'Female'}</option>
                  <option key={'Other'} value={'Other'}>{'Other'}</option>
                  <option key={'Unspecified'} value={'Unspecified'}>{'Unspecified'}</option>
                </>
              }
            </select>

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
                sign up
              </MDButton>


            </MDBox> */}
           {/* {isLoading && */}
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
                sign up
              </MDButton>


            </MDBox>
//               <ProgressBar
//   height="80"
//   width="80"
//   ariaLabel="progress-bar-loading"
//   wrapperStyle={{}}
//   wrapperClass="progress-bar-wrapper"
//   borderColor = '#A5BBCD'
//   barColor = '#767676'
// />
//  <LoadingSpinner />
            }
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

