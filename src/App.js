import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Switch, Route, useHistory } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import LandingPage from "./pages/LandingPage";
import { auth } from "./firebase";
import CreateTask from "./pages/CreateTask";

function App() {
  const history = useHistory();
  const [user] = useAuthState(auth);

  return (
    <Switch>
      <Route path="/new/:type" children={<CreateTask />} />
      <Route path="/dashboard" children={<Dashboard />} />
      <Route path="/auth" children={<AuthPage />} />
      <Route path="/" children={<LandingPage />} />
    </Switch>
  );
}

export default App;
