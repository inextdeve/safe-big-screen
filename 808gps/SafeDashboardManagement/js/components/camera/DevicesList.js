const List = ({ name, className, onClick }) => {
  return React.createElement(
    "div",
    { className: `deviceRow ${className}`, onClick },
    `${name}`
  );
};

const DevicesList = ({
  devices,
  selectedDevices,
  updateListedCameras,
  deviceListVisibility,
}) => {
  return React.createElement(
    "div",
    { className: "devicesList" },
    React.createElement(
      "button",
      {
        className: "deviceListClose",
        onClick: () => deviceListVisibility(false),
      },
      "Close"
    ),
    devices.map((device, index) =>
      React.createElement(
        List,
        {
          key: index,
          name: device.device_name,
          className: `${
            selectedDevices.some(
              (selectedD) => device.device_name === selectedD.device_name
            )
              ? "selectedDeviceRow"
              : ""
          }`,
          onClick: () => {
            const selected = [...selectedDevices];
            selected.unshift(device);
            updateListedCameras(selected);
          },
        },
        null
      )
    )
  );
};

export default DevicesList;
