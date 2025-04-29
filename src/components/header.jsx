import React from 'react';
import {
    MDBNavbar,
    MDBContainer,
    // MDBNavbarToggler,
    // MDBCollapse,
    MDBIcon,
    MDBNavbarBrand,
} from 'mdb-react-ui-kit';

import Logo from '../logo';

const Header = ({ role }) => {
    // const [showNav, setShowNav] = React.useState(false);

    return (
        <MDBNavbar expand='lg' light bgColor='light'>
            <MDBContainer fluid>
                {/*
                    <MDBNavbarToggler
                        type='button'
                        aria-expanded='false'
                        aria-label='Toggle navigation'
                        onClick={() => setShowNav(!showNav)}
                    >
                        <MDBIcon icon='bars' fas />
                    </MDBNavbarToggler>
                */}
                {/*<MDBCollapse show={showNav} navbar>*/}
                <MDBNavbarBrand href=''>
                    <Logo />
                </MDBNavbarBrand>
                {/*</MDBCollapse>*/}

                {/* Links for Admin role */}
                {role === 'admin' && (
                    <div className="d-flex align-items-center ms-auto" style={{ marginRight: '16px' }}>
                        <MDBIcon fas icon="bell" size="lg" style={{ cursor: 'pointer' }} className="me-3" />
                        <span>Hello Admin</span>
                    </div>

                )}

                {role === 'staff' && (
                    <div className="d-flex align-items-center ms-auto" style={{ marginRight: '16px' }}>
                        <MDBIcon fas icon="bell" size="lg" style={{ cursor: 'pointer' }} className="me-3" />
                        <span>Hello Staff</span>
                    </div>
                )}

                {role === 'manager' && (
                    <div className="d-flex align-items-center ms-auto" style={{ marginRight: '16px' }}>
                        <MDBIcon fas icon="bell" size="lg" style={{ cursor: 'pointer' }} className="me-3" />
                        <span>Hello Manager</span>
                    </div>
                )}

                {/* Links for User role */}
                {/* {role === 'user' && (
                            <>
                                <MDBNavbarItem>
                                    <MDBNavbarLink href='/profile'>Profile</MDBNavbarLink>
                                </MDBNavbarItem>
                                <MDBNavbarItem>
                                    <MDBNavbarLink href='/settings'>Settings</MDBNavbarLink>
                                </MDBNavbarItem>
                            </>
                        )} */}

                {/* Links for Guest role */}

            </MDBContainer>
        </MDBNavbar >
    );
};

export default Header;
