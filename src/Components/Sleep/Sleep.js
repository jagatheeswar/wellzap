import React from "react";
import "./Sleep.css";
import PropTypes from "prop-types";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";
import { formatDate } from "../../functions/formatDate";

const useStyles = makeStyles((theme) => ({
  root: {
    width: 300 + theme.spacing(3) * 2,
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

function Sleep({ sleep, setSleep }) {
  const classes = useStyles();

  const handleChange = (event, newValue) => {
    setSleep(newValue);
  };

  return (
    <div className="sleep">
      <div className={classes.root}>
        <Typography gutterBottom>Add Last Nights Sleep</Typography>
        <PrettoSlider
          valueLabelDisplay="auto"
          aria-label="pretto slider"
          defaultValue={0}
          min={0}
          max={24}
          value={sleep}
          onChange={handleChange}
        />
        <h6>
          {formatDate()} - {sleep} hrs
        </h6>
      </div>

      <div className="soreness">
        <h4>How Sore do you feel?</h4>
        <div className="emoji__container">
          <div className="emoji__div">
            <Emoji symbol=" 😖 " />
            <h6>Very Sore</h6>
          </div>
          <div className="emoji__div">
            <Emoji symbol=" 😐 " />
            <h6>Moderately Sore</h6>
          </div>
          <div className="emoji__div">
            <Emoji symbol=" 😁 " />
            <h6>Not Sore</h6>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sleep;
