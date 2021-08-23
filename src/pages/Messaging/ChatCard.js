import React, { useState, useEffect } from "react";
import TextTruncate from "react-text-truncate";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { selectUser, selectUserData } from "../../features/userSlice";
import { db } from "../../utils/firebase";
import "./Messaging.css";

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     marginBottom: 0,
//     padding: RFValue(20,816),
//     minHeight: ScreenHeight,
//   },
//   athlete_card: {
//     width: ScreenWidth / 1.05,
//     height: 180,
//     backgroundColor: "#2E2E2E",
//     // borderWidth: 1,
//     // borderColor: "white",
//     borderRadius: 12,
//     marginVertical: 15,
//     padding: 15,
//   },
//   athlete_cardHeader: {
//     display: "flex",
//     flexDirection: "row",
//     alignItems: "center",
//     marginHorizontal: 10,
//     marginVertical: 10,
//   },
//   athlete_image: {
//     marginHorizontal: 10,
//     width: ScreenWidth * 0.35,
//     height: ScreenWidth * 0.35,
//     borderRadius: 100,
//     backgroundColor: "white",
//     marginRight: RFValue(20,816),
//     marginTop: 0,
//   },
//   athlete_name: {
//     fontSize: RFValue(18,816),
//     color: "white",
//     margin: 15,
//     marginBottom: 5,
//   },
//   athlete__cardBody: {
//     display: "flex",
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginHorizontal: RFValue(20,816),
//   },
//   share: {
//     position: "absolute",
//     top: RFValue(20,816),
//     right: RFValue(70,816),
//   },
// });

function ChatCard({ to_id, from_id, id }) {
  const truncate = (str) => {
    if (str) {
      return str.length > 40 ? str.substring(0, 37) + "..." : str;
    } else {
      return str;
    }
  };
  const [athleteDetails, setAthleteDetails] = useState({});
  const [chatId, setChatId] = useState([]);
  const [allMessages, setAllMessages] = useState([]);

  const user = useSelector(selectUser);
  const userData = useSelector(selectUserData);
  const history = useHistory();

  console.log({ allMessages });
  console.log(to_id);
  useEffect(() => {
    db.collection("athletes")
      .doc(to_id)
      .get()
      .then((querySnapshot) => {
        setAthleteDetails(querySnapshot.data());
        console.log(athleteDetails);
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });

    var data = [];
    db.collection("chat")
      .doc(id)
      .collection("messages")
      .orderBy("timestamp", "desc")
      .get()
      .then((snapshot) => {
        snapshot.docs.forEach((item) => {
          let currentID = item.id;
          let appObj = { ...item.data(), ["id"]: currentID };
          data.push(appObj);
        });
        setAllMessages(data);
        console.log(allMessages);
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  }, [user]);

  return (
    <div
      className="chatCard"
      onClick={() =>
        history.push({
          pathname: "/messaging",
          state: {
            id: id,
            from_id: from_id,
            to_id: to_id,
            from_name: userData?.data.name,
            to_name: athleteDetails?.name,
            type: "coach",
          },
        })
      }
    >
      <div>
        <div className="athlete_card">
          <img
            className="athlete_image"
            src={
              athleteDetails?.imageUrl
                ? athleteDetails?.imageUrl
                : "https://firebasestorage.googleapis.com/v0/b/triden-workout-app.appspot.com/o/images%2FuserImage.jpeg?alt=media&token=7a57513d-4d38-410d-b176-cdb5a3bdb6ef"
            }
          />
          <div>
            <h3 className="athlete_name">{athleteDetails?.name}</h3>{" "}
            <div className="athlete_message">
              <h3>{truncate(allMessages[0]?.message)}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatCard;
