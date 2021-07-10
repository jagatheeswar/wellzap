import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUserData, selectUserType } from "../../features/userSlice";
import { db } from "../../utils/firebase";
import { formatDate } from "../../functions/formatDate";
import moment from "moment";
import { formatDate1 } from "../../Components/NutritionCard/NutritionCard";
function AthleteGoals() {
  const [goal, setgoal] = useState(null);
  const userData = useSelector(selectUserData);
  const userType = useSelector(selectUserType);
  const formatDate = (str) => {
    if (str) {
      var date = str.split("-");
      date[1] = parseInt(date[1]) + 1;
      return date[2] + "-" + date[1].toString() + "-" + date[0];
    }
  };
  React.useEffect(() => {
    if (userData) {
      var localEventsHistory = [];
      var temp = null;
      var data = null;
      db.collection("athletes")
        .doc(userData?.id)
        .get()
        .then((snapshot) => {
          console.log(snapshot.data().goals);
          snapshot.data().goals.forEach((item) => {
            if (typeof item.date == "string") {
              console.log(formatDate(item.date));
              let date = new Date(formatDate(item.date));
              console.log(date, new Date());
              console.log(date > new Date());
              if (!temp && date > new Date()) {
                temp = date;
                data = item;
              }
              if (date < temp && date > new Date()) {
                data = item;
              }
            }
          });
          setgoal(data);
          console.log(goal);
        });
    }
  }, [userData?.id, userData?.data?.goals]);

  return (
    <div className="athleteGoals">
      {!goal && (
        <div
          style={{
            height: 40,
            display: "flex",
            justifyContent: "space-between",
            padding: 10,
          }}
          className="athleteGoals__noGoals"
        >
          <h6 style={{ fontWeight: "normal" }}>
            Add a goal that you are training for
          </h6>
        </div>
      )}

      {goal && (
        <div
          style={{
            height: 40,
            display: "flex",
            justifyContent: "space-between",
            padding: 10,
          }}
          className="athleteGoals__noGoals"
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 17,
                }}
              >
                {goal?.name}
              </div>
              <div
                style={{
                  fontWeight: 500,
                  fontSize: 14,
                }}
              >
                {moment(formatDate(goal.date).split("-")[1], "MM").format(
                  "MMMM"
                )}{" "}
                {goal.date.split("-")[0]}, {goal.date.split("-")[2]}{" "}
              </div>
            </div>
          </div>
          <div
            style={{
              textAlign: "center",
              backgroundColor: "#fcd11c",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              padding: 15,
            }}
          >
            {moment(new Date(formatDate(goal.date))).diff(
              moment(new Date()),
              "days"
            )}{" "}
            days
            {console.log(
              goal,
              moment(new Date()),
              formatDate(goal.date),
              moment(new Date(formatDate(goal.date)))
            )}
          </div>
          {console.log("goasl", goal)}
        </div>
      )}
    </div>
  );
}

export default AthleteGoals;
