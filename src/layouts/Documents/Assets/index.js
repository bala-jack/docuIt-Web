import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

function Assets(){
     return(
          <DashboardLayout className='mainContent'>
          <DashboardNavbar />
          <h1>assets</h1>
          </DashboardLayout>
     )
}
export default Assets;