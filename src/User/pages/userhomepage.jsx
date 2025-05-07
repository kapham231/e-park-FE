import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import UserHeader from "../components/userheader";
import UserEventContent from "../components/usereventcontent";
import UserProfileContent from "../components/userprofilecontent";
import UserHistoryContent from "../components/userhistorycontent";
import UserHomepageContent from "../components/userhomepagecontent";
import UserEventDetail from "./usereventdetail";
import UserRegister from "./userregister";
import UserPayment from "./userpayment";
import AboutUs from "./useraboutus";
import UserFooter from "../components/userfooter";
import PaymentCancel from "./paymentcancel";
import PaymentSuccess from "./paymentsuccess";
import UserFAQ from "./userfaq";
import UserTerm from "./userterm";
// import PaymentSuccess from "./paymentsuccess";

const UserHomepage = () => {
    // console.log(user);

    // console.log(isGuest);

    return (
        <>
            <UserHeader />

            {/* <div className="mt-4"> */}
            <Routes>
                <Route path="homepage" element={<UserHomepageContent />} />
                <Route path="event" element={<UserEventContent />} />
                <Route path="about-us" element={<AboutUs />} />
                <Route path="profile" element={<UserProfileContent />} />
                <Route path="history" element={<UserHistoryContent />} />
                <Route path="register" element={<UserRegister />} />
                <Route path="event/:id" element={<UserEventDetail />} />
                <Route path="register/payment" element={<UserPayment />} />
                <Route path="payment/cancel" element={<PaymentCancel />} />
                <Route path="payment/success" element={<PaymentSuccess />} />
                <Route path="faq" element={<UserFAQ />} />
                <Route path="term" element={<UserTerm />} />
                <Route path="*" element={<Navigate to="homepage" />} /> {/* Mặc định chuyển đến Homepage */}
            </Routes>
            {/* </div> */}

            <UserFooter />
        </>
    );
};

export default UserHomepage;
