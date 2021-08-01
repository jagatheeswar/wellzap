import React from "react";
import { useHistory } from "react-router";
import "./Sidebar.css";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  DialogContentText,
} from "@material-ui/core";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function SidebarComponent({ logo, name, path }) {
  const history = useHistory();

  const [openDialog, setOpenDialog] = React.useState(false);

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <>
      {name !== "Support" ? (
        <div
          className="drawer__container"
          onClick={() => history.push(`/${path}`)}
        >
          <img src={`/assets/${logo}.png`} width="25px" height="25px" alt="" />
          <h1>{name}</h1>
        </div>
      ) : (
        <div className="drawer__container" onClick={handleClickOpenDialog}>
          <img src={`/assets/${logo}.png`} width="25px" height="25px" alt="" />
          <h1>{name}</h1>
        </div>
      )}
      <Dialog
        open={openDialog}
        TransitionComponent={Transition}
        keepMounted
        minWidth="md"
        fullWidth
        onClose={handleCloseDialog}
      >
        <DialogTitle>Support</DialogTitle>
        <DialogContent>
          <DialogContentText>Give Message - info@wellzap.io</DialogContentText>
          <DialogContentText>Phone - 9606096666</DialogContentText>
        </DialogContent>
        <DialogActions>
          <button
            style={{
              outline: "none",
              border: "none",
              backgroundColor: "#fcd54a",
              padding: "8px 30px",
              marginRight: 30,
              borderRadius: 10,
              fontWeight: "600",
              cursor: "pointer",
            }}
            onClick={() => handleCloseDialog()}
          >
            Ok
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default SidebarComponent;
