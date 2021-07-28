import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import WorkoutCard from "../../Components/WorkoutCard/WorkoutCard";
import { selectUserData, selectUserType } from "../../features/userSlice";
import { db } from "../../utils/firebase";
import WorkoutScreenHeader from "./WorkoutScreenHeader";

import SearchIcon from "@material-ui/icons/Search";
import ClearIcon from "@material-ui/icons/Clear";
import Icon from "@material-ui/core/Icon";

import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

function ViewAllSavedLongTermWorkouts(props) {
  const userData = useSelector(selectUserData);
  const userType = useSelector(selectUserType);
  const [workouts, setWorkouts] = React.useState([]);
  const [savedWorkouts, setsavedWorkouts] = useState([]);
  const [type, setType] = React.useState("");
  const [athleteId, setAthleteId] = React.useState("");
  const [completed, setCompleted] = React.useState(false);

  const [search, setsearch] = React.useState("");
  const [SearchList, setSearchList] = React.useState(null);
  const [SearchLoading, SetSearhLoading] = React.useState(false);
  const [savedLongTermWorkouts, setLongTermWorkouts] = React.useState([]);

  const [sorting, setsorting] = React.useState("desc");
  const [openSearch, setopenSearch] = React.useState(false);

  const [showFilter, setShowFilter] = React.useState(false);

  document.addEventListener("mouseup", function (e) {
    if (showFilter) {
      setShowFilter(false);
    }
  });
  React.useEffect(() => {
    if (userData) {
      if (userType === "athlete") {
        db.collection("workouts")
          .where("assignedToId", "==", userData?.id)
          .where("completed", "==", true)
          //.orderBy("date","desc")
          .onSnapshot((snapshot) => {
            setWorkouts(
              snapshot.docs.map((doc) => ({
                id: doc.id,
                data: doc.data(),
              }))
            );
          });
      } else {
        if (type && athleteId) {
          db.collection("workouts")
            .where("assignedToId", "==", athleteId)
            .where("saved", "==", false)
            .where("completed", "==", completed)
            .onSnapshot((snapshot) => {
              if (snapshot) {
                console.log("Inside snapshot");
                setWorkouts(
                  snapshot.docs.map((doc) => ({
                    id: doc.id,
                    data: doc.data(),
                  }))
                );
              } else {
                console.log("outside snapshot");
                setWorkouts([]);
              }
            });
        } else {
          // db.collection("CoachWorkouts")
          //   .where("assignedById", "==", userData?.id)
          //   .where("saved", "==", false)
          //   .onSnapshot((snapshot) => {
          //     setWorkouts(
          //       snapshot.docs.map((doc) => ({
          //         id: doc.id,
          //         data: doc.data(),
          //       }))
          //     );
          //   });
        }
      }
    }
  }, [userData?.id, athleteId]);
  useEffect(() => {
    console.log(sorting);
    if (userType == "coach") {
      db.collection("longTermWorkout")
        .where("assignedById", "==", userData?.id)
        .where("assignedToId", "==", "")
        .orderBy("timestamp", sorting)

        .onSnapshot((snapshot) => {
          setLongTermWorkouts(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          );
        });
    }
  }, [userData?.id, sorting, userType]);

  useEffect(() => {
    console.log(sorting);
  }, [sorting]);

  React.useEffect(() => {
    setSearchList(savedLongTermWorkouts);
    console.log(savedLongTermWorkouts);
  }, [savedLongTermWorkouts]);

  React.useEffect(async () => {
    SetSearhLoading(true);

    if (search?.length > 0) {
      const names = await savedLongTermWorkouts?.filter((workout) => {
        return workout.data.preWorkout.workoutName
          .toLowerCase()
          .includes(search.toLowerCase());
      });

      setSearchList(names);
      SetSearhLoading(false);
    } else {
      setSearchList(savedLongTermWorkouts);
      SetSearhLoading(false);
    }
  }, [search, sorting]);

  const options = [
    { value: "asc", label: "Recent" },
    { value: "desc", label: "old" },
  ];
  return (
    <div style={{ minHeight: "99.6vh" }}>
      <WorkoutScreenHeader name="Saved Longterm" />

      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            marginTop: 20,
            marginLeft: 20,
            backgroundColor: "white",
            padding: 5,
            display: "flex",
            alignItems: "center",
            border: "1px solid black",
            width: "500px",
            transition: "all 0.5s",
            borderRadius: 10,
          }}
        >
          <input
            placeholder="workout name"
            value={search}
            style={{
              width: "100%",
              display: "block",

              fontSize: 20,
              outline: "none",
              border: "none",
            }}
            onChange={(e) => {
              setsearch(e.target.value);
            }}
          />
          <Icon
            name="filter"
            size={20}
            style={{ alignSelf: "flex-end" }}
            color="black"
            type="font-awesome-5"
          />
          {search?.length == 0 ? (
            <div
              onClick={() => {
                setopenSearch(true);
                setsearch("");
              }}
            >
              <SearchIcon
                style={{
                  width: 30,
                  height: 30,
                }}
              />
            </div>
          ) : (
            <div
              onClick={() => {
                setsearch("");
              }}
            >
              <ClearIcon
                style={{
                  width: 30,
                  height: 30,
                }}
              />
            </div>
          )}
        </div>
        <div
          style={{
            display: "flex",
            position: "relative",
            width: "100px",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <div className="filter_icon">
            <img
              onClick={() => {
                setShowFilter(!showFilter);
              }}
              src="/assets/filter.png"
              width="35px"
              height="35px"
            />
          </div>
          <div
            className="filter"
            style={{
              position: "absolute",
              marginTop: 40,
              display: showFilter ? "block" : "none",
              border: "1px solid black",
              fontSize: 12,
              borderRadius: 10,
            }}
          >
            <div
              onClick={() => {
                setsorting("desc");
                setShowFilter(false);
              }}
              style={{
                padding: 10,
                borderBottom: "1px solid black",
                backgroundColor: sorting == "desc" ? "#fcd11c" : "white",

                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
              }}
            >
              Recent
            </div>
            <div
              onClick={() => {
                setsorting("asc");
                setShowFilter(false);
              }}
              style={{
                padding: 10,

                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
                backgroundColor: sorting == "asc" ? "#fcd11c" : "white",
              }}
            >
              oldest to new
            </div>
          </div>
        </div>
        <div
          style={{
            width: 150,
            marginLeft: "auto",
          }}
        >
          <Dropdown
            options={options}
            placeholder="Order By"
            onChange={(s) => {
              setsorting(s.value);
            }}
          />
        </div>
      </div>
      {search?.length > 0 && (
        <div
          style={{
            fontSize: 13,
            marginLeft: 20,
          }}
        >
          {SearchList?.length} results found
        </div>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          width: "100%",
          marginLeft: "10px",
          marginRight: "10px",
          marginTop: "15px",
        }}
      >
        <div
          style={{
            width: "50%",
            marginTop: "20px",
            paddingLeft: "15px",
            paddingRight: "15px",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {SearchList?.length > 0 ? (
            SearchList?.map((workout, idx) => (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <WorkoutCard
                  key={workout.id}
                  weeks={workout.data.weeks}
                  item={workout}
                  idx={idx}
                  selectedWeekNum={workout.data.weeks[0].weeknum}
                  isLongTerm={true}
                  type="edit"
                  navigate={true}
                />
              </div>
            ))
          ) : (
            <div
              style={{
                fontSize: "13px",
                backgroundColor: "#fff",
                width: "100%",
                padding: "10px 20px",
                textAlign: "center",
                borderRadius: "5px",
                fontWeight: "normal",
              }}
            >
              <h5> There are no saved LongTerm workouts for now </h5>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewAllSavedLongTermWorkouts;
