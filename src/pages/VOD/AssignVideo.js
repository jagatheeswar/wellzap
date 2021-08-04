import React, { useState, useEffect, useCallback } from "react";

import { auth, db } from "../../utils/firebase";
import firebase from "firebase";

import { useDispatch, useSelector } from "react-redux";
import {
  setDbID,
  selectDbId,
  selectUser,
  setUserDetails,
  selectShowData,
  logout,
  setUserData,
  selectUserData,
} from "../../features/userSlice";
import "./vod.css";
//import Notification from "../components/Notification";
import VideocamIcon from "@material-ui/icons/Videocam";
import { Formik } from "formik";
import formatSpecificDate1 from "../../functions/formatSpecificDate1";
import SearchableDropdown from "../../Components/SearchableDropdown";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import IconButton from "@material-ui/core/IconButton";
import { formatDate } from "../../functions/formatDate";

import { Grid } from "@material-ui/core";
import useAutocomplete from "@material-ui/lab/useAutocomplete";
import { useHistory, useLocation } from "react-router-dom";
import VODScreenHeader from "./VODScreenHeader";
import formatSpecificDate from "../../functions/formatSpecificDate";
import incr_date from "../../functions/incr_date";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  DialogContentText,
} from "@material-ui/core";

import styled from "styled-components";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const InputWrapper = styled("div")`
  width: 350px;
  border: 1px solid #d9d9d9;
  background-color: #fff;
  border-radius: 4px;
  padding: 1px;
  display: flex;
  flex-wrap: wrap;
  margin-left: 4%;

  &:hover {
    border-color: #40a9ff;
  }

  &.focused {
    border-color: #40a9ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }

  & input {
    font-size: 14px;
    height: 30px;
    box-sizing: border-box;
    padding: 4px 6px;
    width: 0;
    min-width: 30px;
    flex-grow: 1;
    border: 0;
    margin: 0;
    outline: 0;
  }
`;

const Listbox = styled("ul")`
  width: 350px;
  margin: 2px 0 0;
  margin-left: 2.1%;
  padding: 0;
  position: absolute;
  list-style: none;
  background-color: #fff;
  overflow: auto;
  max-height: 150px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1;

  & li {
    padding: 5px 12px;
    display: flex;

    & span {
      flex-grow: 1;
    }

    & svg {
      color: transparent;
    }
  }

  & li[aria-selected="true"] {
    background-color: #fafafa;
    font-weight: 600;

    & svg {
      color: #1890ff;
    }
  }

  & li[data-focus="true"] {
    background-color: #e6f7ff;
    cursor: pointer;

    & svg {
      color: #000;
    }
  }
`;

const Tag = styled(({ label, onDelete, ...props }) => (
  <div {...props}>
    <span>{label}</span>
    <CloseIcon onClick={onDelete} />
  </div>
))`
  display: flex;
  align-items: center;
  height: 24px;
  margin: 2px;

  line-height: 22px;
  background-color: #fafafa;
  border: 1px solid #e8e8e8;
  border-radius: 2px;
  box-sizing: content-box;
  padding: 0 4px 0 10px;
  outline: 0;
  overflow: hidden;

  &:focus {
    border-color: #40a9ff;
    background-color: #e6f7ff;
  }

  & span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  & svg {
    font-size: 12px;
    cursor: pointer;
    padding: 4px;
  }
`;

const Label = styled("label")`
  padding: 0 0 4px;
  line-height: 1.5;
  display: block;
  margin-left: 4%;
  margin-top: 20px;
`;
function AssignVideo({ navigation }) {
  const [userDetails, setUserDetails] = useState(null);
  const [athleteDetails, setAthleteDetails] = useState([]);
  const user = useSelector(selectUser);
  const userData = useSelector(selectUserData);
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [athletes, setAthletes] = useState([]);
  const [listOfAthletes, setListOfAthletes] = useState([]);
  const [videoId, setVideoId] = useState(["576142998", "576142998"]);
  const [title, settitle] = useState("");
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [selectedAthletes, setSelectedAthletes] = useState([]);
  const [selectedAthletes1, setSelectedAthletes1] = useState([]);
  const [currentStartWeek, setCurrentStartWeek] = useState(null);
  const [currentEndWeek, setCurrentEndWeek] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]);

  const [verifiedModal, setVerifiedModal] = useState(false);
  const [onboardModal, setOnboardModal] = useState(false);

  const [SearchList, setSearchList] = React.useState(null);
  const [SearchLoading, SetSearhLoading] = React.useState(false);
  const [selectmultiple, setselectmultiple] = useState(false);

  const [filterAsc, setFilterAsc] = useState(false);
  const [sorting, setsorting] = React.useState("desc");
  const [athlete_selecteddays, setathlete_selecteddays] = useState([]);
  const location = useLocation();

  const [daysList, setDaysList] = useState([
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ]);
  const [specificDates, setSpecificDates] = useState([]);
  const [screen, setscreen] = useState(1);
  const history = useHistory();

  const [videoData, setVideoData] = useState([
    {
      videoId: 576142998,
      title: "a",
    },
    {
      videoId: 576142998,
      title: "b",
    },
  ]);
  const [AssignedVideos, setAssignedVideos] = useState([]);
  useEffect(() => {
    var video_data = [];
    var data = [];

    if (userData?.id) {
      db.collection("coaches")
        .doc(userData?.id)
        .collection("videos")
        .orderBy("timestamp")
        .get()

        .then((snapshot) => {
          snapshot.forEach((dat) => {
            console.log("a", dat.data());
            let data = dat.data();
            if (location?.state?.videoData) {
              let temp = location?.state?.videoData;
              if (dat.data().videoId == temp[0]?.videoId) {
                data["checked"] = true;
              }
            }
            video_data.push(data);
          });
          setVideoData(video_data);
        });

      //   db.collection("WorkoutVideo")
      //     .where("AssignedById", "==", userData?.id)
      //     .orderBy("timestamp")
      //     .limit(4)
      //     .get()

      //     .then((snap) => {
      //       let data = [];
      //       snap.forEach((s) => {
      //         console.log("sss", s.data());
      //         data.push(s.data());
      //       });

      //       setAssignedVideos(data);
      //     });
    }
  }, [user, userData?.id, location?.state?.videoData]);
  useEffect(() => {
    let temp = [...selectedAthletes];
    selectedAthletes.map((athlete, idx) => {
      if (athlete_selecteddays[athlete.id]) {
        temp[idx].selectedDays = athlete_selecteddays[athlete.id];
      }
      setSelectedAthletes1(temp);
      console.log(1, temp);
    });
  }, [selectedAthletes]);

  useEffect(() => {
    if (location?.state?.videoData) {
      let temp = location.state.videoData;
      let temp1 = [...videoData];
      temp1?.forEach((vd) => {
        if (vd.videoId == temp[0]?.videoId) {
          vd["checked"] = true;
        }
      });
      setVideoData(temp1);
    }
  }, [location?.state]);

  useEffect(() => {
    if (false) {
      var minDate = location.state?.workout?.data?.selectedDates?.reduce(
        function (a, b) {
          return a < b ? a : b;
        }
      );
      var curr = new Date(minDate); // get current date
      var first = curr.getDate() - curr.getDay(); // First day is the  day of the month - the day of the week \

      var firstday = new Date(curr.setDate(first)).toUTCString();
      var lastday = new Date(curr.setDate(curr.getDate() + 6)).toUTCString();

      setCurrentStartWeek(formatSpecificDate(firstday));
      setCurrentEndWeek(formatSpecificDate(lastday));
    } else {
      var curr = new Date(); // get current date
      var first = curr.getDate() - curr.getDay(); // First day is the  day of the month - the day of the week \

      var firstday = new Date(curr.setDate(first)).toUTCString();
      var lastday = new Date(curr.setDate(curr.getDate() + 6)).toUTCString();

      setCurrentStartWeek(formatSpecificDate(firstday));
      setCurrentEndWeek(formatSpecificDate(lastday));
    }
  }, []);

  useEffect(() => {
    if (currentStartWeek) {
      let temp = currentStartWeek;

      let datesCollection = [];

      for (var i = 0; i < 7; i++) {
        datesCollection.push(temp);
        temp = incr_date(temp);
      }

      setSpecificDates(datesCollection);
    }
  }, [currentStartWeek]);

  useEffect(() => {
    if (userData?.id) {
      const data = [];
      db.collection("athletes")
        .orderBy("name", "asc")
        .get()
        .then((snapshot) => {
          snapshot.docs.forEach((athlete) => {
            if (userData?.data?.listOfAthletes?.includes(athlete.id)) {
              let currentID = athlete.id;
              let appObj = { ...athlete.data(), ["id"]: currentID };
              data.push(appObj);
            }
          });
          setListOfAthletes(data);
          console.log(data);
        });
    }
  }, [userData?.id]);
  const {
    getRootProps,
    getInputLabelProps,
    getInputProps,
    getTagProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    value,
    focused,
    setAnchorEl,
  } = useAutocomplete({
    id: "customized-hook-demo",
    multiple: true,
    options: listOfAthletes,
    getOptionLabel: (option) => option.name,
  });

  React.useEffect(() => {
    setSearchList(videoData);
    console.log(videoData);
  }, [videoData]);

  useEffect(() => {
    //console.log("4")
    value.map((v) => {
      v.selectedDays = [];
    });
    if (!location.state?.workout?.data?.selectedAthletes) {
      setSelectedAthletes(value);
    }
  }, [value]);
  React.useEffect(() => {
    console.log(search);
    (async () => {
      if (search?.length > 0 && videoData) {
        const names = await videoData?.filter((data) => {
          return data.title.toLowerCase().includes(search.toLowerCase());
        });

        setSearchList(names);
        SetSearhLoading(false);
      } else {
        setSearchList(videoData);
        SetSearhLoading(false);
      }
    })();
  }, [search, videoData]);

  const fetchUsers = (search) => {
    var temp = [];
    const data = [];
    console.log(userData);
    if (userData?.id) {
    }
  };

  return (
    <div
      style={{
        margin: 20,
        boxSizing: "border-box",
        minHeight: "100vh",
      }}
    >
      <VODScreenHeader name="Assign Videos" />
      {/* <Grid container>
        <Grid item xs={6} lg={3} xl={2}>
          ...
        </Grid>
        <Grid item xs={6} lg={3} xl={2}>
          ...
        </Grid>
        <Grid item xs={6} lg={3} xl={2}>
          ...
        </Grid>
        <Grid item xs={6} lg={3} xl={2}>
          ...
        </Grid>
        <Grid item xs={6} lg={3} xl={2}>
          ...
        </Grid>
        <Grid item xs={6} lg={3} xl={2}>
          ...
        </Grid>
      </Grid> */}
      {screen == 1 && (
        <Grid container spacing={1} className="workouts__homeContainer">
          <div
            style={{
              width: "90%",
              paddingLeft: 10,
              display: "flex",
              alignItems: "center",
            }}
            className="workoutHeading__row"
          >
            <h1>Uploaded Videos</h1>
          </div>
          {console.log("b", videoData)}
          {videoData?.length > 0 ? (
            videoData?.map((video, idx) => (
              <Grid
                item
                xs={4}
                lg={4}
                xl={2}
                className="workouts__homeLeftContainer"
              >
                <div
                  onClick={() => {
                    let temp = [...videoData];
                    console.log(temp[idx]);
                    if (temp[idx].checked) {
                      console.log("n");
                      temp[idx].checked = !temp[idx].checked;
                    } else {
                      console.log("y");
                      temp[idx]["checked"] = true;
                    }
                    setVideoData(temp);
                  }}
                  style={{
                    backgroundColor: videoData[idx]?.checked && "#ffe486",
                    marginBottom: 20,
                  }}
                >
                  <div class="iframe_container">
                    {console.log("vi", videoData)}
                    <iframe
                      style={{ borderRadius: 10 }}
                      src={
                        "https://player.vimeo.com/video/" + `${video?.videoId}`
                      }
                      width="100%"
                      height="100%"
                      frameborder="0"
                      webkitallowfullscreen
                      mozallowfullscreen
                      allowfullscreen
                    ></iframe>
                  </div>
                  <div>
                    title : {video?.title}
                    <br />
                    Uploaded On{" "}
                    {formatSpecificDate(video?.timestamp?.seconds * 1000)}
                  </div>
                </div>
              </Grid>
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
              <h5> There are no uploaded videos for now </h5>
            </div>
          )}
        </Grid>
      )}
      {screen == 2 && (
        <div>
          <div {...getRootProps()}>
            <Label {...getInputLabelProps()}>Search for Athletes</Label>
            <InputWrapper
              ref={setAnchorEl}
              className={focused ? "focused" : ""}
            >
              {value.map((option, index) => (
                <Tag label={option.name} {...getTagProps({ index })} />
              ))}

              <input {...getInputProps()} />
            </InputWrapper>
          </div>
          {groupedOptions.length > 0 ? (
            <Listbox {...getListboxProps()}>
              {groupedOptions.map((option, index) => (
                <li {...getOptionProps({ option, index })}>
                  <span>{option.name}</span>
                  <CheckIcon fontSize="small" />
                </li>
              ))}
            </Listbox>
          ) : null}

          {selectmultiple ? (
            <div>
              {selectedAthletes1?.map((athlete, index) => (
                <div
                  key={index}
                  style={{
                    marginLeft: "4%",
                    marginTop: "25px",
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      backgroundColor: "#ffe486",
                      borderRadius: "10px",
                      height: "45px",
                      width: "350px",
                    }}
                  >
                    <img
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "18px",
                        marginLeft: "20px",
                        marginRight: "20px",
                      }}
                      src={athlete.imageUrl ? athlete.imageUrl : null}
                    />
                    <h2
                      style={{
                        fontSize: "15px",
                        fontWeight: "600",
                        lineHeight: "28px",
                        color: "black",
                        marginLeft: "15%",
                      }}
                    >
                      {athlete.name}
                    </h2>
                  </div>
                  <h2
                    style={{
                      fontSize: "15px",
                      fontWeight: "600",
                      marginTop: "10px",
                      lineHeight: "28px",
                      marginLeft: "1%",
                    }}
                  >
                    Select days
                  </h2>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      flexWrap: "wrap",
                      marginBottom: "10px",
                      width: "300px",
                    }}
                  >
                    <div
                      style={{
                        marginLeft: "3%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "300px",
                      }}
                    >
                      <IconButton
                        style={{
                          marginRight: "10px",
                          marginLeft: "25%",
                          display: "flex",
                          alignItems: "center",
                        }}
                        onClick={() => {
                          var curr = new Date(currentStartWeek); // get current date
                          var first = curr.getDate() - curr.getDay() - 7; // First day is the  day of the month - the day of the week \

                          var firstday = new Date(
                            curr.setDate(first)
                          ).toUTCString();
                          var lastday = new Date(
                            curr.setDate(curr.getDate() + 6)
                          ).toUTCString();
                          if (new Date(currentStartWeek) > new Date()) {
                            setCurrentStartWeek(formatSpecificDate(firstday));
                            setCurrentEndWeek(formatSpecificDate(lastday));
                          }
                        }}
                      >
                        <ChevronLeftIcon />
                      </IconButton>
                      {daysList.map((day, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            if (true) {
                              if (
                                athlete?.selectedDays?.includes(
                                  specificDates[idx]
                                )
                              ) {
                                let selected =
                                  selectedAthletes[index].selectedDays;
                                var index1 = selected.indexOf(
                                  specificDates[idx]
                                );
                                if (index1 !== -1) {
                                  selected.splice(index1, 1);
                                  selectedAthletes[index] = {
                                    ...selectedAthletes[index],
                                    selected,
                                  };
                                  setSelectedAthletes([...selectedAthletes]);
                                }
                              } else {
                                if (
                                  new Date(specificDates[idx]) > new Date() ||
                                  specificDates[idx] === formatDate()
                                ) {
                                  let selectedDays =
                                    selectedAthletes[index].selectedDays;
                                  selectedAthletes[index] = {
                                    ...selectedAthletes[index],
                                    selectedDays: [
                                      ...selectedDays,
                                      specificDates[idx],
                                    ],
                                  };
                                  let temp = athlete_selecteddays;
                                  temp[selectedAthletes[index].id] =
                                    selectedAthletes[index].selectedDays;

                                  setathlete_selecteddays(temp);
                                  setSelectedAthletes([...selectedAthletes]);
                                }
                              }
                            }
                          }}
                          style={
                            athlete?.selectedDays?.includes(specificDates[idx])
                              ? {
                                  backgroundColor: "#ffe486",
                                  color: "#fff",
                                  width: "85px",
                                  height: "25px",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  position: "relative",
                                  borderRadius: "8px",
                                  marginRight: "2px",
                                  marginBottom: "5px",
                                  padding: "5px",
                                  cursor: "pointer",
                                }
                              : {
                                  width: "85px",
                                  height: "25px",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  position: "relative",
                                  borderRadius: "8px",
                                  marginRight: "2px",
                                  marginBottom: "5px",
                                  padding: "5px",
                                  cursor: "pointer",
                                }
                          }
                        >
                          <div>
                            <div
                              style={{
                                fontSize: "12px",
                                fontWeight: "600",
                                lineHeight: "20px",
                                width: "80%",
                                textAlign: "center",
                                padding: "5px",
                                color: athlete?.selectedDays?.includes(
                                  specificDates[idx]
                                )
                                  ? "black"
                                  : "black",
                              }}
                            >
                              {day}
                            </div>
                          </div>
                        </div>
                      ))}

                      <IconButton
                        style={{
                          marginLeft: "10%",
                          display: "flex",
                          alignItems: "center",
                        }}
                        onClick={() => {
                          var curr = new Date(currentStartWeek); // get current date
                          var first = curr.getDate() - curr.getDay() + 7; // First day is the  day of the month - the day of the week \

                          var firstday = new Date(
                            curr.setDate(first)
                          ).toUTCString();
                          var lastday = new Date(
                            curr.setDate(curr.getDate() + 6)
                          ).toUTCString();

                          setCurrentStartWeek(formatSpecificDate(firstday));
                          setCurrentEndWeek(formatSpecificDate(lastday));
                        }}
                      >
                        <ChevronRightIcon />
                      </IconButton>
                    </div>

                    <div
                      style={{
                        fontSize: "10px",
                        fontWeight: "500",
                        lineHeight: "18px",
                        display: "flex",
                        justifyContent: "space-evenly",
                        alignItems: "center",
                        width: "100%",
                        height: "25px",
                        marginLeft: "35px",
                        cursor: "pointer",
                      }}
                    >
                      {specificDates?.map((tempDate, idx) => (
                        <div
                          style={{
                            width: "45px",
                            height: "30px",
                          }}
                          key={idx}
                        >
                          <div
                            style={{
                              fontSize: "10px",
                              fontWeight: "500",
                              lineHeight: "18px",
                              width: "100%",
                              paddingLeft: "5px",
                              paddingRight: "5px",
                              paddingBottom: "5px",
                              textAlign: "center",
                            }}
                          >
                            {formatSpecificDate1(tempDate)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                flexWrap: "wrap",
                marginBottom: "10px",
                width: "300px",
              }}
            >
              <div
                style={{
                  marginLeft: "3%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "300px",
                }}
              >
                <IconButton
                  style={{
                    marginRight: "10px",
                    marginLeft: "25%",
                    display: "flex",
                    alignItems: "center",
                  }}
                  onClick={() => {
                    var curr = new Date(currentStartWeek); // get current date
                    var first = curr.getDate() - curr.getDay() - 7; // First day is the  day of the month - the day of the week \

                    var firstday = new Date(curr.setDate(first)).toUTCString();
                    var lastday = new Date(
                      curr.setDate(curr.getDate() + 6)
                    ).toUTCString();
                    if (new Date(currentStartWeek) > new Date()) {
                      setCurrentStartWeek(formatSpecificDate(firstday));
                      setCurrentEndWeek(formatSpecificDate(lastday));
                    }
                  }}
                >
                  <ChevronLeftIcon />
                </IconButton>
                {daysList.map((day, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      if (true) {
                        if (selectedDays?.includes(specificDates[idx])) {
                          let selected = selectedDays;
                          var index1 = selected.indexOf(specificDates[idx]);
                          if (index1 !== -1) {
                            selected.splice(index1, 1);
                            // selectedAthletes[index] = {
                            //   ...selectedAthletes[index],
                            //   selected,
                            // };
                            setSelectedDays(selected);
                          }
                        } else {
                          if (
                            new Date(specificDates[idx]) > new Date() ||
                            specificDates[idx] === formatDate()
                          ) {
                            //   let selectedDays =
                            //     selectedAthletes[index].selectedDays;
                            //   selectedAthletes[index] = {
                            //     ...selectedAthletes[index],
                            //     selectedDays: [
                            //       ...selectedDays,
                            //       specificDates[idx],
                            //     ],
                            //   };
                            //   let temp = athlete_selecteddays;
                            //   temp[selectedAthletes[index].id] =
                            //     selectedAthletes[index].selectedDays;
                            //   setathlete_selecteddays(temp);
                            //   setSelectedAthletes([...selectedAthletes]);

                            let temp = [...selectedDays];
                            // selectedAthletes[index] = {
                            //   ...selectedAthletes[index],
                            //   selectedDays: [...selectedDays, specificDates[idx]],
                            // };
                            temp.push(specificDates[idx]);
                            setSelectedDays(temp);
                          }
                        }
                      }
                    }}
                    style={
                      selectedDays?.includes(specificDates[idx])
                        ? {
                            backgroundColor: "#ffe486",
                            color: "#fff",
                            width: "85px",
                            height: "25px",
                            justifyContent: "center",
                            alignItems: "center",
                            position: "relative",
                            borderRadius: "8px",
                            marginRight: "2px",
                            marginBottom: "5px",
                            padding: "5px",
                            cursor: "pointer",
                          }
                        : {
                            width: "85px",
                            height: "25px",
                            justifyContent: "center",
                            alignItems: "center",
                            position: "relative",
                            borderRadius: "8px",
                            marginRight: "2px",
                            marginBottom: "5px",
                            padding: "5px",
                            cursor: "pointer",
                          }
                    }
                  >
                    <div>
                      <div
                        style={{
                          fontSize: "12px",
                          fontWeight: "600",
                          lineHeight: "20px",
                          width: "80%",
                          textAlign: "center",
                          padding: "5px",
                          color: selectedDays?.includes(specificDates[idx])
                            ? "black"
                            : "black",
                        }}
                      >
                        {day}
                      </div>
                    </div>
                  </div>
                ))}

                <IconButton
                  style={{
                    marginLeft: "10%",
                    display: "flex",
                    alignItems: "center",
                  }}
                  onClick={() => {
                    var curr = new Date(currentStartWeek); // get current date
                    var first = curr.getDate() - curr.getDay() + 7; // First day is the  day of the month - the day of the week \

                    var firstday = new Date(curr.setDate(first)).toUTCString();
                    var lastday = new Date(
                      curr.setDate(curr.getDate() + 6)
                    ).toUTCString();

                    setCurrentStartWeek(formatSpecificDate(firstday));
                    setCurrentEndWeek(formatSpecificDate(lastday));
                  }}
                >
                  <ChevronRightIcon />
                </IconButton>
              </div>

              <div
                style={{
                  fontSize: "10px",
                  fontWeight: "500",
                  lineHeight: "18px",
                  display: "flex",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  width: "100%",
                  height: "25px",
                  marginLeft: "35px",
                  cursor: "pointer",
                }}
              >
                {specificDates?.map((tempDate, idx) => (
                  <div
                    style={{
                      width: "45px",
                      height: "30px",
                    }}
                    key={idx}
                  >
                    <div
                      style={{
                        fontSize: "10px",
                        fontWeight: "500",
                        lineHeight: "18px",
                        width: "100%",
                        paddingLeft: "5px",
                        paddingRight: "5px",
                        paddingBottom: "5px",
                        textAlign: "center",
                      }}
                    >
                      {formatSpecificDate1(tempDate)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div>
        <div
          style={{
            marginTop: 40,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <button
            class="button__assignVideo"
            style={{
              border: "none",
              padding: 10,
              width: 150,
              borderRadius: 10,
              backgroundColor: "#ffe486",
              fontSize: 15,
            }}
            onClick={() => {
              if (screen == 1) {
                let data = [...videoData];

                data.forEach((temp) => {
                  temp["checked"] = false;
                });
                setVideoData(data);
              }
              if (screen == 2) {
                setscreen(1);
              }
            }}
          >
            {screen == 1 ? "RESET" : "BACK"}
          </button>
          <button
            class="button__assignVideo"
            style={{
              border: "none",
              padding: 10,
              width: 150,
              borderRadius: 10,
              backgroundColor: "#ffe486",
              marginLeft: 20,
              fontSize: 15,
            }}
            onClick={() => {
              if (screen == 1) {
                setscreen(2);
              }

              if (screen == 2) {
                if (selectedAthletes?.length > 0 && videoData?.length > 0) {
                  console.log(userData?.id);
                  db.collection("WorkoutVideo")

                    .add({
                      Video: videoData,
                      AssignedById: userData?.id,
                      AssignedToId: selectedAthletes,
                      selectedDays: selectedDays,
                      timestamp:
                        firebase.firestore.FieldValue.serverTimestamp(),
                    })
                    .then((e) => {
                      alert("Video Assigned Successfully");
                      history.push("/vod");
                    })
                    .catch((error) => {
                      console.log(error);
                    });
                } else {
                  alert("select atleast one video and one athlete");
                }
              }
            }}
          >
            {screen == 1 ? "Select Athletes" : "Assign Video"}
          </button>

          {/* <button
            class="button__assignVideo"
            style={{
              border: "none",
              padding: 10,
              width: 150,
              borderRadius: 10,
              backgroundColor: "#ffe486",
              marginLeft: 20,
              fontSize: 15,
            }}
            onClick={() => {
              setselectmultiple(!selectmultiple);
            }}
          >
            Toggle Selection
          </button> */}
        </div>
      </div>
      <script src="https://player.vimeo.com/api/player.js"></script>
    </div>
  );
}

export default AssignVideo;
