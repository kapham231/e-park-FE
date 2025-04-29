import React from 'react';

import Header from "../../components/header";
import Sidebar from "../../components/sidebar";

const ManagerMainPage = () => {

    return (
        <>
            <Header role="manager" />

            <div style={{ display: 'flex' }}>
                <Sidebar role={'manager'} />
            </div>
        </>
    );
}

export default ManagerMainPage;