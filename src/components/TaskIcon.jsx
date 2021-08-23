import React from "react";

const TaskIcon = ({ type, name, due, assigned }) => {
  function color() {
    if (type === "assignment") return "primary";
    if (type === "task") return "success";
    if (type === "event") return "warning";
  }

  return (
    <button
      className={`btn btn-${color()}`}
      onClick={() => alert(name)}
    ></button>
  );
};

export default TaskIcon;
