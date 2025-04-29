import React, { useState } from "react";
import {
	MDBBtn,
	MDBContainer,
	MDBRow,
	MDBCol,
	MDBCard,
	MDBCardBody,
	MDBInput,
	MDBCheckbox,
}
	from 'mdb-react-ui-kit';
import Logo from "../../logo";

import { useAuth } from "../../auth/authContext";

import '../css/adminlogin.css';
// import { UserLogin } from "../../ApiService/GeneralApiService";

function AdminLogin() {
	// const navigate = useNavigate();
	const auth = useAuth();
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [rememberMe, setRememberMe] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	const handleLogin = async () => {
		auth.loginAction({
			username: username,
			password: password,
			remember: rememberMe,
		}, (errorMessage) => handleError(errorMessage))
	}

	const handleError = (errorMessage) => {
		setErrorMessage(errorMessage);
	}

	return (
		<MDBContainer fluid className='p-4 background-radial-gradient overflow-hidden full-height'>

			<MDBRow>

				<MDBCol md='6' className='text-center text-md-start d-flex flex-column justify-content-center'>

					<h1 className="my-5 display-3 fw-bold ls-tight px-3" style={{ color: 'hsl(218, 81%, 95%)' }}>
						Welcome back ! <br />
						<span style={{ color: 'hsl(218, 81%, 75%)' }}>Operators</span>
					</h1>

					<p className='px-3' style={{ color: 'hsl(218, 81%, 85%)', textAlign: 'justify' }}>
						You play a crucial role in ensuring the efficient management and security of the platform.
						The admin is responsible for creating and managing user accounts.
						This includes setting up new users, assigning permissions, and overseeing user activities to ensure the system
						runs smoothly and securely.
					</p>

				</MDBCol>

				<MDBCol md='6' className='position-relative'>

					<div id="radius-shape-1" className="position-absolute rounded-circle shadow-5-strong"></div>
					<div id="radius-shape-2" className="position-absolute shadow-5-strong"></div>

					<MDBCard className='my-5 bg-glass'>
						<MDBCardBody className='p-5'>
							<div className='operator-logo mb-4'>
								<Logo />
							</div>

							{/* Form giúp kích hoạt login khi nhấn Enter */}
							<form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
								<MDBInput
									wrapperClass='mb-4'
									label='Username'
									id='form1'
									type='text'
									value={username}
									onChange={(e) => setUsername(e.target.value)}
									style={{ marginTop: '12px' }}
								/>
								<MDBInput
									wrapperClass='mb-4'
									label='Password'
									id='form2'
									type='password'
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>

								{errorMessage && (
									<div className="w-full mb-4 note note-danger mb-3 text-danger">{errorMessage}</div>
								)}

								<div className='d-flex justify-content-center mb-4'>
									<MDBCheckbox name='rememberMe' value={rememberMe} id='rememberMe' label='Remember me' onChange={() => { setRememberMe(!rememberMe); } } />
								</div>

								{/* Nút login với type="submit" để Enter hoạt động */}
								<MDBBtn type='submit' className='w-100 mb-4' size='md'>Login</MDBBtn>
							</form>
						</MDBCardBody>

					</MDBCard>

				</MDBCol>

			</MDBRow>

		</MDBContainer >
	);
}

export default AdminLogin;