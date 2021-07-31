import * as React from "react";
import { useSelector } from "react-redux";
import WorkoutCard from "../../Components/WorkoutCard/WorkoutCard";
import { selectUserData, selectUserType } from "../../features/userSlice";
import { db } from "../../utils/firebase";
import WorkoutScreenHeader from "./WorkoutScreenHeader";
import SearchIcon from "@material-ui/icons/Search";

import ClearIcon from "@material-ui/icons/Clear";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
function ViewAllWorkouts() {
  const userData = useSelector(selectUserData);
  const userType = useSelector(selectUserType);
  const [workouts, setWorkouts] = React.useState([]);
  const [type, setType] = React.useState("");

  const [athleteId, setAthleteId] = React.useState("");
  const [completed, setCompleted] = React.useState(false);
  const [search, setsearch] = React.useState("");
  const [SearchList, setSearchList] = React.useState(null);
  const [SearchLoading, SetSearhLoading] = React.useState(false);

  const [showFilter, setShowFilter] = React.useState(false);

  document.addEventListener("mouseup", function (e) {
    if (showFilter) {
      setShowFilter(false);
    }
  });

  const [sorting, setsorting] = React.useState("desc");
  // React.useEffect(() => {
  //   workouts?.filter((coach) => {
  //     return coach.data.name.toLowerCase().includes(search);
  //   });
  // }, [search]);

  React.useEffect(() => {
    setSearchList(workouts);
    console.log(workouts);
    workouts.forEach((workout) => {
      if (workout?.data?.isLongTerm) {
        console.log("d", workout);
      }
    });
  }, [workouts]);

  React.useEffect(async () => {
    SetSearhLoading(true);

    if (search?.length > 0) {
      const names = await workouts?.filter((workout) => {
        return workout.data.preWorkout.workoutName
          .toLowerCase()
          .includes(search.toLowerCase());
      });

      setSearchList(names);
      SetSearhLoading(false);
    } else {
      setSearchList(workouts);
      SetSearhLoading(false);
    }
  }, [search]);

  React.useEffect(() => {
    if (userData) {
      if (userType !== "coach") {
        db.collection("workouts")
          .where("assignedToId", "==", userData?.id)
          .where("completed", "==", false)

          .orderBy("timestamp", sorting)
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
            .orderBy("timestamp", sorting)
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
          db.collection("CoachWorkouts")
            .where("assignedById", "==", userData?.id)
            .where("saved", "==", false)
            .orderBy("timestamp", sorting)
            .onSnapshot((snapshot) => {
              setWorkouts(
                snapshot.docs.map((doc) => ({
                  id: doc.id,
                  data: doc.data(),
                }))
              );
            });
        }
      }
    }
  }, [userData?.id, athleteId, sorting]);

  const options = [
    { value: "asc", label: "Recent" },
    { value: "desc", label: "old" },
  ];

  return (
    <div style={{ minHeight: "99.7vh" }}>
      <WorkoutScreenHeader name="Upcoming Workouts" />
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            margin: 20,
            backgroundColor: "white",
            padding: 5,
            display: "flex",
            alignItems: "center",
            border: "1px solid black",
            width: "500px",
            borderRadius: 10,
          }}
        >
          <input
            value={search}
            style={{
              width: "100%",

              fontSize: 20,
              outline: "none",
              border: "none",
            }}
            onChange={(e) => {
              setsearch(e.target.value);
            }}
          />
          {search?.length == 0 ? (
            <SearchIcon
              style={{
                width: 30,
                height: 30,
              }}
            />
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
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                backgroundColor: sorting == "desc" ? "#fcd11c" : "white",
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
                backgroundColor: sorting == "asc" ? "#fcd11c" : "white",

                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
              }}
            >
              oldest to new
            </div>
          </div>
        </div>
        {/* <div
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
        </div> */}
      </div>
      {search.length > 0 && (
        <div
          style={{
            fontSize: 13,
            marginLeft: 20,
          }}
        >
          {SearchList?.length} search results loaded
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
            SearchList?.map((item, idx) => (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <WorkoutCard
                  key={idx}
                  workouts={workouts}
                  item={item}
                  idx={idx}
                  navigation={"ViewAllWorkouts"}
                  showDate={true}
                  type="non-editable"
                  completed={completed === true ? true : false}
                />
              </div>
            ))
          ) : (
            <div
              style={{
                backgroundColor: "#fff",
                width: "100%",
                height: 90,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "5px",
              }}
            >
              <h5>There are no workouts for now</h5>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewAllWorkouts;
