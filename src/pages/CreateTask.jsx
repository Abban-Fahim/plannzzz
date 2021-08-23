import React, { useEffect } from "react";
import { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import DropdownButton from "react-bootstrap/DropdownButton";
import DropdownItem from "react-bootstrap/DropdownItem";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Calendar } from "react-calendar";
import { useCollection } from "react-firebase-hooks/firestore";

const CreateTask = () => {
  const [{ type }, setType] = useState(useParams());
  const history = useHistory();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [user, u_loading] = useAuthState(auth);
  const [taskName, setTaskName] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [dates, setDates] = useState({ due: "", assigned: "" });
  const [err, setErr] = useState("");
  const [userRef, setUserRef] = useState();
  const [assignments, a_loading] = useCollection(
    userRef && userRef.collection("assignments")
  );
  const [events, e_loading] = useCollection(
    userRef && userRef.collection("events")
  );
  const [tasks, t_loading] = useCollection(
    userRef && userRef.collection("tasks")
  );

  useEffect(() => {
    if (!u_loading) {
      setUserRef(db.collection("users").doc(user.uid));
    }
  }, []);

  if (!(e_loading && t_loading && a_loading)) {
    function createTask(e) {
      e.preventDefault();
      // console.log(type);
      userRef
        .collection(type + "s")
        .add({ ...dates, name: taskName, desc: taskDesc })
        .then(() => history.push("/dashboard"))
        .catch((err) => console.error(err));
    }

    function retrunFormattedDate(date) {
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    }

    let tries = 0;
    function configureDates() {
      let arrayOfTasks = [];
      assignments.docs.map((doc) => {
        let { assigned } = doc.data();
        if (doc.exists) arrayOfTasks.push(assigned);
      });
      tasks.docs.map((doc) => {
        let { assigned } = doc.data();
        if (doc.exists) arrayOfTasks.push(assigned);
      });
      events.docs.map((doc) => {
        let { assigned } = doc.data();
        if (doc.exists) arrayOfTasks.push(assigned);
      });
      if (selectedDate <= new Date().setHours(0, 0, 0, 0)) {
        setErr("Assigned date must be after today!");
      } else {
        setErr("");
        let today = new Date(new Date().setHours(0, 0, 0, 0));
        let diff =
          (selectedDate.getTime() - today.getTime()) / (1000 * 3600 * 24);
        let randomDays = Math.floor(Math.random() * diff);
        // extra logic for assigning date
        // 1. Dont assign to the same day
        if (randomDays < 1) {
          randomDays++;
        }
        // 2. if due is tommorow, assign the day to today
        if (diff === 1) {
          randomDays = 0;
        }
        let randomAssignedDate = new Date(
          today.getTime() + randomDays * 1000 * 3600 * 24
        );
        // 3. Dont assign on fridays 😊
        if (randomAssignedDate.getDay() === 5) {
          console.log(randomAssignedDate, "friday!");
          configureDates();
        } else if (
          // 4. Dont assign on day already assigned
          tries < 15 &&
          arrayOfTasks.includes(retrunFormattedDate(randomAssignedDate))
        ) {
          console.log(randomAssignedDate, "already assigned");
          tries++;
          configureDates();
        } else {
          tries = 0;
          console.log(arrayOfTasks, "made IT!");
          setDates({
            due: retrunFormattedDate(selectedDate),
            assigned: retrunFormattedDate(randomAssignedDate),
          });
        }
      }
    }

    function changeType(e) {
      e.preventDefault();
      setType({ type: e.target.name });
    }
    const types = ["Assignment", "Task", "Event"];
    return (
      <form onSubmit={createTask}>
        <div id="err">{err}</div>
        <DropdownButton
          title={type.slice(0, 1).toUpperCase() + type.slice(1, type.length)}
        >
          {types.map((type) => {
            return (
              <DropdownItem
                as="button"
                name={type.toLowerCase()}
                onClick={changeType}
              >
                {type}
              </DropdownItem>
            );
          })}
        </DropdownButton>
        <Calendar
          calendarType="Hebrew"
          value={selectedDate}
          onChange={setSelectedDate}
        />
        <p>Assigned: {dates.assigned}</p>
        <p>Due: {dates.due}</p>
        <button type="button" onClick={configureDates}>
          Confirm date
        </button>
        <label htmlFor="task-name">Enter name for task</label>
        <input
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          type="text"
          name="task-name"
        />
        <label htmlFor="task-description">Description for task</label>
        <textarea
          value={taskDesc}
          onChange={(e) => setTaskDesc(e.target.value)}
          type="text"
          name="task-description"
        />
        <button
          type="submit"
          onSubmit={createTask}
          onClick={createTask}
          className="btn btn-primary"
        >
          Create {type}
        </button>
      </form>
    );
  } else {
    return <p>Loading...</p>;
  }
};

export default CreateTask;
