import { Button } from "antd";
import Logo from "../logo";
import { useNavigate } from 'react-router-dom';
import { SafetyOutlined, UserOutlined, SmileOutlined } from "@ant-design/icons";
import "./welcome.css"; // Tạo file CSS riêng cho style

const WelcomePage = () => {
    const navigate = useNavigate();
    return (
        <div className="welcome-container">
            <div className="welcome-content">
                {/*<div className="welcome-text">*/}
                <div className="welcome-logo">
                    <Logo />
                </div>

                {/*    <h1>WELCOME TO <span className="highlight">E-Park</span></h1>*/}
                {/*    <p>*/}
                {/*        Your role is ?*/}
                {/*    </p>*/}
                {/*    <div className="button-group">*/}
                {/*        <Button*/}
                {/*            type="default"*/}
                {/*            size="large"*/}
                {/*            className="operator-button"*/}
                {/*            onClick={() => window.location.href = '/operator/login'}*/}
                {/*        >*/}
                {/*            Operator*/}
                {/*        </Button>*/}
                {/*        <Button*/}
                {/*            type="default"*/}
                {/*            size="large"*/}
                {/*            className="user-button"*/}
                {/*            onClick={() => window.location.href = '/user/login'}*/}
                {/*        >*/}
                {/*            User*/}
                {/*        </Button>*/}
                {/*    </div>*/}
                {/*</div>*/}
                {/*<div className="welcome-image">*/}
                {/*    <img*/}
                {/*        src="https://i.pinimg.com/736x/b2/91/b8/b291b84bc88f1af1aedc00174a50f83d.jpg"*/}
                {/*        alt="Welcome"*/}
                {/*    />*/}
                {/*</div>*/}
                <div className="welcome-modal">
                    <h1>WELCOME TO <span className="highlight">E-Park</span></h1>
                    <p>
                        You are a/an ?
                    </p>
                    <div className="button-group">
                        <Button
                            type="default"
                            size="large"
                            className="operator-button"
                            onClick={() => navigate("/operator/login")}
                        >
                            Operator
                            <SafetyOutlined />
                        </Button>
                        <Button
                            type="default"
                            size="large"
                            className="user-button"
                            onClick={() => navigate("/user/login")}
                        >
                            User
                            <UserOutlined />
                        </Button>
                        <Button
                            type="default"
                            size="large"
                            className="guest-button"
                            onClick={() => {
                                localStorage.setItem("isGuest", "1");
                                navigate("/user/homepage");
                            }}
                        >
                            Guest
                            <SmileOutlined />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WelcomePage;
