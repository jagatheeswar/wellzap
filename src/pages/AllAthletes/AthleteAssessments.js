import React from "react";
import { useHistory } from "react-router-dom";
import AthleteAssessment from "./AthleteAssessment";
import "./Profile.css";
import { useDispatch, useSelector } from "react-redux";
import {
  selectTemperoryId,
  selectUser,
  selectUserType,
} from "../../features/userSlice";

function AthleteAssessments(props) {
  const history = useHistory();

  const userType = useSelector(selectUserType);
  const dispatch = useDispatch();
  const temperoryId = useSelector(selectTemperoryId);
  return (
    <div className="athleteAssessments">
      <h2>Assessments and Measurements</h2>
      <AthleteAssessment
        name="Anthropometric Measurements"
        path="anthropometric-measurements"
        Id={temperoryId}
      />
      <AthleteAssessment
        Id={props?.Id}
        name="Medical Assessment"
        path="medical-assessment"
      />
      <AthleteAssessment
        name="Training Assessment"
        path="training-assessment"
        Id={temperoryId}
      />
      <AthleteAssessment
        name="Food and Lifestyle Assessment"
        path="food-and-lifestyle-assessment"
        Id={temperoryId}
      />
      {userType === "coach" ? (
        <div className="viewReport">
          <div
            onClick={() =>
              history.push({
                pathname: "/athlete-history/",
                state: {
                  id: temperoryId,
                },
              })
            }
            className="viewReport__button"
          >
            View Athlete History
          </div>
          <img src="/assets/white_right.png" alt="" />
        </div>
      ) : (
        <></>
      )}
      <div className="viewReport">
        <div
          className="viewReport__button"
          onClick={() => {
            // window.open("/Athlete/reports/" + Id, "");
            console.log(1);
            history.push({
              pathname: "/Athlete/reports",
              state: {
                AthleteId: temperoryId,
              },
            });
          }}
        >
          View Report
        </div>
        <img src="/assets/white_right.png" alt="" />
      </div>

      <div className="viewReport">
        <div
          className="viewReport__button"
          onClick={() => {
            // window.open("/Athlete/reports/" + Id, "");

            history.push({
              pathname: "/editpayments",
              state: {
                AthleteId: temperoryId,
              },
            });
          }}
        >
          View Payments
        </div>
        <img src="/assets/white_right.png" alt="" />
      </div>
    </div>
  );
}

export default AthleteAssessments;
