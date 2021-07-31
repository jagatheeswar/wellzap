import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > * + *": {
      marginLeft: theme.spacing(2),
    },
  },
  circle: {
    color: "#FFE486",
  },
}));

function ProgressCircle({ progress }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CircularProgress
        className={classes.circle}
        variant="determinate"
        value={100}
        size={100}
        thickness={6}
        colorPrimary="black"
        value={progress * 100}
        progressColor={"red"}
      />
    </div>
  );
}

export default ProgressCircle;
