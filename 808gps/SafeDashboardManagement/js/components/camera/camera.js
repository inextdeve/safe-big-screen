import CameraHeader from "./cameraHeader.js";
import CameraVideo from "./cameraVideo.js";
import CameraTypesList from "./cameraTypesList.js";
const Camera = ({
  name,
  mdvrID,
  index,
  updateListedCameras,
  listedCameras,
}) => {
  const [cameraType, setCameraType] = React.useState("2");
  const [showMenu, setShowMenu] = React.useState(false);

  const toggleShowMenu = () => setShowMenu((prev) => !prev);

  const changeCameraType = (type) => {
    setCameraType(type);
    toggleShowMenu();
  };
  return React.createElement(
    "div",
    { className: "camera" },
    React.createElement(CameraHeader, { name, toggleShowMenu }, null),
    React.createElement(CameraVideo, { mdvrID, chns: cameraType }, null),
    showMenu
      ? React.createElement(
          CameraTypesList,
          {
            GState: { changeCameraType },
            cameraIndex: index,
            updateListedCameras,
            listedCameras,
          },
          null
        )
      : null
  );
};
export default Camera;
