import React from "react";
import { selectUserData, selectUserType } from "../../features/userSlice";
import { db } from "../../utils/firebase";
import { useSelector } from "react-redux";
import "./Header.css";
import { useHistory, useLocation } from "react-router";
import { useState, useEffect } from "react";

function Header(props) {
  const history = useHistory();
  const userData = useSelector(selectUserData);
  const userType = useSelector(selectUserType);
  const [pin, setPin] = useState(null);
  const Id = props.Id;
  const [name, setname] = useState(null);
  const [img, setimg] = useState(null);
  const [coachName, setCoachName] = useState("");
  const [CoachData, setCoachData] = useState(null);
  const location = useLocation();

  console.log(Id);
  useEffect(() => {
    if (userType === "coach") {
      if (props.Id) {
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
      } else {
        setimg(userData?.data.imageUrl);

        setname(userData?.data.name);
      }
    } else {
    }
  }, [userData, userType]);

  useEffect(() => {
    if (userType !== "coach") {
      // db.collection("coaches")
      //   .doc(userData?.data?.listOfCoaches[0])
      //   .get()
      //   .then(function(snap) {
      //     setCoachName(snap.data()?.name)
      //   })
      if (props.coachProfile) {
        db.collection("coaches")
          .doc(userData?.data?.listOfCoaches[0])
          .get()
          .then(function (snap) {
            setCoachData(snap.data());
            setimg(snap.data().imageUrl);
            setname(snap.data().name);
            setPin(snap.data()?.pin);
          });
      } else {
        db.collection("athletes")
          .doc(userData?.id)
          .get()
          .then(function (snap) {
            setCoachName(snap.data()?.name);
          });
      }
    }
  }, []);
  console.log(props.coachProfile);

  if (props.coachProfile) {
    return (
      <div className="header">
        <div className="coachProfile__header">
          <div className="coachProfile__img">
            <img
              className="leftarrow"
              src="/assets/left_arrow.png"
              alt=""
              onClick={() => history.push("/")}
            />
            <img
              className="image"
              src={
                img
                  ? img
                  : "https://firebasestorage.googleapis.com/v0/b/wellzap-22b06.appspot.com/o/images%2FuserImage.jpeg?alt=media&token=92ce4f61-3c75-421a-888f-df954a58c516"
              }
              alt={name && name}
              width="100px"
              height="100px"
            />
          </div>
          <div className="coachProfile__content">
            {
              userType === "coach" ? (
                <div>
                  <h1>{name && name}</h1>
                  <h2
                    style={{
                      fontSize: 15,
                    }}
                  >
                    Coach ID :{userData?.data?.pin && userData?.data?.pin}
                  </h2>
                </div>
              ) : (
                // : props.athlete ?
                <div>
                  <h1>{name && name}</h1>
                  <h2
                    style={{
                      fontSize: 15,
                    }}
                  >
                    Coach ID :{pin && pin}
                  </h2>
                </div>
              )
              // : (
              //   <h1>{coachName}</h1>
              // )
            }
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="header">
      <div className="coachProfile__header">
        <div className="coachProfile__img">
          <img
            className="leftarrow"
            src="/assets/left_arrow.png"
            alt=""
            onClick={() => {
              history.goBack();
            }}
          />
          <img
            className="image"
            src={
              userData?.data?.imageUrl
                ? userData?.data?.imageUrl
                : "https://firebasestorage.googleapis.com/v0/b/wellzap-22b06.appspot.com/o/images%2FuserImage.jpeg?alt=media&token=92ce4f61-3c75-421a-888f-df954a58c516"
            }
            alt={name ? name : userData?.data.name}
            width="100px"
            height="100px"
          />
        </div>
        <div className="coachProfile__content">
          {
            userType === "coach" ? (
              <h1>{name ? name : userData?.data.name}</h1>
            ) : (
              // : props.athlete ?
              <div>
                <h1>{userData?.data.name}1jk</h1>
              </div>
            )
            // : (
            //   <h1>{coachName}</h1>
            // )
          }
        </div>
      </div>
    </div>
  );
}

export default Header;
