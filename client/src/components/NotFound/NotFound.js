import React from "react";
import NavBar from "../NavBar/NavBarHomePage";
//import Footer from "./Footer";

const NotFound = () => {
  return (
    <>
      <div>
        <NavBar />
        <h3 className="text-lg text-center mt-28 ">404 Page Not Found</h3>
        {/* <Footer /> */}
      </div>
    </>
  );
};

export default NotFound;
