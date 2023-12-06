import { useState, useEffect } from "react";

// react-router-dom components
import { Route, json, useNavigate } from "react-router-dom";

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
import { listFamily, login, logout } from "../../../services/index";

import * as yup from 'yup'
import { useFormik } from "formik";

import './signIn.css'
import { useAuth } from "../../../context/AuthContext";
import { Link } from "react-router-dom";
import { DOCUIT_SIGNIN_SCREEN } from '../../../utilities/strings';
import routes from "routes";
import { Switch } from "@mui/material";
import AdminDashboard from "layouts/dashboard";
import Dashboard from "layouts/userdashboard";

const validationSchema = yup.object().shape({
  phoneNumber: yup.string().required('*Email is required'),
  password: yup.string().required('*Password is required'),
});


function Basic() {

  const { loginSuccess, isAuthenticated, setuserdata, setFamilyMemberData } = useAuth();

  const formik = useFormik({
    initialValues: {
      phoneNumber: '',
      password: ''
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      formik.setStatus(false);
      login(values)
        .then(({ data, response }) => {
          if (data) {
            loginSuccess();
            setuserdata(data?.response?.userDetails);
            localStorage.setItem('docuItToken', data?.response?.token);
            localStorage.setItem('docuItuserDetails', JSON.stringify(data?.response?.userDetails));
            // localStorage.setItem('UserData', JSON.stringify({
            //   "id": "0bf1f1ae-d632-4717-90f8-a730c7c03005",
            //   "name": "praveen",
            //   "email": "rpraveen.tgi@gmail.com",
            //   "phone": "9042630084",
            //   "status": "ACTIVE",
            //   "createdAt": "2023-11-17T05:14:42.240+00:00",
            //   "updatedAt": "2023-11-17T05:16:06.137+00:00",
            //   "gender": "male",
            //   "deviceId": "",
            //   "accountVerified": true,
            //   "otpCreatedAt": "2023-11-17T05:14:42.240+00:00",
            //   "roles": [
            //     {
            //       "id": 2,
            //       "name": "User"
            //     }
            //   ]
            // }));
            navigate('/dashboard');
          } else {
            formik.setStatus('*Incorrect email or password*')
          }
        })
        .catch(() => {
          formik.setStatus('*Incorrect email or password*');
        });
    }
  });

  const navigate = useNavigate();
  const navigateHome = () => {
    navigate('/signUp');
    navigate('/forgetPin');
  };

  useEffect(() => {
    if (isAuthenticated) {
      // goback if logged In
      navigate(-1);
    }
  }, [])

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDTypography variant="h4" fontWeight="medium" color="docuit" m={'auto'} pt={4}>
          <img src={brandWhite} alt="Dockit Logo" style={{ width: '40px', height: 'auto', marginBottom: '-14px' }} /> Login
        </MDTypography>
        {formik.status && <p style={{ color: 'red', textAlign: 'center', fontSize: 13, marginTop: '20px' }}>{formik.status}</p>}
        <MDBox pt={4} pb={3} px={3}>
          <form onSubmit={formik.handleSubmit}>
            <MDBox mb={2}>
              <MDInput
                sx={{
                  input: {
                    color: 'grey',
                    "&::placeholder":
                    {
                      color: 'red',
                    },
                  },
                  label: {
                    color: formik.touched.phoneNumber && !!formik.errors.phoneNumber ? 'red' : 'grey', // Change 'defaultLabelColor' to your actual default label color
                  },
                  '& .MuiFormHelperText-root': { // This targets the helper text
                    color: 'red',
                  },
                }}
                name="phoneNumber"
                label="phoneNumber"
                fullWidth
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.phoneNumber}
                error={formik.touched.phoneNumber && !!formik.errors.phoneNumber}
                helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}

              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput type="password" name="password" label="Password"
                fullWidth
                sx={{
                  input: {
                    color: 'grey',
                    "&::placeholder":
                    {
                      color: 'red',
                    },
                  },
                  label: {
                    color: formik.touched.password && !!formik.errors.password ? 'red' : 'grey', // Change 'defaultLabelColor' to your actual default label color
                  },
                  '& .MuiFormHelperText-root': { // This targets the helper text
                    color: 'red',
                  },
                }}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                error={formik.touched.password && !!formik.errors.password}
                helperText={formik.touched.password && formik.errors.password}
              />
            </MDBox>
            <h1 style={{ color: "grey", fontSize: 13, textAlign: "right", paddingBottom: '1px' }}><Link to="/forgetPin" style={{ color: "grey", fontSize: 13 }}>{DOCUIT_SIGNIN_SCREEN.signin_forget}</Link></h1>
            <MDBox mt={4} mb={1}>
              <MDButton
                type="submit"
                variant="gradient"
                color="docuit"
                fullWidth
                sx={{
                  animation: formik.status ? 'shakeHorizontal 0.42s cubic-bezier(.36,.07,.19,.97) both' : 'none',
                  "&:hover": {
                    backgroundColor: 'docuit.main'
                  }
                }}
              >
                sign in
              </MDButton>

              <h1 style={{ color: "grey", fontSize: 13, textAlign: "center", paddingTop: '10px' }}>{DOCUIT_SIGNIN_SCREEN.signup_detail} <Link to="/signUp" style={{ color: "black", fontSize: 13 }}>{DOCUIT_SIGNIN_SCREEN.signup_string}</Link></h1>
            </MDBox>
          </form>
        </MDBox>
      </Card>
    </BasicLayout>
  );



}

export default Basic;
