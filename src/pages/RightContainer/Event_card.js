import React from "react";
import moment from "moment";
import { db } from "../../utils/firebase";
import { useDispatch, useSelector } from "react-redux";
import {
  selectUser,
  selectUserData,
  selectUserType,
  setUserData,
} from "../../features/userSlice";
import firebase from "firebase"


function Event_card(props) {
  const userData = useSelector(selectUserData);
  const userType = useSelector(selectUserType);
  var events = props.data;
  let eventslength = events.length;

  if (events.length > props.count) {
    var events = events.slice(0, props.count);
  }

  return (
    <div>
      {events.map((item) => {
        return (
          <div key={item.id} style={{}}>
            <div
              className=""
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 10,
                width: 300,
              }}
            >
              <div
                style={{
                  display: "flex",

                  alignItems: "center",
                }}
              >
                <i
                  class="fa fa-circle"
                  style={{ fontSize: 10, marginRight: 8 }}
                ></i>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    className="upcoming_event_title"
                    style={{
                      fontWeight: "bold",
                      fontSize: 15,
                      marginBottom: 3,
                    }}
                  >
                    {item.eventName && item.eventName}
                  </div>
                  <div className="upcoming_event_time" style={{ fontSize: 13 }}>
                    {item.eventDate && moment(item.eventDate).format("LL")}
                  </div>
                </div>
              </div>

              <div className="upcoming_event_right">
                <button
                  style={{
                    height: 25,
                    backgroundColor: "#fcd54a",
                    color: "black",
                  }}
                >
                  {item.eventDate && moment(item.eventDate).format("LT")}
                </button>
                {moment(new Date()).valueOf() > item.eventDate - 60000*20 ? 
                <a style={{cursor:"pointer"}} href={item.showVideoLink && item.videolink}> 
                <button
                  style={{
                    height: 25,
                    backgroundColor: "#fcd54a",
                    color: "black",
                    cursor:"pointer"
                  }}
                  onClick={()=>   { 
                    if(userType == "athlete"){
                      db.collection("events").doc(item.id).update({
                        attendance:firebase.firestore.FieldValue.arrayUnion(userData.id)
                      })
                    }}}
                >
                  Join now
                </button> </a>:null}
              </div>
            </div>
            <div style={{ marginLeft: 20 }}>
            {moment(new Date()).valueOf() > item.eventDate - 60000*20 ?
              <a style={{textDecoration:"none"}} 
                onClick={()=>   { 
                  if(userType == "athlete"){
                    db.collection("events").doc(item.id).update({
                      attendance:firebase.firestore.FieldValue.arrayUnion(userData.id)
                    })
                  }}} href={item.showVideoLink && item.videolink}>
                {item.showVideoLink && item.videolink}
              </a> : 
              item.showVideoLink && item.videolink
              }
            </div>

          </div>
        );
      })}
    </div>
  );
}

export default Event_card;
