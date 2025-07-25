import { useNavigate } from "react-router-dom";
import "../css/paymentcancel.css";
import DefaultButton from "../../components/DefaultButton";

const PaymentCancel = () => {
  const navigate = useNavigate();

  // useEffect(() => {
  //     // Quay lại trang trước đó
  //     navigate(-1); // Điều hướng về trang trước đó trong lịch sử
  // }, [navigate]);

  return (
    <div className="payment-cancel-wrapper">
      <CircleCheckIcon className="payment-cancel-icon" />
      <h2 className="payment-cancel-header">Payment Canceled</h2>
      <p className="payment-cancel-text">
        Your payment has been canceled. If you have any questions, please
        contact our support team.
      </p>
      {/* <Button
                className="back-to-homepage-button"
                type="primary"
                style={{ marginTop: "20px" }}
                onClick={() => navigate("/user/homepage")}
            >
                Back to Homepage
            </Button> */}
      <DefaultButton
        type="primary"
        style={{ marginTop: "20px" }}
        onClick={() => navigate("/user/homepage")}
      >
        Back to Homepage
      </DefaultButton>
    </div>
  );
};

function CircleCheckIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      color="red"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </svg>
  );
}

export default PaymentCancel;
