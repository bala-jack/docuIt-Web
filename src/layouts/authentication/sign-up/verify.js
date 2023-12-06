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
import { Link } from "react-router-dom"
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';
import { verify } from "../../../services/index";
import { resend } from "../../../services/index";
import { DOCUIT_VERIFY_SCREEN } from '../../../utilities/strings';

function Basics() {
    console.log();
    const [code, setCode] = useState('');

    const navigate = useNavigate();

    const [loginErrorMsg, setLoginErrorMsg] = useState('');
    const formik = useFormik({
    });

    var values;
    const { state } = useLocation();
    const { email, phone } = state;
    useEffect(() => {
        if (code.length === 5) {
            handleSubmits()
        }
    }, [code])

    const onClickHandle = async (e) => {
        e?.preventDefault();

        values = email;
        resend(values)
            .then(({ data, response }) => {
                if (data) {
                    setLoginErrorMsg('code sent')
                }
                else {
                    setLoginErrorMsg(response.data.message)
                }
            })
            .catch((err) => {
                setLoginErrorMsg(err.response.message)
            });
        // try {
        //   const response = await axios.post('http://13.234.66.106:8081/dockitservice/auth/resendCode?email=' + email,
        //     {
        //       headers: {
        //         "Content-Type": "application/json",
        //         'Access-Control-Allow-Origin': '*'
        //       }
        //     }
        //   );
        //   setLoading('200');
        //   setOpen('false');
        //   setLoginErrorMsg('code sent')
        // }
        // catch (err) {
        //   // !err?.response
        //   setLoginErrorMsg(err.response.data.message)
        // }
    };

    const handleSubmits = async (e) => {
        e?.preventDefault();
        values = { email: email, code: code };
        verify(values)
            .then(({ data, response }) => {
                if (data) {
                    setLoginErrorMsg('Verified')
                    setTimeout(() => {
                        navigate('/setpin', { state: { phone: phone } });
                    }, 1000);

                    //navigate('/setpin', { state: { phone: phone } });
                }
                else {
                    setLoginErrorMsg(response.data.message)
                }
            })
            .catch((err) => {
                setLoginErrorMsg(err.response.message)
            });
        // try {
        //   const response = await axios.post('http://13.234.66.106:8081/dockitservice/auth/verifyEmail', { email, code },
        //     {
        //       headers: {
        //         "Content-Type": "application/json",
        //         'Access-Control-Allow-Origin': '*'
        //       }
        //     }
        //   );
        //   setCode('');
        //   setIsmpin('200');
        //   setLoginErrorMsg('')
        //   navigate('/setpin', { state: { phone: phone } });
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

                <form onSubmit={handleSubmits}>
                    <MDBox pt={4} pb={3} px={3}>
                        <MDBox mb={2}>
                            <OtpInput
                                value={code}
                                onChange={setCode}
                                numInputs={5}
                                renderSeparator={<span style={{ width: "10px" }}></span>}
                                containerStyle={{
                                    paddingLeft: '40px', width: '300px', height: '40px', borderBlockEndColor: "grey"
                                }}
                                renderInput={(props) => <input {...props} style={{ color: "grey", textAlign: 'center', fontSize: 25, width: "40px", height: '40px' }} />}
                            />
                            <h1 style={{ color: "grey", fontSize: 13, textAlign: "center", paddingTop: '18px' }}>{DOCUIT_VERIFY_SCREEN.verify_detail} <Link href=""><span style={{ color: "black", fontSize: 13 }} onClick={onClickHandle}>{DOCUIT_VERIFY_SCREEN.verify_string}{phone}</span></Link></h1>
                            {/* <h2 style={{ color: "grey", fontSize: 13, textAlign: "center", paddingTop: '8px' }}>{DOCUIT_VERIFY_SCREEN.verify_mobile}<span style={{ color: "black", fontSize: 13 }}>{phone}</span></h2> */}
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
                                disabled={code.length < 5}
                            >
                                Verify
                            </MDButton>
                        </MDBox>
                    </MDBox>

                    {loginErrorMsg &&
                        <Stack sx={{ width: '100%', marginTop: 4 }} spacing={4}>
                            {loginErrorMsg === 'code sent' ? (
                                <Alert severity="success">
                                    <AlertTitle>Success</AlertTitle>
                                    {loginErrorMsg}
                                </Alert>
                            ) : loginErrorMsg === 'Verified' ? (
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

export default Basics;

