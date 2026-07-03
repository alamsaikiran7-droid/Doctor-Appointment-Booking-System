import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";

function DashboardLayout({

  role,

  children,

}) {

  return (

    <div className="d-flex">

      <Sidebar role={role} />

      <div
        className="flex-grow-1"
        style={{
          background: "#f5f7fa",
          minHeight: "100vh",
        }}
      >

        <Topbar role={role} />

        <div className="p-4">

          {children}

        </div>

      </div>

    </div>

  );

}

export default DashboardLayout;