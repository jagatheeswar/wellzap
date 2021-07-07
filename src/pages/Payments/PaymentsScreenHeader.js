import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { selectUserType } from "../../features/userSlice";
import {Typography} from "@material-ui/core";
import ArrowBackIosRoundedIcon from '@material-ui/icons/ArrowBackIosRounded';

const PaymentsScreenHeader = ({ name, navigation }) => {
  const userType = useSelector(selectUserType);
  const history = useHistory();

  return (
    <div className="workoutsHeader">
      <div className="workoutsHeader__info">
        <div onClick={() => history.goBack()} style={{marginTop: 20, display: "flex", alignItems: 'center'}} >
          <ArrowBackIosRoundedIcon style={{height: 18, width: 18, padding: 5, cursor: "pointer"}} />
          <Typography variant="h6" style={{fontSize: 25, marginLeft: 5}}>{name}</Typography>
        </div>
      </div>
    </div>
  );
};

export default PaymentsScreenHeader;
