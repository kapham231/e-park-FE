// useIsMobile.js
import { useState, useEffect } from 'react';

const useCheckMobile = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize); // Corrected here
        };
    }, []);

    return isMobile;
};

export default useCheckMobile;
