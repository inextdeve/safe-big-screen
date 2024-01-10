const List = ({ type, onClick }) => {
  return React.createElement(
    "li",
    {
      onClick,
      className: "cameraTypeListItem",
    },
    `${type}`
  );
};

const CameraTypesList = ({
  GState,
  cameraIndex,
  listedCameras,
  updateListedCameras,
}) => {
  const { changeCameraType } = GState;

  const types = [
    { type: "front" },
    { type: "back" },
    { type: "driver" },
    { type: "all" },
    { type: "close" },
  ];

  return React.createElement(
    "ul",
    { className: "cameraTypeMenu" },
    ...types.map(({ type }) =>
      React.createElement(
        List,
        {
          type,
          onClick: () => {
            if (type === "close") {
              const listed = [...listedCameras];
              listed.splice(cameraIndex, 1);
              updateListedCameras(listed);
              return;
            }
            changeCameraType(
              `${
                type === "front"
                  ? "2"
                  : type === "back"
                  ? "0"
                  : type === "driver"
                  ? "1"
                  : "0,1,2"
              }`
            );
          },
        },
        null
      )
    )
  );
};

export default CameraTypesList;
