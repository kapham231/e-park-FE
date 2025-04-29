import React, {useEffect} from "react";
import { Card } from "antd";
import { BookTwoTone } from "@ant-design/icons";
import { motion } from "framer-motion";

const UserTerm = () => {
	useEffect(() => {
		window.scrollTo(0, 0);
	})

	return (
		<div className="min-h-screen bg-gradient-to-br from-pink-100 to-blue-100 p-6">
			{/* Upper Banner */}
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className="max-w-3xl mx-auto text-center"
			>
				<Card
					bordered={false}
					style={{
						backgroundColor: "#fff1f0",
						borderRadius: "0",
						padding: "10px",
						boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
					}}
				>
					<h1 className="text-3xl font-bold text-red-500 mb-2">
						<BookTwoTone twoToneColor="#eb2f96" /> Terms of Use
					</h1>
					<p className="text-lg text-gray-700">
						Please read carefully before using our services.
					</p>
				</Card>
			</motion.div>

			{/* Terms Content */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.3, duration: 0.6 }}
				className="max-w-4xl mx-auto"
			>
				<Card
					bordered={false}
					style={{
						backgroundColor: "#ffffff",
						borderRadius: "0",
						padding: "2rem",
						boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
					}}
				>
					<div className="space-y-6 text-gray-700 leading-relaxed text-lg">
						<section>
							<h2 className="text-2xl font-semibold text-blue-600 mb-2">1. Eligibility</h2>
							<p style={{ fontSize: "18px", textAlign: "justify" }}>
								Online booking is available only to registered account holders. If you do not have an account, you can still purchase tickets offline at our playground.
							</p>
						</section>

						<section>
							<h2 className="text-2xl font-semibold text-blue-600 mb-2">2. Booking and Payment</h2>
							<p style={{ fontSize: "18px", textAlign: "justify" }}>
								You must log in to book tickets online. Payment must be completed during booking. Event details and availability may change without notice.
							</p>
						</section>

						<section>
							<h2 className="text-2xl font-semibold text-blue-600 mb-2">3. Cancellations and Refunds</h2>
							<p style={{ fontSize: "18px", textAlign: "justify" }}>
								Cancellations is not available now. If you cannot attend, please contact us at least 24 hours in advance. Refunds are not available for no-shows or late arrivals.
							</p>
						</section>

						<section>
							<h2 className="text-2xl font-semibold text-blue-600 mb-2">4. Account Responsibility</h2>
							<p style={{ fontSize: "18px", textAlign: "justify" }}>
								You are responsible for all activities under your account. Notify us immediately if you detect unauthorized access.
							</p>
						</section>

						<section>
							<h2 className="text-2xl font-semibold text-blue-600 mb-2">5. Conduct Rules</h2>
							<p style={{ fontSize: "18px", textAlign: "justify" }}>
								Please use the website respectfully. Any attempt to disrupt services or harm others is prohibited.
							</p>
						</section>

						<section>
							<h2 className="text-2xl font-semibold text-blue-600 mb-2">6. Intellectual Property</h2>
							<p style={{ fontSize: "18px", textAlign: "justify" }}>
								All content belongs to EPark or our partners. You may not reuse any content without permission.
							</p>
						</section>

						<section>
							<h2 className="text-2xl font-semibold text-blue-600 mb-2">7. Limitation of Liability</h2>
							<p style={{ fontSize: "18px", textAlign: "justify" }}>
								We are not liable for any loss or damage resulting from using our website or participating in events.
							</p>
						</section>

						<section>
							<h2 className="text-2xl font-semibold text-blue-600 mb-2">8. Changes to Terms</h2>
							<p style={{ fontSize: "18px", textAlign: "justify" }}>
								Terms may be updated from time to time. Continued use means you agree to the latest version.
							</p>
						</section>

						<section>
							<h2 className="text-2xl font-semibold text-blue-600 mb-2">9. Contact Us</h2>
							<p style={{ fontSize: "18px", textAlign: "justify" }}>
								Have questions? Email us at <strong>epark4kids@gmail.com</strong>.
							</p>
						</section>
					</div>
				</Card>
			</motion.div>
		</div>
	);
};

export default UserTerm;
