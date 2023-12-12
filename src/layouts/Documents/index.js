import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


function Documents(){
const navigate = useNavigate();

     useEffect(() => {
          navigate('/documents/assets');
     })
     
     return(
          <DashboardLayout className='mainContent'>
          <DashboardNavbar />
          <h1>Documents</h1>
          </DashboardLayout>
     )
}
export default Documents;