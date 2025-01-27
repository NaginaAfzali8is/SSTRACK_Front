import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import middleLine from "../images/Line 3.webp";
import line from "../images/line.webp";
import setting from "../images/settingIcon.webp";
import { getEmployess, setActiveTab } from "../store/adminSlice";
import ActivityLevel from "./settingScreenComponent/activitylevel";
import AutoPause from "./settingScreenComponent/autopause";
import BreakTime from './settingScreenComponent/breakTime';
import OfflineTime from "./settingScreenComponent/offlinetime";
import Punctuality from './settingScreenComponent/punctuality';
import Screenshot from "./settingScreenComponent/screenshot";
import UrlTracking from "./settingScreenComponent/url";
import jwtDecode from "jwt-decode";
import UserHeader from "../screen/component/userHeader";
import Footer from "../screen/component/footer";

function Setting() {
    const [loading, setLoading] = useState(false);
    const [settingsTabs, setSettingTabs] = useState([
        { id: 1, name: "Screenshots", isActive: true, icon: ">" },
        { id: 2, name: "Activity level tracking", isActive: false, icon: ">" },
        { id: 3, name: "App & URL tracking", isActive: false, icon: ">" },
        { id: 5, name: "Auto pause tracking after", isActive: false, icon: ">" },
        { id: 6, name: "Allow adding offline time", isActive: false, icon: ">" },
        { id: 7, name: "Break Time", isActive: false, icon: ">" },
        { id: 8, name: "Punctuality", isActive: false, icon: ">" },
    ]);

    const apiUrl = "https://myuniversallanguages.com:9093/api/v1";
    let token = localStorage.getItem('token');
    let user = jwtDecode(token);
    const userType = user.userType;
    let headers = {
        Authorization: 'Bearer ' + token,
    };
    const dispatch = useDispatch();

    async function getData() {
        try {
            const response = await fetch(`${apiUrl}/superAdmin/employees`, { headers });
            const json = await response.json();
            dispatch(getEmployess(json?.convertedEmployees));
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getData();

        // Check if the user is admin or owner
        if (userType === "admin" || userType === "owner") {
            // If user is admin or owner, set the "Activity level tracking" tab as active
            console.log('tabbbbbbbbb if', userType)
            dispatch(setActiveTab({ id: 1, name: "Screenshots", isActive: true, icon: ">" }));
            handleTabClick({ id: 1, name: "Screenshots", isActive: true, icon: ">" });
        } else {
            // Otherwise, set the "Screenshots" tab as active
            console.log('tabbbbbbbbb else', userType)

            dispatch(setActiveTab({ id: 2, name: "Activity level tracking", isActive: true, icon: ">" }));
            handleTabClick({ id: 2, name: "Activity level tracking", isActive: false, icon: ">" });
        }
    }, []);



    // Function to find and set the next available tab
    const handleTabClick = (tab) => {

        setSettingTabs((prevTabs) => {
            const updatedTabs = prevTabs.map((t) =>
                t.id === tab.id ? { ...t, isActive: true } : { ...t, isActive: false }
            );

            // Find the next tab that is inactive and set it as active
            const nextInactiveTab = updatedTabs.find((t) => !t.isActive);
            if (nextInactiveTab) {
                updatedTabs.forEach((t) =>
                    t.id === nextInactiveTab.id ? { ...t, isActive: true } : t
                );
            }

            return updatedTabs;
        });

        // Dispatch the active tab to the store
        dispatch(setActiveTab({ ...tab, isActive: true }));
    };

    return (
        <>
            <UserHeader />
            <div>
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
                                    {settingsTabs
                                        .filter(
                                            (tab) =>
                                                !(tab.id === 1 && userType !== "owner" && userType !== "admin") &&
                                                // Filter out "Allow adding offline time" tab if the user is not owner/admin
                                                !(tab.id === 6 && userType !== "owner" && userType !== "admin")
                                        ) // Filter out the "Screenshots" tab if user is not owner/admin
                                        .map((tab) => (
                                            <button
                                                className={tab.isActive ? "activeButtonClass" : "screenshotButton"}
                                                onClick={() => handleTabClick(tab)} // Use the new handleTabClick function
                                            >
                                                <p>{tab.name}</p>
                                                <p className="hour12">{tab.icon}</p>
                                            </button>
                                        ))}
                                </div>
                                <div>
                                    <img src={middleLine} />
                                </div>
                                <div className="componentScreenshot">
                                    {settingsTabs[0].isActive &&
                                        (userType === "owner" || userType === "admin") && (
                                            <Screenshot activeTab={settingsTabs[0]} />
                                        )}
                                    {settingsTabs[1].isActive && <ActivityLevel activeTab={settingsTabs[1]} />}
                                    {settingsTabs[2].isActive && <UrlTracking activeTab={settingsTabs[2]} />}
                                    {settingsTabs[3].isActive && <AutoPause activeTab={settingsTabs[3]} />}
                                    {settingsTabs[4].isActive &&
                                        (userType === "owner" || userType === "admin") && (
                                            <OfflineTime activeTab={settingsTabs[4]} />
                                        )}

                                    {settingsTabs[5].isActive && <BreakTime activeTab={settingsTabs[5]} />}
                                    {settingsTabs[6].isActive && <Punctuality activeTab={settingsTabs[6]} />}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <img className="admin1Line" src={line} />
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Setting;
