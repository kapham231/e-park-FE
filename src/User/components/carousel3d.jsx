import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../css/carousel3d.css';

const Carousel3D = ({ images }) => {
	const settings = {
		dots: true,
		infinite: true,
		cssEase: "linear",
		autoplaySpeed: 3000,
		autoplay: true,
		speed: 500,
		accessibility: true,
		arrows: true,
		focusOnSelect: true,
		slidesToShow: 1,
		slidesToScroll: 1,
		adaptiveHeight: true,
		centerMode: true,
		centerPadding: '30%', // Adjust padding to ensure left and right images are visible
		className: 'carousel-3d',
	};

	return (
		<Slider {...settings}>
			{images.map((image, index) => (
				<div key={index} className="carousel-3d-slide">
					<img src={image} alt={`Slide ${index}`} />
				</div>
			))}
		</Slider>
	);
};

export default Carousel3D;