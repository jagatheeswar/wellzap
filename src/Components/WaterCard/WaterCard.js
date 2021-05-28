import React from "react";
import { useSelector } from "react-redux";
import { selectUserData } from "../../features/userSlice";
import { db } from "../../utils/firebase";
import ProgressBarComponent from "../ProgressComponent/ProgressBarComponent";
import "./WaterCard.css";

function WaterCard({ date, water, setWater }) {
  const userData = useSelector(selectUserData);

  return (
    <div className="waterCard">
      <div className="waterCard__container">
        <h4>Water</h4>
        <div className="waterCard__buttons">
          <button
            className="waterCard__button"
            onClick={() => {
              if (water > 0) {
                let temp = { ...userData?.data?.metrics };

                if (temp[date]) {
                  let t = { ...temp[date] };
                  t.water = water - 1;
                  temp[date] = t;
                } else {
                  temp[date] = {
                    water: water - 1,
                  };
                }

                db.collection("athletes").doc(userData?.id).update({
                  metrics: temp,
                });
                setWater(water - 1);
              }
            }}
          >
            -
          </button>
          <button
            className="waterCard__button"
            onClick={() => {
              let temp = { ...userData?.data?.metrics };

              if (temp[date]) {
                let t = { ...temp[date] };
                t.water = water + 1;
                temp[date] = t;
              } else {
                temp[date] = {
                  water: water + 1,
                };
              }

              db.collection("athletes").doc(userData?.id).update({
                metrics: temp,
              });
              setWater(water + 1);
            }}
          >
            +
          </button>
        </div>
      </div>
      <div className="waterCard__progress">
        <ProgressBarComponent
          containerWidth={"90%"}
          progress={(water / 10) * 100}
          progressColor="#FFE66D"
        />
      </div>
      <h4>{water}/10 glasses</h4>
    </div>
  );
}

export default WaterCard;
