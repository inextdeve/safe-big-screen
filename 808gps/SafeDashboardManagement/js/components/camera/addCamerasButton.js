import { CameraTitle } from "./cameraHeader.js";

const AddCamerasButton = ({ deviceListVisibility }) => {
  return React.createElement(
    "div",
    { className: "camera" },
    React.createElement(
      "div",
      { className: "cameraHeader" },
      React.createElement(CameraTitle, { name: "Add or Change Camera" }, null)
    ),
    React.createElement(
      "div",
      {
        className: "ChangeAddCameraBtn",
        onClick: () => deviceListVisibility(true),
      },
      React.createElement(
        "img",
        { src: "./images/icons/add.svg", width: "100%" },
        null
      )
    )
  );
};
export default AddCamerasButton;
