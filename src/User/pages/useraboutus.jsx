import React, {useEffect} from 'react';
import { Card } from 'antd';
import { useLocation } from 'react-router-dom';

import '../css/useraboutus.css';
import aboutus1 from '../../Assets/img/aboutus1.jpg'
import aboutus2 from '../../Assets/img/aboutus2.jpg'

const teamMembers = [
    {
        name: 'Pham Anh Kiet',
        role: 'Project Leader',
        university: 'Ho Chi Minh University of Technology',
        major: 'Computer Science',
        image: 'https://i.pinimg.com/736x/d1/8c/29/d18c29bc0636c509280a896b3dd2bccc.jpg'
    },
    {
        name: 'Duong Chi Hieu',
        role: 'Full-Stack Developer',
        university: 'Ho Chi Minh University of Technology',
        major: 'Computer Science',
        image: 'https://i.pinimg.com/736x/0c/6f/39/0c6f39dac4d7f30139a7d61ee28a2ef5.jpg'
    },
    {
        name: 'Nguyen Tien Phat',
        role: 'Backend Developer & DB',
        university: 'Ho Chi Minh University of Technology',
        major: 'Computer Science',
        image: 'https://i.pinimg.com/736x/f5/29/d5/f529d5c97839e47b047ccf931eecd843.jpg'
    },
];

const AboutUs = () => {
    const location = useLocation();
    useEffect(() => {
        if (location.hash) {
            const id = location.hash.substring(1);
            setTimeout(() => {
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 0);
        }
    }, [location]);

    return (
        <div className='about-us-background'>
            <div className="about-us-container">
                <div className='about-us-section' id="about-us">
                    <h1 className="about-us-title">About Us</h1>
                    <p>
                        Welcome to our children's playground management website! This project is developed by a group of passionate technology
                        students as part of our graduation thesis. With the desire to apply our acquired knowledge to real-world scenarios, we
                        have worked together to research and develop this system, aiming to provide a modern and convenient management solution
                        for children's playgrounds.
                    </p>
                    <p>
                        Although this is a student project, we are committed to delivering an optimized, user-friendly platform that
                        effectively meets management needs. Our team consists of members with expertise in information technology, always eager
                        to learn and improve to offer the best user experience.
                    </p>
                    <p>
                        We hope that this product is not only a practical exercise but also a valuable contribution that enhances management
                        efficiency and ensures a safe, enjoyable playtime for children. Thank you for visiting and supporting our project!
                    </p>
                </div>

                <div className='about-us-section' id="our-team">
                    <h2>Our Team</h2>
                    <div className="team-container">
                        {teamMembers.map((member, index) => (
                            <div key={index} className="team-member">
                                <Card
                                    hoverable
                                    cover={<img alt={member.name} src={member.image} />}
                                >
                                    <Card.Meta
                                        title={member.name}
                                        description={
                                            <>
                                                <p><strong>{member.role}</strong></p>
                                                <p><strong>University:</strong> {member.university}</p>
                                                <p><strong>Major:</strong> {member.major}</p>
                                            </>
                                        }
                                    />
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>

                <div className='about-us-section' id="our-mission">
                    <h2>Our Mission</h2>
                    <div className="mission-container">
                        <img src={aboutus1} alt="Our Mission" className='mission-image' />
                        <div className='mission-content'>
                            <p>
                                Our objective is to develop an efficient and user-friendly children's playground management system as part of our
                                graduation project. We aim to provide an intuitive platform that helps playground administrators easily monitor and
                                manage daily operations.
                            </p>
                            <p>
                                Our mission is to apply modern technology to create a smooth, secure, and reliable system. While this is a student
                                project, we strive to deliver a practical solution that enhances management efficiency and ensures a safe and
                                enjoyable environment for children.
                            </p>
                        </div>
                    </div>
                </div>

                <div className='about-us-section' id="future-vision">
                    <h2>Future Vision</h2>
                    <div className='vision-container'>
                        <div className='vision-content'>
                            <p>
                                Although this is a graduation project, we envision the potential for further development and real-world application.
                                In the future, we hope to enhance the system by integrating more advanced features such as automated reporting,
                                real-time monitoring, and mobile accessibility.
                            </p>
                            <p>
                                We also aim to refine the platform’s performance and security, ensuring a seamless experience for users.
                                If given the opportunity, we would love to collaborate with industry professionals to expand and optimize this
                                system, making it a valuable tool for playground management on a larger scale.
                            </p>
                        </div>
                        <img src={aboutus2} alt="Our Vision" className='vision-image' />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;