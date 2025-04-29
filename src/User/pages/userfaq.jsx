import React, {useEffect} from "react";
import {Collapse, Card} from "antd";
import {SmileTwoTone, QuestionCircleTwoTone} from "@ant-design/icons";
import {motion} from "framer-motion";

const {Panel} = Collapse;
const UserFAQ = () => {
	useEffect(() => {
		window.scrollTo(0, 0);
	})

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-100 to-pink-100 p-6">
			<motion.div
				initial={{opacity: 0, y: -20}}
				animate={{opacity: 1, y: 0}}
				transition={{duration: 0.6}}
				className="max-w-3xl mx-auto text-center"
			>
				<Card
					bordered={false}
					style={{
						backgroundColor: "#fffbe6",
						borderRadius: "0",
						padding: "10px",
						boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
					}}
				>
					<h1 className="text-3xl font-bold mb-2 text-yellow-500">
						🎉 FAQ 🎉
					</h1>
					<p className="text-lg text-gray-700">
						Discover fun activities and book your next adventure easily!
					</p>
				</Card>
			</motion.div>

			{/* FAQ Section */}
			<motion.div
				initial={{opacity: 0}}
				animate={{opacity: 1}}
				transition={{delay: 0.3, duration: 0.6}}
				className="max-w-2xl mx-auto mb-6 p-4"
			>
				<Collapse
					accordion
					bordered={false}
					style={{
						backgroundColor: "transparent",
					}}
					expandIconPosition="right"
					ghost
				>
					<Panel
						header={
							<span className="text-xxl font-semibold text-blue-600">
                                <QuestionCircleTwoTone twoToneColor="#52c41a"/> What is EPark?
							</span>
						}
						key="1"
					>
						<p className="text-gray-700">
							EPark is an exciting place where kids can join fun events and activities! You
							can view upcoming events and book tickets online easily.
						</p>
					</Panel>

					<Panel
						header={
							<span className="text-xxl font-semibold text-blue-600">
								<QuestionCircleTwoTone twoToneColor="#eb2f96"/> How can I book a ticket?
							</span>
						}
						key="2"
					>
						<p className="text-gray-700">
							You can book a ticket online if you have an account with us. Simply log in, click "Book Ticket" button on header to reserve your spot.
						</p>

						<p className="text-gray-700">
							If you don’t have an account yet, you can visit us in person to buy tickets offline at the playground entrance and create account if you want.
						</p>
					</Panel>

					<Panel
						header={
							<span className="text-xxl font-semibold text-blue-600">
                                <QuestionCircleTwoTone twoToneColor="#13c2c2"/> What if I need to cancel?
                            </span>
						}
						key="3"
					>
						<p className="text-gray-700">
							Cancellation policies is not available yet. Please check our website for updates.
						</p>
					</Panel>

					<Panel
						header={
							<span className="text-xxl font-semibold text-blue-600">
                                <QuestionCircleTwoTone twoToneColor="#fa8c16"/> Who can participate?
                            </span>
						}
						key="4"
					>
						<p className="text-gray-700">
							Everyone is welcome! Some events may have age recommendations, which are mentioned in the
							event details.
						</p>
					</Panel>
				</Collapse>
			</motion.div>
		</div>
	);
};

export default UserFAQ;
