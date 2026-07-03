function Topbar({ role }) {

  return (

    <div
      className="bg-white shadow-sm d-flex justify-content-between align-items-center px-4"
      style={{
        height: "70px",
      }}
    >

      <div>

        <h4 className="mb-0">

          Welcome,

          {" "}

          {role.charAt(0).toUpperCase() + role.slice(1)}

        </h4>

      </div>

      <div>

        🔔

        {"  "}

        👤

      </div>

    </div>

  );

}

export default Topbar;