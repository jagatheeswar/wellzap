import React, { useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, selectUser } from "./features/userSlice";
import { auth } from "./utils/firebase";
import Login from "./pages/Login/Login";

function App() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) console.log(user);
      // dispatch(login({
      //   displayName: user.displayName,
      //   email: user.email,
      //   photoURL: user.photoURL
      // }))
    });
  }, []);

  return (
    <Router>
      {!user ? (
        <Login />
      ) : (
        <div className="app">
          <h1>App</h1>
        </div>
      )}
    </Router>
  );
}

export default App;
