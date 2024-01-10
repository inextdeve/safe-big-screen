// import dots from "../../../images/icons/dots.svg";

const CameraTitle = ({ name }) => {
  return React.createElement("h6", { className: "cameraTitle" }, `${name}`);
};

const MoreButton = ({ onClick }) => {
  return React.createElement(
    "button",
    { className: "moreButton", onClick },
    React.createElement("img", { src: "./images/icons/dots.svg" }, null)
  );
};

const CameraHeader = ({ name, toggleShowMenu }) => {
  return React.createElement(
    "div",
    { className: "cameraHeader" },
    React.createElement(CameraTitle, { name }, null),
    React.createElement(MoreButton, { onClick: toggleShowMenu }, null)
  );
};

export { CameraTitle };
export default CameraHeader;
