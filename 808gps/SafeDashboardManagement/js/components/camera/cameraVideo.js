import { streamURL } from "../../utils/constant.js";

const CameraVideo = ({ mdvrID, chns = 1 }) => {
  const link = `${streamURL}/808gps/open/player/video.html?lang=en&vehiIdno=${mdvrID}&account=admin=admin&password=Hqasem13579!&channel=${
    chns === "0,1,2" ? "3" : "1"
  }&chns=${chns}`;

  return React.createElement(
    "div",
    { className: "cameraVideo" },
    React.createElement(
      "iframe",
      { className: "cameraIframe", src: link, allowFullScreen: true },
      null
    )
  );
};

export default CameraVideo;
