import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'antd';
import '../css/customslider.css';

const CustomSlider = ({ children }) => {
	const renderItems = () => {
		return children.map((child, index) => (
			<Col key={index} xs={24} sm={12} md={8} lg={6} className="slider-item">
				{child}
			</Col>
		));
	};

	return (
		<div className="custom-slider">
			<Row gutter={[24, 24]}>
				{renderItems()}
			</Row>
		</div>
	);
};

CustomSlider.propTypes = {
	children: PropTypes.arrayOf(PropTypes.node).isRequired,
};

export default CustomSlider;