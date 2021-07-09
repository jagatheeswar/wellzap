import React, { useState, useEffect } from "react";
import "./Sleep.css";
import PropTypes from "prop-types";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { Slider, Typography, IconButton } from "@material-ui/core";
import { formatDate } from "../../functions/formatDate";
import {
  Edit,
  EmojiEmotionsOutlined,
  DoneRounded,
  SentimentVeryDissatisfiedOutlined,
  SentimentDissatisfied,
} from "@material-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { selectUserData, selectUserType } from "../../features/userSlice";
import { db } from "../../utils/firebase";
const useStyles = makeStyles((theme) => ({
  root: {
    width: 300 + theme.spacing(3) * 2,
    // marginLeft: 15
  },
  margin: {
    height: theme.spacing(1),
  },
}));

const PrettoSlider = withStyles({
  root: {
    color: "#fcd54a",
    height: 1,
    width: "90%",
    marginLeft: 15,
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    marginTop: -8,
    marginLeft: -12,
    "&:focus, &:hover, &$active": {
      boxShadow: "inherit",
    },
  },
  active: {},
  valueLabel: {
    left: "calc(-50% + 4px)",
  },
  track: {
    height: 8,
    borderRadius: 4,
  },
  rail: {
    height: 8,
    borderRadius: 4,
  },
})(Slider);

const Emoji = (props) => (
  <h1
    className="emoji"
    role="img"
    aria-label={props.label ? props.label : ""}
    aria-hidden={props.label ? "false" : "true"}
  >
    {props.symbol}
  </h1>
);

function Sleep(props) {
  const classes = useStyles();
  const userData = useSelector(selectUserData);
  const userType = useSelector(selectUserType);
  const [sleep, setSleep] = React.useState(6);
  const [requestDate, setRequestDate] = useState(props.date);
  const [soreness, setSoreness] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);
  const [editable, setEditable] = useState(false);
  const [updatedSleep, setUpdatedSleep] = useState(false);
  const [updatedSoreness, setUpdatedSoreness] = useState(false);

  const handleChange = (event, newValue) => {
    setSleep(newValue);
  };

  useEffect(() => {
    console.log(userData?.id);
    if (userData?.id) {
      db.collection("athletes")
        .doc(userData?.id)
        .get()
        .then((doc) => {
          // console.log(doc.data());

          if (doc.data().metrics) {
            if (doc.data().metrics[requestDate]) {
              if (doc.data().metrics[requestDate]?.sleep) {
                setUpdatedSleep(true);
                console.log("sleep : ", doc.data().metrics[requestDate].sleep);
                setSleep(doc.data().metrics[requestDate].sleep);
              } else {
                setSleep(0);
                setUpdatedSleep(false);
              }
              if (doc.data().metrics[requestDate]?.soreness) {
                setUpdatedSoreness(true);
                console.log(
                  "sleep : ",
                  doc.data().metrics[requestDate].soreness
                );
                setSoreness(doc.data().metrics[requestDate].soreness);
              } else {
                setSoreness("");
                setUpdatedSoreness(false);
              }
            } else {
              setUpdatedSleep(false);
              setUpdatedSoreness(false);
              setSleep(0);
              setSoreness("");
              // setWater(0)
            }
          }
        });
    }
  }, [userData?.id, requestDate]);

  return (
    <div
      className="sleep"
      style={{
        marginLeft: 0,
        marginRight: 20,
      }}
    >
      <div className={classes.root}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontFamily: "Montserrat",
              display: "flex",
              alignItems: "center",
            }}
          >
            <p style={{ fontSize: 16, fontFamily: "Montserrat" }}>
              Add Last Nights Sleep
            </p>
            {updatedSleep && (
              <span onClick={(e) => setEditable(true)}>
                <DoneRounded style={{ color: "#41c300" }} />
              </span>
            )}
          </div>
          {editable === false ? (
            <IconButton onClick={(e) => setEditable(true)}>
              <Edit />
            </IconButton>
          ) : (
            <IconButton
              onClick={() => {
                let temp = { ...userData?.data?.metrics };

                if (temp[requestDate]) {
                  console.log("If part ", temp[requestDate]);
                  let t = { ...temp[requestDate] };
                  t.sleep = sleep;
                  t.soreness = soreness;
                  temp[requestDate] = t;
                } else {
                  temp[requestDate] = {
                    sleep: sleep,
                    soreness: soreness,
                  };
                  console.log("Temp in else part", temp[requestDate]);
                }

                db.collection("athletes")
                  .doc(userData?.id)
                  .update({
                    metrics: temp,
                  })
                  .then((docRef) => {
                    console.log("Document updated successfully! ", docRef);
                    setEditable(false);
                    if (sleep) {
                      setUpdatedSleep(true);
                    }
                    if (soreness) {
                      setUpdatedSoreness(true);
                    }
                  });
              }}
            >
              <DoneRounded />
            </IconButton>
          )}
        </div>
        <PrettoSlider
          valueLabelDisplay="auto"
          aria-label="pretto slider"
          defaultValue={0}
          min={0}
          max={12}
          step={0.25}
          value={sleep}
          onChange={handleChange}
          disabled={!editable}
        />
        <h6
          style={{
            textAlign: "center",
          }}
        >
          {requestDate} - {sleep} hrs
        </h6>
      </div>

      <div className="soreness">
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ fontFamily: "Montserrat" }}>
            How Sore do you feel?
          </span>
          {updatedSoreness && (
            <span onClick={(e) => setEditable(true)}>
              <DoneRounded style={{ color: "#41c300" }} />
            </span>
          )}
        </div>
        <div className="emoji__container">
          <div className="emoji__div">
            {/* <Emoji symbol=" 😖 " /> */}
            <IconButton
              onClick={() => {
                if (editable) {
                  setSoreness("very-sore");
                }
              }}
              style={{
                padding: 0,
                backgroundColor:
                  soreness === "very-sore" ? "#ED200D" : "initial",
              }}
            >
              <SentimentVeryDissatisfiedOutlined fontSize="large" />
            </IconButton>
            <span>Very Sore</span>
          </div>
          <div className="emoji__div">
            {/* <Emoji symbol=" 😐 " /> */}
            <IconButton
              onClick={() => {
                if (editable) {
                  setSoreness("moderately-sore");
                }
              }}
              style={{
                padding: 0,
                backgroundColor:
                  soreness === "moderately-sore" ? "#ffde03" : "initial",
              }}
            >
              <SentimentDissatisfied fontSize="large" />
            </IconButton>
            <span>Moderately Sore</span>
          </div>
          <div className="emoji__div">
            <IconButton
              onClick={() => {
                if (editable) {
                  setSoreness("not-sore");
                }
              }}
              style={{
                padding: 0,
                backgroundColor:
                  soreness === "not-sore" ? "#09af00" : "initial",
              }}
            >
              <EmojiEmotionsOutlined fontSize="large" />
            </IconButton>
            {/* <Emoji symbol=" 😁 " /> */}
            <span>Not Sore</span>
          </div>
        </div>
        {successMessage !== null ? (
          <p
            style={{
              fontFamily: "Montserrat",
            }}
          >
            {successMessage}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default Sleep;
