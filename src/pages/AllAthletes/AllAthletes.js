import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { selectUserData, setTemperoryID } from "../../features/userSlice";
import { db } from "../../utils/firebase";
import "./AllAthletes.css";
import { Typography } from "@material-ui/core";
import ArrowBackIosRoundedIcon from "@material-ui/icons/ArrowBackIosRounded";
import SearchIcon from "@material-ui/icons/Search";
import ClearIcon from "@material-ui/icons/Clear";
import { useDispatch } from "react-redux";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

function AllAthletes() {
  const history = useHistory();
  const userData = useSelector(selectUserData);
  const [athletes, setAthletes] = useState([]);

  const dispatch = useDispatch();
  const [search, setsearch] = React.useState("");
  const [SearchList, setSearchList] = React.useState(null);
  const [SearchLoading, SetSearhLoading] = React.useState(false);

  const [sorting, setsorting] = React.useState("asc");
  const [openSearch, setopenSearch] = React.useState(false);
  const [showFilter, setShowFilter] = React.useState(false);

  useEffect(() => {
    if (userData?.id) {
      const data = [];
      db.collection("athletes")
        .orderBy("name", sorting)
        .get()
        .then((snapshot) => {
          snapshot.docs.forEach((athlete) => {
            if (userData?.data.listOfAthletes.includes(athlete.id)) {
              let currentID = athlete.id;
              let appObj = { ...athlete.data(), ["id"]: currentID };
              data.push(appObj);
            }
          });
          setAthletes(data);
        });
    }
  }, [userData?.id, sorting]);

  React.useEffect(() => {
    setSearchList(athletes);
    console.log(athletes);
  }, [athletes]);

  React.useEffect(async () => {
    SetSearhLoading(true);

    if (search?.length > 0) {
      const names = await athletes?.filter((athlete) => {
        return (
          athlete.name.toLowerCase().includes(search.toLowerCase()) ||
          athlete.email.toLowerCase().includes(search.toLowerCase())
        );
      });

      setSearchList(names);
      SetSearhLoading(false);
    } else {
      setSearchList(athletes);
      SetSearhLoading(false);
    }
  }, [search]);

  const options = [
    { value: "asc", label: "A-Z" },
    { value: "desc", label: "Z-A" },
  ];

  return (
    <div
      style={{ minHeight: "99.7vh", marginBottom: 50 }}
      className="allAthletes"
    >
      <div className="allAthletes__info">
        <div
          onClick={() => history.goBack()}
          style={{ marginTop: 20, display: "flex", alignItems: "center" }}
        >
          <ArrowBackIosRoundedIcon
            style={{ height: 18, width: 18, padding: 5, cursor: "pointer" }}
          />
          <Typography variant="h6" style={{ fontSize: 25, marginLeft: 5 }}>
            All Athletes
          </Typography>
        </div>
        <div
          style={{ marginTop: 20 }}
          className="allAthletes__inviteAthletesButton"
          onClick={() => history.push("/invite-athlete")}
        >
          <img src="/assets/fab.png" alt="" width="32px" height="32px" />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            marginLeft: 20,
            backgroundColor: "white",
            padding: 5,
            display: "flex",
            alignItems: "center",
            border: "1px solid black",
            width: 500,

            borderRadius: 10,
          }}
        >
          <input
            value={search}
            style={{
              width: "100%",
              display: "block",

              fontSize: 20,
              outline: "none",
              border: "none",
            }}
            onChange={(e) => {
              setsearch(e.target.value);
            }}
          />
          {search?.length == 0 ? (
            <div
              onClick={() => {
                setopenSearch(true);
                setsearch("");
              }}
            >
              <SearchIcon
                style={{
                  width: 30,
                  height: 30,
                }}
              />
            </div>
          ) : (
            <div
              onClick={() => {
                setsearch("");
              }}
            >
              <ClearIcon
                style={{
                  width: 30,
                  height: 30,
                }}
              />
            </div>
          )}
        </div>
        {/* <div
          style={{
            width: 150,
          }}
        >
          <Dropdown
            options={options}
            placeholder="Order By"
            onChange={(s) => {
              setsorting(s.value);
            }}
          />
        </div> */}
        <div
          style={{
            display: "flex",
            position: "relative",
            width: "100px",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <div className="filter_icon">
            <img
              onClick={() => {
                setShowFilter(!showFilter);
              }}
              src="/assets/filter.png"
              width="35px"
              height="35px"
            />
          </div>
          <div
            className="filter"
            style={{
              position: "absolute",
              marginTop: 40,
              display: showFilter ? "block" : "none",
              border: "1px solid black",
              fontSize: 12,
              borderRadius: 10,
            }}
          >
            <div
              onClick={() => {
                setsorting("desc");
                setShowFilter(false);
              }}
              style={{
                padding: 10,
                borderBottom: "1px solid black",
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                backgroundColor: sorting == "desc" ? "#fcd11c" : "white",
              }}
            >
              Recent
            </div>
            <div
              onClick={() => {
                setsorting("asc");
                setShowFilter(false);
              }}
              style={{
                padding: 10,
                backgroundColor: sorting == "asc" ? "#fcd11c" : "white",

                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
              }}
            >
              oldest to new
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: "#ffe486",
            padding: "8px 10px",
            borderRadius: 10,
            marginLeft: "auto",
          }}
          onClick={() => {
            history.push("/pending-invites");
          }}
        >
          <div>pending invites</div>
        </div>
      </div>
      {search?.length > 0 && (
        <div
          style={{
            fontSize: 13,
            marginLeft: 20,
          }}
        >
          {SearchList?.length} results found
        </div>
      )}

      {SearchList?.map((athlete) => (
        <div className="allAthletes__athletes">
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              className="allAthletes__athleteslogo"
              src="/assets/userImage.jpeg"
              alt=""
              width="40px"
              height="40px"
            />
            <p style={{ fontSize: 18, fontWeight: "500", marginLeft: 20 }}>
              {athlete.name}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              onClick={() =>
                history.push({
                  pathname: "/messaging",
                  state: {
                    id: null,
                    from_id: userData?.id,
                    to_id: athlete.id,
                    from_name: userData?.data.name,
                    to_name: athlete?.name,
                    type: "coach",
                  },
                })
              }
              src="/assets/message.png"
              alt=""
              width="20px"
              height="20px"
              style={{ cursor: "pointer" }}
            />
            <button
              onClick={() => {
                dispatch(setTemperoryID(athlete?.id));
                console.log(athlete?.id);
                history.push({
                  pathname: "/Athlete",
                  state: {
                    AthleteId: athlete?.id,
                  },
                });
              }}
              style={{
                marginLeft: 20,
                outline: "none",
                border: "none",
                padding: "5px 10px",
                backgroundColor: "#ffe486",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              View Profile
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AllAthletes;
