import { useNavigate, useParams } from "react-router-dom";
import { Card, Button, message } from "antd";

import "../css/usereventdetail.css";
import { useEffect, useState } from "react";
import { getEvent } from "../../ApiService/playgroundmanagerApi";
import { useAuth } from "../../auth/authContext";
import Description from "../../utils/description";

const UserEventDetail = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { id } = useParams();
  const [event, setEvent] = useState({});

  // console.log(id);

  useEffect(() => {
    fetchEvents();
  }, [event]);

  const fetchEvents = async () => {
    try {
      const tempEvent = await getEvent(id);
      setEvent(tempEvent);
    } catch (error) {
      console.error("Error:", error);
      message.error("Failed to fetch events.");
    }
  };

  if (!event) {
    return <h2>Event not found for ID {id}</h2>;
  }
  const handleImageError = (e) => {
    e.target.src =
      "https://i.pinimg.com/736x/1e/8f/91/1e8f91aa672419128d45ad4a64e36c62.jpg";
  };

  return (
    <>
      <div className="us-event-detail-container">
        <Card className="us-event-detail-card">
          <h2 className="us-event-title">🎉 {event.eventTitle}</h2>

          <div className="us-event-image-container">
            <img
              src={event.backdrop}
              alt={event.eventTitle}
              className="us-event-image"
              onError={handleImageError}
            />
          </div>

          <Card className="us-event-description-card mt-4">
            {event.eventDescription ? (
              <Description text={event.eventDescription} />
            ) : (
              <p>Loading description...</p> // hoặc để trống
            )}
          </Card>

          <Card className="us-event-info-card mt-4">
            <p>
              📅 <strong>Started date: </strong>
              {event.startDate}
            </p>
            <p>
              📅 <strong>Ended date: </strong>
              {event.endDate}
            </p>
            {/* <p>📍 <strong>Location: </strong>{event.location}</p> */}
          </Card>

          <Button
            ype="default"
            danger
            style={{
              marginTop: "16px",
              fontSize: "16px",
              padding: "10px 20px",
            }}
            // className="register-button mt-2"
            onClick={() => {
              navigate(-1);
            }}
          >
            Back to previous page
          </Button>
        </Card>
      </div>
    </>
  );
};

export default UserEventDetail;
