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

import 'react-phone-input-2/lib/style.css'
import OtpInput from 'react-otp-input';
import { useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';
import { setpin } from "../../../services/index";

function Pins() {

    const [pinNumber, setpinNumber] = useState("");
    const [confirmpinNumber, setconfirmpinNumber] = useState("");

    const navigate = useNavigate();
    const [loginErrorMsg, setLoginErrorMsg] = useState('');
    const formik = useFormik({
    });
    var values;

    const { state } = useLocation();
    const { phone } = state;
    const enableds = pinNumber.length > 3 && confirmpinNumber.length > 3;

    useEffect(()=>{
        if(confirmpinNumber.length===4){
            pinSubmits()
        }
    },[confirmpinNumber])

    const pinSubmits = async (e) => {
        e?.preventDefault();
        if (pinNumber === confirmpinNumber) {
            values = { phone: phone, pinNumber: pinNumber };
            setpin(values).then(({ data, response }) => {
                if (data) {
                    setLoginErrorMsg('Verified')
                   // navigate('/signIn');
                   setTimeout(() => {
                       navigate('/signIn');
                     }, 1000); 
                }
                else {
                    setLoginErrorMsg(response.data.message)
                }
            })
                .catch((err) => {

                    setLoginErrorMsg(err.response.message)
                });
            //   try {
            //     const response = await axios.post('http://13.234.66.106:8081/dockitservice/auth/pinGeneration', { phone, pinNumber },
            //       {
            //         headers: {
            //           "Content-Type": "application/json",
            //           'Access-Control-Allow-Origin': '*'
            //         }
            //       }
            //     );
            //     setLoginErrorMsg('')
            //     navigate('/signIn');
            //   }
            //   catch (err) {
            //     setLoginErrorMsg(err.response.data.message)
            //   }
        } else {
            setLoginErrorMsg('pin miss matched')
        }
    };

    return (
        <BasicLayout image={bgImage}>
            <Card>
                <MDTypography variant="h4" fontWeight="medium" color="docuit" m={'auto'} pt={4}>
                    <img src={brandWhite} alt="Dockit Logo" style={{ width: '40px', height: 'auto', marginBottom: '-30px' }} />
                </MDTypography>

                <form onSubmit={pinSubmits}>
                    <MDBox pt={4} pb={3} px={3}>
                        <MDBox mb={2}>
                            <label style={{ color: "grey", fontSize: 15, paddingLeft: '120px' }}>Enter PIN</label>
                            <OtpInput
                                value={pinNumber}
                                onChange={setpinNumber}
                                numInputs={4}
                                inputType="password"
                                renderSeparator={<span style={{ width: "20px" }}></span>}
                                containerStyle={{
                                    paddingLeft: '40px', width: '300px', height: '40px', borderBlockEndColor: "grey"
                                }}
                                renderInput={(props) => <input {...props} style={{ color: "grey", textAlign:'center', fontSize: 25, width: "40px", height:'40px' }}/>}
                            />
                        </MDBox>

                        <MDBox mb={2}>
                            <label style={{ color: "grey", fontSize: 15, paddingLeft: '110px' }}>Confirm PIN</label>
                            <OtpInput
                                value={confirmpinNumber}
                                onChange={setconfirmpinNumber}
                                numInputs={4}
                                inputType="password"
                                renderSeparator={<span style={{ width: "20px" }}></span>}
                                containerStyle={{
                                    paddingLeft: '40px', width: '300px', height: '40px', borderBlockEndColor: "grey"
                                }}
                                renderInput={(props) => <input {...props} style={{ color: "grey", textAlign:'center', fontSize: 25, width: "40px", height:'40px' }}/>}
                            />
                        </MDBox>

                        <MDBox mt={4} mb={1}>
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
                                disabled={!enableds}>
                                Generate PIN
                            </MDButton>
                        </MDBox>
                    </MDBox>

                    {loginErrorMsg &&
                        <Stack sx={{ width: '100%', marginTop: 4 }} spacing={4}>
                            {/* <Alert severity="error">
                                <AlertTitle>Error</AlertTitle>
                                {loginErrorMsg}
                            </Alert> */
                            loginErrorMsg === 'Verified' ? (
                                <Alert severity="success">
                                    <AlertTitle>Success</AlertTitle>
                                    {loginErrorMsg}
                                </Alert>
                            ) : (
                                <Alert severity="error">
                                    <AlertTitle>Error</AlertTitle>
                                    {loginErrorMsg}
                                </Alert>
                            )
                            
}
                        </Stack>
                    }
                </form>
            </Card>
        </BasicLayout>
    );


}

export default Pins;

