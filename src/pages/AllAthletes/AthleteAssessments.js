import React from "react";
import { useHistory } from "react-router-dom";
import AthleteAssessment from "./AthleteAssessment";
import "./Profile.css";
import { useDispatch, useSelector } from "react-redux";
import {
  selectTemperoryId,
  selectUser,
  selectUserType,
} from "../../features/userSlice"

function AthleteAssessments(props) {
  const history = useHistory();
  const Id = props.Id;
  const userType = useSelector(selectUserType);
  return (
    <div className="athleteAssessments">
      <h2>Assessments and Measurements</h2>
      <AthleteAssessment
        name="Anthropometric Measurements"
        path="anthropometric-measurements"
        Id={Id}
      />
      <AthleteAssessment
        Id={Id}
        name="Medical Assessment"
        path="medical-assessment"
      />
      <AthleteAssessment
        name="Training Assessment"
        path="training-assessment"
        Id={Id}
      />
      <AthleteAssessment
        name="Food and Lifestyle Assessment"
        path="food-and-lifestyle-assessment"
        Id={Id}
      />
      {userType === "coach" ? (
        <div className="viewReport">
          <div onClick={() => history.push('/athlete-history')} className="viewReport__button">View Athlete History</div>
          <img src="/assets/white_right.png" alt="" />
        </div>
        ) : (<></>)}
      <div className="viewReport">
        <div
          className="viewReport__button"
          onClick={() => {
            window.open("/Athlete/reports/" + Id, "");
            //history.push("/Athlete/reports/" + Id)
          }}
        >
          View Report
        </div>
        <img src="/assets/white_right.png" alt="" />
      </div>
    </div>
  );
}

export default AthleteAssessments;
