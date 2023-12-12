import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

function FinanceAcc(){
     return(
          <DashboardLayout className='mainContent'>
          <DashboardNavbar />
          <h1>FinanceAcc</h1>
          </DashboardLayout>
     )
}
export default FinanceAcc;