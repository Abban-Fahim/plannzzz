import React from "react";
import { auth } from "../firebase";
import firebase from "firebase/app";
import { useHistory } from "react-router-dom";

const AuthPage = () => {
  const history = useHistory();

  if (auth.currentUser) history.push("/dashboard");

  return (
    <button
      className="btn btn-primary"
      onClick={() => {
        auth
          .signInWithPopup(new firebase.auth.GoogleAuthProvider())
          .then(() => {
            history.push("/dashboard");
          })
          .catch((err) => console.error(err));
      }}
    >
      Google
    </button>
  );
};

export default AuthPage;
