import React, { useEffect, useState } from "react";
import moment from "moment";
import { db } from "../../utils/firebase";
import { useDispatch, useSelector } from "react-redux";
import {
  selectUser,
  selectUserData,
  selectUserType,
  setUserData,
} from "../../features/userSlice";
import firebase from "firebase";

function EventInfo(props) {
  const userData = useSelector(selectUserData);
  const userType = useSelector(selectUserType);
  const [data, setData] = useState(props.data);
  const [athletes, setAthletes] = useState([]);
  const [athletesData, setAthletesData] = useState([]);

  const deleteEvent = () => {
    db.collection("events").doc(data.id).delete();
    alert("Event Deleted");
    props.setsidebarfunc("CreateEvent");
    props.setAddedEventFunc();
  };

  useEffect(() => {
    var tempData = [];
    var temp = [];
    db.collection("athletes")
      .get()
      .then((snap) => {
        snap.forEach((doc) => {
          if (data.athletes.includes(doc.id)) {
            tempData.push({
              id: doc.id,
              ...doc.data(),
            });
          }
        });
        setAthletesData(tempData);
        tempData.forEach((doc) => {
          temp.push(
            <div style={{ flexDirection: "row", alignItems: "center" }}>
              <div
                key={doc.id}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  paddingLeft: 10,
                  backgroundColor: "#ffe486",
                  borderRadius: 30,
                  marginTop: 10,
                  width: "fit-content",
                }}
              >
                <img
                  src={doc.imageUrl}
                  style={{
                    backgroundColor: "gray",
                    width: 25,
                    height: 25,
                    borderRadius: 100,
                    marginRight: 20,
                  }}
                />
                <p
                  style={{
                    fontWeight: "bold",
                    fontSize: 14,
                    color: "black",
                    marginRight: 20,
                  }}
                >
                  {doc?.name}
                </p>
              </div>
              {userType == "coach" &&
              data.attendance &&
              data.attendance.includes(doc.id) ? (
                <i
                  name="check"
                  type="font-awesome-5"
                  color="black"
                  style={{ marginLeft: 20 }}
                />
              ) : null}
            </div>
          );
        });
        setAthletes(temp);
      });
  }, []);

  return (
    <div>
      <div style={{ flex: 9, paddingTop: 20 }}>
        <div style={{ backgroundColor: "white", borderRadius: 10 }}>
          <p
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "black",
              margin: 0,
              padding: 0,
            }}
          >
            {data.eventName}
          </p>
          <div
            style={{
              backgroundColor: "#ffe486",
              padding: 5,
              borderRadius: 5,
              marginVertical: 15,
              marginTop: 5,
              alignSelf: "flex-start",
              width: "55%",
            }}
          >
            {moment(data.eventDate).format("llll")}
          </div>
          {data?.showVideoLink ? (
            <div
              style={{ marginTop: 10 }}
              disabled={
                moment(new Date()).valueOf() > data.eventDate - 60000 * 20 &&
                moment(
                  moment(data.eventDate).add(1, "days").format("DD-MM-YYYY"),
                  "DD-MM-YYYY"
                ).valueOf() > moment(new Date()).valueOf()
                  ? false
                  : true
              }
            >
              <p
                style={{
                  fontSize: 16,
                  color: "#006D77",
                  padding: 0,
                  margin: 0,
                }}
              >
                {data?.videolink}
              </p>
            </div>
          ) : null}
        </div>
        <div
          style={{ borderRadius: 10, backgroundColor: "white", marginTop: 0 }}
        >
          <p
            style={{
              fontWeight: "bold",
              color: "black",
              fontSize: 18,
              margin: 0,
              padding: 0,
              marginTop: 20,
            }}
          >
            Description
          </p>
          <p style={{ marginTop: 10, margin: 0, padding: 0 }}>
            {data.description}
          </p>
        </div>

        <div
          style={{
            borderRadius: 10,
            backgroundColor: "white",
            marginTop: 20,
            paddingBottom: 20,
          }}
        >
          <p
            style={{
              fontWeight: "bold",
              color: "black",
              fontSize: 18,
              margin: 0,
            }}
          >
            Athletes
          </p>
          {athletes}
        </div>
      </div>
      {userType == "coach" && data.eventDate > moment(new Date()).valueOf() ? (
        <div
          style={{
            flex: 1,
            flexDirection: "row",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            backgroundColor: "white",
            marginTop: 40,
          }}
        >
          <div
            onClick={() => deleteEvent()}
            style={{
              cursor: "pointer",
              display: "flex",
              padding: 7,
              backgroundColor: "#ffe486",
              borderRadius: 6,
              minWidth: "30%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-around",
            }}
          >
            <p
              style={{
                fontWeight: "bold",
                textAlign: "center",
                color: "black",
                margin: 0,
              }}
            >
              DELETE EVENT{" "}
            </p>
            <i class="fa fa-times" style={{ fontSize: 10, marginRight: 8 }}></i>
          </div>
          <div
            onClick={() => {
              props.setTempEventFunc({
                id: data.id,
                data: data,
                athletes: data.athletes,
              });
              props.setsidebarfunc("CreateEvent");
            }}
            style={{
              cursor: "pointer",
              display: "flex",
              padding: 7,
              backgroundColor: "#ffe486",
              borderRadius: 6,
              minWidth: "20%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-around",
            }}
          >
            <p
              style={{
                fontWeight: "bold",
                textAlign: "center",
                color: "black",
                margin: 0,
              }}
            >
              EDIT{" "}
            </p>
            <i class="fa fa-pen" style={{ fontSize: 10, marginRight: 8 }}></i>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default EventInfo;
