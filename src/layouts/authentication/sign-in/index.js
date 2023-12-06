import { useEffect} from "react";

// react-router-dom components
import { useNavigate } from "react-router-dom";

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
import { login, logout } from "../../../services/index";

import * as yup from 'yup'
import { useFormik } from "formik";

import './signIn.css'
import { useAuth } from "../../../context/AuthContext";

const validationSchema = yup.object().shape({
  email: yup.string().email('*Invalid email address').required('*Email is required'),
  password: yup.string().required('*Password is required'),
});


function Basic() {

  const { loginSuccess, isAuthenticated} = useAuth()

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      formik.setStatus(false);
      login(values)
        .then(({ data,response }) => {
          if(data){
            loginSuccess()
            localStorage.setItem('docuItToken', data?.response?.token);
            navigate('/dashboard');
          }else{
            formik.setStatus('*Incorrect email or password*')
          }
        })
        .catch(() => {
          formik.setStatus('*Incorrect email or password*');
        });
    }
  });

  const navigate = useNavigate();

  useEffect(() => {
    if(isAuthenticated){
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
        {formik.status && <p style={{ color: 'red', textAlign: 'center', fontSize: 13,marginTop:'20px' }}>{formik.status}</p>}
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
                    color: formik.touched.email && !!formik.errors.email ? 'red' : 'grey', // Change 'defaultLabelColor' to your actual default label color
                  },
                  '& .MuiFormHelperText-root': { // This targets the helper text
                    color: 'red',
                  },
                }}
                name="email"
                label="Email"
                fullWidth
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                error={formik.touched.email && !!formik.errors.email}
                helperText={formik.touched.email && formik.errors.email}
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
            </MDBox>
          </form>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
