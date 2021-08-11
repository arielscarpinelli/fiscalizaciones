import React from "react";
import Navbar from "components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

const Layout = ({ children }) => (
  <>
    <Navbar />
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
    <div className="container-fluid padding-header-fixed">{children}</div>
  </>
);

export default Layout;
