import React from 'react';

import Header from "../../components/header";
import Sidebar from "../../components/sidebar";

const StaffMainPage = () => {

    return (
        <>
            <Header role="staff" />

            <div style={{ display: 'flex' }}>
                <Sidebar role={'staff'} />
            </div>
        </>
    );
}

export default StaffMainPage;