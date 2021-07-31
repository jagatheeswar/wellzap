import React from "react";
import { db } from "../../utils/firebase";
import { useSelector } from "react-redux";
import { selectUserData, selectUserType } from "../../features/userSlice";
import WorkoutCard from "../../Components/WorkoutCard/WorkoutCard";
import WorkoutScreenHeader from "./WorkoutScreenHeader";

import SearchIcon from "@material-ui/icons/Search";
import ClearIcon from "@material-ui/icons/Clear";

import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { formatDate } from "../../functions/formatDate";

function AthleteAssignedVideos() {
  const userData = useSelector(selectUserData);
  const userType = useSelector(selectUserType);
  const [workouts, setWorkouts] = React.useState([]);
  const [pastWorkouts, setPastWorkouts] = React.useState([]);

  const [search, setsearch] = React.useState("");
  const [SearchList, setSearchList] = React.useState(null);
  const [SearchLoading, SetSearhLoading] = React.useState(false);
  const [videoData, setVideoData] = React.useState([]);
  const [sorting, setsorting] = React.useState("desc");
  const [AssignedVideos, setAssignedVideos] = React.useState([]);

  const [showFilter, setShowFilter] = React.useState(false);

  document.addEventListener("mouseup", function (e) {
    if (showFilter) {
      setShowFilter(false);
    }
  });

  React.useEffect(async () => {
    SetSearhLoading(true);

    if (search?.length > 0) {
      const names = await videoData?.filter((workout) => {
        return workout.title.toLowerCase().includes(search.toLowerCase());
      });

      setSearchList(names);
      SetSearhLoading(false);
    } else {
      setSearchList(videoData);
      SetSearhLoading(false);
    }
  }, [search]);

  React.useEffect(() => {
    let temp = [...AssignedVideos];
    let videos = [];
    let c = 0;
    console.log(temp);
    temp?.map((data, idx) => {
      data.Video.map((dat, idx1) => {
        videos[c] = {};
        videos[c] = { ...temp[idx] };
        videos[c]["Video"] = [data?.Video[idx1]];
        videos[c]["title"] = data?.Video[idx1]?.title;
        c = c + 1;
      });
    });
    console.log(videos);
    setVideoData(videos);
    setSearchList(videos);
  }, [AssignedVideos]);

  React.useEffect(() => {
    if (userData) {
      db.collection("WorkoutVideo")
        .where("AssignedToId", "array-contains", userData?.id)
        //.where("selectedDays", "array-contains", formatDate())

        .orderBy("timestamp", sorting)
        .get()
        .then((snap) => {
          let data = [];

          snap.docs.forEach((s) => {
            data.push(s.data());
            console.log("ss", s.data());
          });
          setAssignedVideos(data);
        });
    }
  }, [userData?.id, sorting]);

  const options = [
    { value: "asc", label: "Recent" },
    { value: "desc", label: "old" },
  ];

  return (
    <div style={{ minHeight: "99.7vh" }}>
      <WorkoutScreenHeader name="Assigned Videos" />
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
      <div style={{ width: "50%", marginLeft: 20 }}>
        {SearchList?.length > 0 ? (
          SearchList?.map((video, idx) => (
            <div style={{}}>
              {video?.Video?.map((Id, idx) => (
                <div class="iframe_container">
                  <iframe
                    style={{ borderRadius: 10 }}
                    src={"https://player.vimeo.com/video/" + `${Id?.videoId}`}
                    width="400px"
                    height="200px"
                    frameborder="0"
                    webkitallowfullscreen
                    mozallowfullscreen
                    allowfullscreen
                  ></iframe>
                </div>
              ))}
            </div>
          ))
        ) : (
          <div
            style={{
              fontSize: "13px",
              backgroundColor: "#fff",
              width: "90%",
              padding: "10px 20px",
              textAlign: "center",
              borderRadius: "5px",
              fontWeight: "normal",
              marginLeft: 10,
            }}
          >
            <h5> There are no assigned videos for now </h5>
          </div>
        )}
      </div>
    </div>
  );
}

export default AthleteAssignedVideos;
