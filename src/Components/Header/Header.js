import React from "react";
import { selectUserData, selectUserType } from "../../features/userSlice";
import { db } from "../../utils/firebase";
import { useSelector } from "react-redux";
import "./Header.css";
import { useHistory } from "react-router";
import { useState, useEffect } from "react";

function Header(props) {
  const history = useHistory();
  const userData = useSelector(selectUserData);
  const userType = useSelector(selectUserType);
  const Id = props.Id;
  const [name, setname] = useState(null);
  const [img, setimg] = useState(null);

  useEffect(() => {
    if (Id) {
      if (userType === "coach") {
        db.collection("athletes")
          .doc(Id ? Id : "1")
          .get()
          .then(function (snap) {
            console.log("snap", snap.data());
            setimg(snap.data().imageUrl);
            setname(snap.data().name);
          })
          .catch(function (error) {
            console.log("Error getting documents: ", error);
          });
      }
    }
  }, [userData, userType]);

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
            src={img ? img : userData?.data?.imageUrl}
            alt={name ? name : userData?.data.name}
            width="100px"
            height="100px"
          />
        </div>
        <div className="coachProfile__content">
          <h1>{name ? name : userData?.data.name}</h1>
          <h3>Strength and Conditioning Coach</h3>
        </div>
      </div>
    </div>
  );
}

export default Header;
