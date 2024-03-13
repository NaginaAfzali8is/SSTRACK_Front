import React, { useEffect, useState } from "react";
// import UserHeader from "../screen/component/userHeader";
import Footer from "../screen/component/footer";
import menu from "../images/menu.webp";
import loader from "../images/Rectangle.webp";
import setting from "../images/settingIcon.webp";
import circle from "../images/circle.webp";
import middleLine from "../images/Line 3.webp";
import Screenshot from "./owner-setting-components/screenshot";
import line from "../images/line.webp";
import ActivityLevel from "./owner-setting-components/activitylevel";
import URL from "./owner-setting-components/url";
import UrlTracking from "./owner-setting-components/url";
import WeeklyLimit from "./owner-setting-components/weeklyLimit";
import { useActionData, useLocation } from "react-router-dom";
import AutoPause from "./owner-setting-components/autopause";
import OfflineTime from "./owner-setting-components/offlinetime";
import Notify from "./owner-setting-components/notify";
import WeekStart from "./owner-setting-components/weekStart";
import CurrencySymbol from "./owner-setting-components/currencySymbol";
import OwnerSection from "./ownerComponent/ownerSection";
import UserHeader from "../screen/component/userHeader";
// import AdminHeader from "./component/adminHeader";
// import AdminHead from "../screen/component/adminHeadSection";

function OwnerSettings() {
    const [activeComponent, setActiveComponent] = useState('component1');
    const location = useLocation()

    // const [componentState, setComponentState] = useState({
    //     showScreenShot: true,
    //     showActivityLevel: false,
    //     showUrlTracking: false,
    //     weeklyLimit: false,
    // });

    const handleButtonClick = (componentName) => {
        setActiveComponent(componentName)
        // const value = event.target.value;
        // setComponentState({
        //     showScreenShot: value === "screenshot",
        //     showActivityLevel: value === "activityLevel",
        //     showUrlTracking : value === "urltracking",
        //     weeklyLimit : value === "weeklylimit",
        // });
    }

    useEffect(() => {
        setActiveComponent(location.state)
    }, [location.state])

    console.log(location.state);

    return (
        <div className="container">
            <section>
                <div className="container">
                    <div className="userHeader">
                        <div className="headerTop">
                            <img src={setting} />
                            <h5>Settings</h5>
                        </div>
                    </div>
                    <div className="mainwrapper">
                        <div className="settingContainer">
                            <div className="settingMainDiv">
                                <div>
                                    <div>
                                        <button className={activeComponent === "component1" ? "activeButtonClass" : "screenshotButton"} onClick={() => handleButtonClick("component1")}>
                                            <p>Screenshots</p>
                                            <p className="hour12">12/hr</p>
                                        </button>
                                    </div>
                                    <div>
                                        <button className={activeComponent === "component2" ? "activeButtonClass" : "screenshotButton"} onClick={() => handleButtonClick("component2")}>
                                            <p>Activity level tracking</p>
                                            <p className="hour12">Yes</p>
                                        </button>
                                    </div>
                                    <div>
                                        <button className={activeComponent === "component3" ? "activeButtonClass" : "screenshotButton"} onClick={() => handleButtonClick("component3")}>
                                            <p>App & URL tracking</p>
                                            <p className="hour12">Yes</p>
                                        </button>
                                    </div>
                                    <div>
                                        <button className={activeComponent === "component4" ? "activeButtonClass" : "screenshotButton"} onClick={() => handleButtonClick("component4")}>
                                            <p>Weekly time limit</p>
                                            <p className="hour12">100 h</p>
                                        </button>
                                    </div>
                                    <div>
                                        <button className={activeComponent === "component5" ? "activeButtonClass" : "screenshotButton"} onClick={() => handleButtonClick("component5")}>
                                            <p>Auto pause tracking after</p>
                                            <p className="hour12">5 min</p>
                                        </button>
                                    </div>
                                    <div>
                                        <button className={activeComponent === "component6" ? "activeButtonClass" : "screenshotButton"} onClick={() => handleButtonClick("component6")}>
                                            <p>Allow adding offline time</p>
                                            <p className="hour12">Yes</p>
                                        </button>
                                    </div>
                                    <div>
                                        <button className={activeComponent === "component7" ? "activeButtonClass" : "screenshotButton"} onClick={() => handleButtonClick("component7")}>
                                            <p>Notify when screeshot is taken</p>
                                            <p className="hour12">Yes</p>
                                        </button>
                                    </div>
                                    <div>
                                        <button className={activeComponent === "component8" ? "activeButtonClass" : "screenshotButton"} onClick={() => handleButtonClick("component8")}>
                                            <p>Week starts on</p>
                                            <p className="hour12">Sun</p>
                                        </button>
                                    </div>
                                    <div>
                                        <button className={activeComponent === "component9" ? "activeButtonClass" : "screenshotButton"} onClick={() => handleButtonClick("component9")}>
                                            <p>Currency symbol</p>
                                            <p className="hour12">$</p>
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <img src={middleLine} />
                                </div>
                                <div className="componentScreenshot">
                                    {activeComponent === "component1" && <Screenshot />}
                                    {activeComponent === "component2" && <ActivityLevel />}
                                    {activeComponent === "component3" && <UrlTracking />}
                                    {activeComponent === "component4" && <WeeklyLimit />}
                                    {activeComponent === "component5" && <AutoPause />}
                                    {activeComponent === "component6" && <OfflineTime />}
                                    {activeComponent === "component7" && <Notify />}
                                    {activeComponent === "component8" && <WeekStart />}
                                    {activeComponent === "component9" && <CurrencySymbol />}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <div>
                <img className="admin1Line" src={line} />
            </div>
        </div>
    );
}


export default OwnerSettings;