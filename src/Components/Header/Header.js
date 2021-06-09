import React from "react";
import { selectUserData } from "../../features/userSlice";
import { db } from "../../utils/firebase";
import { useSelector } from "react-redux";
import "./Header.css";
import { useHistory } from "react-router";

function Header() {
  const history = useHistory();
  const userData = useSelector(selectUserData);
  return (
    <div className="header">
      <div className="coachProfile__header">
        <div className="coachProfile__img">
          <img
            className="leftarrow"
            src="/assets/left_arrow.png"
            alt=""
            onClick={() => history.push("/profile")}
          />
          <img
            className="image"
            src={userData?.data?.imageUrl}
            alt={userData?.data.name}
            width="100px"
            height="100px"
          />
        </div>
        <div className="coachProfile__content">
          <h1>{userData?.data.name}</h1>
          <h3>Strength and Conditioning Coach</h3>
        </div>
      </div>
    </div>
  );
}

export default Header;
