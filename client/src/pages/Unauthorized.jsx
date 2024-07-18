import React, { useEffect } from "react";

function Unauthorized() {
  useEffect(() => {
    const video = document.getElementById("unauthorizedVideo");
    video.play();
  }, []);
  return (
    <div className="relative  h-screen w-screen">
      <video
        id="unauthorizedVideo"
        className="absolute top-0 left-0 w-full h-full "
        autoPlay
        // playsInline
        // disablePictureInPicture
        // controlsList="nodownload nofullscreen noremoteplayback"
      >
        <source src="/public/new.mp4" type="video/mp4" />
      </video>
    </div>
  );
}

export default Unauthorized;
