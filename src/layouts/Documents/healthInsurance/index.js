import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

function HealthIns(){
     return(
          <DashboardLayout className='mainContent'>
          <DashboardNavbar />
          <h1>HealthIns</h1>
          </DashboardLayout>
     )
}
export default HealthIns;