import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { selectUserType } from "../../features/userSlice";

const PaymentsScreenHeader = ({ name, navigation }) => {
  const userType = useSelector(selectUserType);
  const history = useHistory();

  return (
    <div className="workoutsHeader">
      <div className="workoutsHeader__info">
        <div
          className="workoutsHeader__backButton"
          onClick={() => history.goBack()}
        >
          <img src="/assets/left_arrow.png" alt="" width="15px" height="15px" />{" "}
        </div>
        <h1>{name}</h1>
      </div>
    </div>
  );
};

export default PaymentsScreenHeader;
