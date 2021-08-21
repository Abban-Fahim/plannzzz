import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useHistory } from "react-router-dom";
import { auth } from "../firebase";
import { Calendar } from "react-calendar";
import "../styles/calender.scss";
import CalenderView from "../components/Calender-View";

const Dashboard = () => {
  const [user] = useAuthState(auth);
  const history = useHistory();
  const [selectedDate, setSelectedDate] = useState();

  //on the calender's header, show some animated weather/time of day

  useEffect(() => {
    if (!user) {
      history.push("/auth");
    }
  }, []);

  return (
    <>
      <p>Yay! you've successfully logged in 🥳</p>
      <Calendar
        calendarType="Hebrew"
        value={selectedDate}
        onChange={setSelectedDate}
      />
      <CalenderView />
    </>
  );
};

export default Dashboard;
