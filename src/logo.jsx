// Sample Logo Component in React with Icon
import React from 'react';
import { MDBIcon } from 'mdb-react-ui-kit';
import {useNavigate} from "react-router-dom";

const Logo = () => {
    const navigate = useNavigate();
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
        }}
             onClick={() => navigate("/user/homepage")}
        >
            <MDBIcon fas
                     icon="street-view" size="2x"
                     style={{
                         // color: '#112d60',
                         background: 'linear-gradient(to right, #112d60, #b6c0c5)',
                         WebkitBackgroundClip: 'text',
                         WebkitTextFillColor: 'transparent',
                         marginRight: '12px'
                     }} />
            <h3 style={{
                fontFamily: 'Arial, sans-serif',
                color: '#112d60',
                // marginTop: '10px'

            }}>E-park</h3>
        </div>
    )
};

export default Logo;
