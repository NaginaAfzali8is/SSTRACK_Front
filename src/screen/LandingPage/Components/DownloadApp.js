import React from "react";
import appStore from "../../../images/appstored.svg"; // Replace with your App Store logo path
import playStore from "../../../images/playstored.svg"; // Replace with your Google Play logo path
import phoneMockup from "../../../images/downlaod.svg"; // Replace with your phone mockup path


function DownloadApp({ language }) {
  const isArabic = language === "ar";
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        minHeight: '100vh',
        padding: "3rem",
        backgroundColor: "#FFFFFF",
      }}
    >
      {/* Left Section */}
      <div
        style={{
          flex: "1",
          textAlign: "left",
        }}
      >
        <h2
          style={{
            fontSize: "41.5px",
            fontWeight: "700",
            color: "#7ACB59",
            marginBottom: "1rem",
            textAlign: isArabic ? "right" : "left",
          }}
        >
          {isArabic ? "قم بتحميل تطبيقنا" : "Download Our App"}
        </h2>
        <p
          style={{
            fontSize: "16px",
            fontWeight: "400",
            color: "#3B3C4E",
            marginBottom: "2rem",
            textAlign: isArabic ? "right" : "left",
          }}
        >
          {isArabic ? "قم بتحميل تطبيقنا لتتبع جهود موظفيك بكل سهولة!" : "Download Our App To Track Your Employees Effortlessly!"}
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            // backgroundColor:'red',
            gap: "1rem",
          }}
        >
          {/* <a href="/#" target="_blank" rel="noopener noreferrer"> */}
            <img
              src={appStore}
              alt="App Store"
              style={{
                width: "125px",
                height: "auto",
              }}
            />
          {/* </a> */}
          <a href="https://play.google.com/store/apps/details?id=com.SSTRACK&pcampaignid=web_share" target="_blank" rel="noopener noreferrer">
            <img
              src={playStore}
              alt="Google Play"
              style={{
                width: "125px",
                height: "auto",
              }}
            />
          </a>
        </div>
      </div>

      {/* Right Section */}
      <div
        style={{
          flex: "1.5",
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          src={phoneMockup}
          alt="Phone Mockup"
          style={{
            width: "49rem",
            zIndex: "2",
            // marginLeft:'-25%'
          }}
        />

      </div>
    </div>
  );
}

export default DownloadApp;
