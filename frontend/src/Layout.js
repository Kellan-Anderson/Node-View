// Imports
import React from "react";
import {Outlet} from "react-router-dom"

const Layout = () => {
    return (
        <>
            {/*This renders the components of a page when a link to it is clicked*/}
            <Outlet />
        </>
    );
};

export default Layout;
