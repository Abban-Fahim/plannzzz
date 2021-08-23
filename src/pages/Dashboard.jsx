import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import Link from "react-router-dom/Link";
import { useHistory } from "react-router-dom";
import { auth } from "../firebase";
import "../styles/calender.scss";
import CalenderView from "../components/Calender-View";
import DropdownButton from "react-bootstrap/DropdownButton";
import DropdownItem from "react-bootstrap/DropdownItem";

const Dashboard = () => {
  const [user, loadingUser, err] = useAuthState(auth);
  const history = useHistory();
  if (loadingUser) {
    return <div>Loading...</div>;
  }

  if (user) {
    return (
      <>
        <p>Yay! you've successfully logged in 🥳</p>
        <button
          className="btn btn-secondary"
          onClick={() =>
            auth
              .signOut()
              .then(() => history.push("/auth"))
              .catch((err) => console.error(err))
          }
        >
          Sign Out
        </button>
        <DropdownButton title="Create">
          <DropdownItem>
            <Link to="/new/assignment" className="dropdown-item">
              Assignment
            </Link>
          </DropdownItem>
          <DropdownItem>
            <Link to="/new/task" className="dropdown-item">
              Task
            </Link>
          </DropdownItem>
          <DropdownItem>
            <Link to="/new/event" className="dropdown-item">
              Event
            </Link>
          </DropdownItem>
        </DropdownButton>
        <CalenderView user={user} />
      </>
    );
  }

  if (!user) {
    history.push("/auth");
  }

  if (err) {
    console.error(err);
  }

  //on the calender's header, show some animated weather/time of day
};

export default Dashboard;
