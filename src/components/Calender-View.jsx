import React, { useEffect, useState } from "react";
import moment from "moment";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../firebase";
import TaskIcon from "./TaskIcon";

const CalenderView = ({ user }) => {
  const [value, setValue] = useState(moment());
  const [calender, setCalender] = useState([]);
  const startDay = value.clone().startOf("month").startOf("week");
  const endDay = value.clone().endOf("month").endOf("week");
  const daysOfTheWeek = [];

  for (let i = 0; i < 7; i++) {
    daysOfTheWeek.push(value.clone().weekday(i).format("dddd"));
  }

  useEffect(() => {
    const a = [];
    const day = startDay.clone().subtract(1, "day");
    while (day.isBefore(endDay, "day")) {
      a.push(
        Array(7)
          .fill(0)
          .map(() => day.add(1, "day").clone())
      );
    }
    setCalender(a);
  }, [value]);

  const userRef = db.collection("users").doc(user.uid);
  const [assignments, a_loading] = useCollection(
    userRef.collection("assignments")
  );
  const [events, e_loading] = useCollection(userRef.collection("events"));
  const [tasks, t_loading] = useCollection(userRef.collection("tasks"));

  function changeMonth(e) {
    setValue(value.clone()[e.target.name](1, "month"));
  }

  function keyDownHandler(e) {
    if (e.key === "ArrowLeft") setValue(value.clone().subtract(1, "month"));
    if (e.key === "ArrowRight") setValue(value.clone().add(1, "month"));
  }

  return (
    <>
      <div id="calender" onKeyDown={keyDownHandler}>
        <div id="calender-header">
          <button
            className="btn btn-primary"
            name="subtract"
            onClick={changeMonth}
          >
            {"<"}
          </button>
          <h3>
            {value.format("MMMM")} - {value.format("YYYY")}
          </h3>
          <button className="btn btn-primary" name="add" onClick={changeMonth}>
            {">"}
          </button>
        </div>
        <div id="calender-body">
          {daysOfTheWeek.map((name) => (
            <div key={name} className="grid-item grid-header">
              {name.slice(0, 1)}
            </div>
          ))}
          {calender.map((week) => {
            return week.map((day) => {
              // console.log();
              return (
                <div
                  className={`grid-item 
                ${
                  day.format("D M Y") === moment().format("D M Y")
                    ? "today"
                    : day.format("M") !== value.format("M")
                    ? "not-in-month"
                    : ""
                } ${
                    day.format("e") === "5" || day.format("e") === "6"
                      ? "weekend"
                      : ""
                  }`}
                  key={day.format("D")}
                >
                  <p>{day.format("D")}</p>
                  {assignments &&
                    assignments.docs.map((doc) => {
                      let data = doc.data();
                      if (data.assigned === day.format("YYYY-M-D")) {
                        return <TaskIcon {...data} type="assignment" />;
                      }
                    })}
                  {tasks &&
                    tasks.docs.map((doc) => {
                      let data = doc.data();
                      if (data.assigned === day.format("YYYY-M-D")) {
                        return <TaskIcon {...data} type="task" />;
                      }
                    })}
                  {events &&
                    events.docs.map((doc) => {
                      let data = doc.data();
                      if (data.assigned === day.format("YYYY-M-D")) {
                        return <TaskIcon {...data} type="event" />;
                      }
                    })}
                </div>
              );
            });
          })}
        </div>
      </div>
    </>
  );
};

export default CalenderView;
