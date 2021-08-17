import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { selectUserType } from "../../features/userSlice";
import { formatDate } from "../../functions/formatDate";
import "./Nutrition.css";
import { Typography } from "@material-ui/core";
import ArrowBackIosRoundedIcon from "@material-ui/icons/ArrowBackIosRounded";

function NutritionScreenHeader({ name, entireFood, todaysFoodId }) {
  const userType = useSelector(selectUserType);
  const history = useHistory();

  return (
    <div className="nutritionScreenHeader">
      <div className="nutritionHeader__info">
        <div
          onClick={() => history.goBack()}
          style={{ marginTop: 20, display: "flex", alignItems: "center" }}
        >
          <ArrowBackIosRoundedIcon
            style={{ height: 18, width: 18, padding: 5, cursor: "pointer" }}
          />
          <Typography variant="h6" style={{ fontSize: 25, marginLeft: 5 }}>
            {name}
          </Typography>
        </div>
      </div>

      {name === "Nutrition" && (
        <>
          {userType == "coach" && (
            <div
              className="addNutrition__button"
              onClick={() =>
                history.push({
                  pathname: "/long-term-nutrition",
                  state: {
                    entireFood: entireFood,
                    todaysFoodId: todaysFoodId,
                  },
                })
              }
            >
              <img
                src="/assets/plus_thin.png"
                alt=""
                width="15px"
                height="15px"
              />
              <h5>ADD LONG TERM MEAL</h5>
            </div>
          )}
          <div
            className="addNutrition__button"
            onClick={() =>
              history.push({
                pathname: "/add-meal",
                state: {
                  entireFood: entireFood,
                  todaysFoodId: todaysFoodId,
                },
              })
            }
          >
            <img
              src="/assets/plus_thin.png"
              alt=""
              width="15px"
              height="15px"
            />
            <h5>ADD MEAL</h5>
          </div>
        </>
      )}
    </div>
  );
}

export default NutritionScreenHeader;
