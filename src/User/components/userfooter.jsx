
import "../css/userfooter.css";
import Logo from "../../logo";
import FacebookIcon from "../../Assets/icon/facebook-icon";
import YoutubeIcon from "../../Assets/icon/youtube-icon";
import EmailIcon from "../../Assets/icon/email-icon";
import InstagramIcon from "../../Assets/icon/instagram-icon";
import { Link } from "react-router-dom";

const footerLinks = {
	facebook: "https://www.facebook.com/epark4kids",
	youtube: "https://www.youtube.com/@epark4kids",
	instagram: "https://www.instagram.com/epark4kids",
	gmail: "mailto:epark4kids@gmail.com",
}

const UserFooter = () => {
	return (
		<footer className="footer">
			<div className="wave-divider">
				<svg viewBox="0 0 1200 120" preserveAspectRatio="none">
					<path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
				</svg>
			</div>
			<div className="footer-container">
				<div className="footer-left">
					<Logo />
					<p>
						A fun place for kids to learn and play together!
					</p>
				</div>
				<div className="footer-content">
					<div className="footer-section recognition">
						<div className="footer-section-header">
							<div className="footer-section-icon">
								<img width="20" height="20" src="https://img.icons8.com/office/40/so-so.png" alt="so-so" />
							</div>
							<h3>Who we are</h3>
						</div>
						<ul>
							<li>
								<Link className="section-link" to={"/user/about-us#about-us"}>
									<div className="section-icon"></div>
									About Us
								</Link>
							</li>
							<li>
								<Link className="section-link" to={"/user/about-us#our-team"}>
									<div className="section-icon"></div>
									Our Team
								</Link>
							</li>
							<li>
								<Link className="section-link" to={"/user/about-us#our-mission"}>
									<div className="section-icon"></div>
									Our Mission
								</Link>
							</li>
							<li>
								<Link className="section-link" to={"/user/about-us#future-vision"}>
									<div className="section-icon"></div>
									Future Vision
								</Link>
							</li>
						</ul>
					</div>
					<div className="footer-section contact">
						<div className="footer-section-header">
							<div className="footer-section-icon">
								<img width="20" height="20" src="https://img.icons8.com/dusk/64/phone-disconnected.png" alt="phone-disconnected" />
							</div>
							<h3>Talk to us</h3>
						</div>
						<ul>
							<li>📍
								<a
									href="https://maps.app.goo.gl/8q6uco1LAWJvHEZS9"
									target="_blank"
									rel="noopener noreferrer"
									style={{ textDecoration: "none", color: "inherit" }}
								>
									Central E-park, Vincom Vo Van Ngan, Thu Duc, Ho Chi Minh
								</a>
							</li>
							<li>📞 1900 8888</li>
						</ul>
					</div>
					<div className="footer-section support">
						<div className="footer-section-header">
							<div className="footer-section-icon">
								<img width="20" height="20" src="https://img.icons8.com/office/40/controller.png" alt="controller" />
							</div>
							<h3>Help & fun</h3>
						</div>
						<ul>
							<li>
								<Link className="section-link" to={"/user/faq"}>
									<div className="section-icon"></div>
									FAQ
								</Link>
							</li>
							<li>
								<Link className="section-link" to={"/user/term"}>
									<div className="section-icon"></div>
									Term of Use
								</Link>
							</li>
						</ul>
					</div>
				</div>
			</div>
			<div className="footer-logo">
				<ul>
					<li>
						<a href={footerLinks.facebook} target="_blank" className="logo-link">
							<FacebookIcon />
						</a>
					</li>
					<li>
						<a href={footerLinks.youtube} target="_blank" className="logo-link">
							<YoutubeIcon />
						</a>
					</li>
					<li>
						<a href={footerLinks.gmail} className="logo-link">
							<EmailIcon />
						</a>
					</li>
					<li>
						<a href={footerLinks.instagram} target="_blank" className="logo-link">
							<InstagramIcon />
						</a>
					</li>
				</ul>
			</div>
			<div className="footer-bottom">
				<p>© E-park. Made with ❤️ for kids!</p>
			</div>
		</footer>
	)
}

export default UserFooter;