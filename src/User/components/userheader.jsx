import React, { useState } from 'react';
import Logo from '../../logo';
import '../css/userheader.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from "../../auth/authContext";
import { Button, Divider, Dropdown, Space, Tag } from "antd";
import {
    MDBNavbar,
    MDBContainer,
    MDBNavbarBrand,
    MDBNavbarToggler,
} from 'mdb-react-ui-kit';
import useCheckMobile from "../../hooks/useCheckMobile";
import DefaultButton from "../../components/DefaultButton";

const UserHeader = () => {
    const isMobile = useCheckMobile();
    const location = useLocation();
    const [showNav, setShowNav] = useState(false);
    const auth = useAuth();
    const isAuth = auth?.user;
    const navigate = useNavigate();
    const activeTab = location.pathname.startsWith('/user/event') ? '/user/event' : location.pathname;
    const membershipTier = auth?.user?.cardType || "Silver";
    const loyaltyPoints = auth?.user?.loyaltyPoints || 0;

    const navMenuItems = [
        { key: 'homepage', label: <Link to="/user/homepage">Homepage</Link> },
        { key: 'event', label: <Link to="/user/event">Event</Link> },
        { key: 'about-us', label: <Link to="/user/about-us">About Us</Link> },
    ];

    return (
        <>
            <MDBNavbar expand='md' light bgColor='light' fixed>
                <MDBContainer fluid className='d-flex justify-content-space-between flex-nowrap'>
                    {!isMobile ? (
                        <MDBNavbarBrand className="d-md-block">
                            <Logo />
                        </MDBNavbarBrand>
                    ) : null}

                    {/* Desktop: Toggler if you want to keep it for md and up (optional) */}
                    <div className="d-md-none" style={{ width: "min-content" }}>
                        <Dropdown
                            menu={{ items: navMenuItems }}
                            placement="bottom"
                            trigger={['click']}
                            arrow
                        >
                            <MDBNavbarToggler
                                className="d-md-block"
                                aria-controls='navbarExample01'
                                aria-expanded={showNav}
                                aria-label='Toggle navigation'
                                onClick={() => setShowNav(!showNav)}
                            >
                                <i className="fas fa-bars" />
                            </MDBNavbarToggler>
                        </Dropdown>
                    </div>

                    {/* Desktop: Flex row nav links */}
                    <div className="d-none d-md-flex flex-row ms-3" style={{ gap: '24px', flexGrow: 1, paddingLeft: '36px' }}>
                        <Link
                            to="/user/homepage"
                            className={`nav-link ${activeTab === '/user/homepage' ? 'us-active-link' : ''}`}>
                            Homepage
                        </Link>
                        <Link
                            to="/user/event"
                            className={`nav-link ${activeTab === '/user/event' ? 'us-active-link' : ''}`}>
                            Event
                        </Link>
                        <Link
                            to="/user/about-us"
                            className={`nav-link ${activeTab === '/user/about-us' ? 'us-active-link' : ''}`}>
                            About Us
                        </Link>
                    </div>

                    {!!isAuth && (
                        <Space style={{ fontWeight: 'bold', marginRight: '8px', flex: isMobile ? '1' : '0' }}>
                            {/*<Button*/}
                            {/*    color="cyan"*/}
                            {/*    variant="solid"*/}
                            {/*    size="large"*/}
                            {/*    onClick={() => navigate("/user/register", { state: { user: auth?.user } })}*/}
                            {/*>*/}
                            {/*    Book Ticket*/}
                            {/*</Button>*/}
                            <DefaultButton
                                type="cyan"
                                size="sm"
                                onClick={() => navigate("/user/register", { state: { user: auth?.user } })}
                            >
                                Book Ticket
                            </DefaultButton>
                        </Space>
                    )}

                    {!!isAuth ? (
                        <>
                            <Tag color={
                                membershipTier === "Gold"
                                    ? "gold"
                                    : membershipTier === "Platinum"
                                        ? "cyan" // Màu cho Platinum
                                        : "silver"
                            } style={{ marginLeft: "8px", marginInlineEnd: 0 }}>
                                {membershipTier}
                            </Tag>
                            <Divider type="vertical" />
                            <Tag color="green" style={{ marginRight: "8px" }}>
                                {loyaltyPoints} Points
                            </Tag>
                        </>
                    ) : null}

                    <Dropdown
                        menu={{
                            items: [
                                {
                                    key: '1',
                                    label: (
                                        <Button onClick={() => auth.logOut()} type="text" style={{ color: 'red' }}>
                                            Log out
                                        </Button>
                                    ),
                                },
                            ],
                        }}
                        placement="bottomLeft"
                    >
                        <div className="d-flex align-items-center">
                            {!!isAuth ? <i className="fas fa-bell me-3" size="lg" style={{ cursor: 'pointer' }} /> : null}
                            <span style={{ whiteSpace: 'nowrap' }}>
                                {!!isAuth ? (
                                    <>
                                        Hello {auth?.user?.lastName}
                                    </>
                                ) : (
                                    'Hello Guest'
                                )}
                            </span>
                        </div>
                    </Dropdown>
                </MDBContainer>
            </MDBNavbar >
        </>
    );
};

export default UserHeader;
