import React, { useEffect, useState } from "react";
import UserHeader from "../screen/component/userHeader";
import Footer from "../screen/component/footer";
import menu from "../images/menu.webp";
import loader from "../images/Rectangle.webp";
import setting from "../images/settingIcon.webp";
import circle from "../images/circle.webp";
import middleLine from "../images/Line 3.webp";
import Screenshot from "./settingScreenComponent/screenshot";
import line from "../images/line.webp";
import ActivityLevel from "./settingScreenComponent/activitylevel";
import URL from "./settingScreenComponent/url";
import UrlTracking from "./settingScreenComponent/url";
import WeeklyLimit from "./settingScreenComponent/weeklyLimit";
import { useActionData, useLocation } from "react-router-dom";
import AutoPause from "./settingScreenComponent/autopause";
import OfflineTime from "./settingScreenComponent/offlinetime";
import Notify from "./settingScreenComponent/notify";
import WeekStart from "./settingScreenComponent/weekStart";
import CurrencySymbol from "./settingScreenComponent/currencySymbol";
import AdminHeader from "./component/adminHeader";
import AdminHead from "../screen/component/adminHeadSection";

function Setting() {

    const [loading, setLoading] = useState(false)
    const [loading2, setLoading2] = useState(false)
    const [employess, setEmployess] = useState(null);
    const apiUrl = "http://54.158.251.164:9093/api/v1";
    let token = localStorage.getItem('token');
    let user = JSON.parse(localStorage.getItem('items'));
    let headers = {
        Authorization: 'Bearer ' + token,
    }

    async function getData() {
        setLoading(true)
        setLoading2(true)
        try {
            const response = await fetch(`${apiUrl}${user.userType === "admin" ? "/superAdmin/employees" : user.userType === "owner" ? "/owner/companies" : ""}`, { headers })
            const json = await response.json();
            setEmployess(() => {
                if (user.userType === "admin") {
                    const filterCompanies = json?.convertedEmployees?.filter((emp, index) => {
                        return user.company === emp.company && emp.isArchived === false && emp?.inviteStatus === false
                    })
                    return filterCompanies
                }
                else if (user.userType === "owner") {
                    const filterCompanies = json?.employees?.filter((emp, index) => {
                        return user.company === emp.company && emp.isArchived === false && emp?.inviteStatus === false
                    })
                    return filterCompanies
                }
            })
            setLoading2(false)
            setTimeout(() => {
                setLoading(false)
            }, 2000);
        }
        catch (error) {
            setLoading2(true)
            setLoading(false)
            console.log(error);
        }
    }

    useEffect(() => {
        getData()
    }, [])

    console.log(employess);

    const [settingsTabs, setSettingTabs] = useState([
        { id: 1, showSetting: <Screenshot loading={loading} loading2={loading2} employees={employess} setEmployess={setEmployess} />, name: "Screenshots", isActive: true, icon: "12/hr" },
        { id: 2, showSetting: <ActivityLevel loading={loading} loading2={loading2} employees={employess} setEmployess={setEmployess} />, name: "Activity level tracking", isActive: false, icon: "Yes" },
        { id: 3, showSetting: <UrlTracking loading={loading} loading2={loading2} employees={employess} setEmployess={setEmployess} />, name: "App & URL tracking", isActive: false, icon: "Yes" },
        { id: 4, showSetting: <WeeklyLimit loading={loading} loading2={loading2} employees={employess} setEmployess={setEmployess} />, name: "Weekly time limit", isActive: false, icon: "100 hr" },
        { id: 5, showSetting: <AutoPause loading={loading} loading2={loading2} employees={employess} setEmployess={setEmployess} />, name: "Auto pause tracking after", isActive: false, icon: "5 min" },
        { id: 6, showSetting: <OfflineTime loading={loading} loading2={loading2} employees={employess} setEmployess={setEmployess} />, name: "Allow adding offline time", isActive: false, icon: "Yes" },
        { id: 7, showSetting: <Notify loading={loading} loading2={loading2} employees={employess} setEmployess={setEmployess} />, name: "Notify when screeshot is taken", isActive: false, icon: "Yes" },
        { id: 8, showSetting: <WeekStart loading={loading} loading2={loading2} employees={employess} setEmployess={setEmployess} />, name: "Week starts on", isActive: false, icon: "Sun" },
        { id: 9, showSetting: <CurrencySymbol loading={loading} loading2={loading2} employees={employess} setEmployess={setEmployess} />, name: "Currency symbol", isActive: false, icon: "$" },
    ]);

    return (
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
                                {settingsTabs.map((tab) => {
                                    return (
                                        <button
                                            className={tab.isActive ? "activeButtonClass" : "screenshotButton"}
                                            onClick={() => {
                                                setSettingTabs((prevTabs) => {
                                                    return prevTabs.map((tabs, index) => {
                                                        if (tab.id === tabs.id) {
                                                            return {
                                                                ...tabs,
                                                                isActive: true
                                                            }
                                                        }
                                                        else {
                                                            return {
                                                                ...tabs,
                                                                isActive: false
                                                            }
                                                        }
                                                    })
                                                })
                                            }}>
                                            <p>{tab.name}</p>
                                            <p className="hour12">{tab.icon}</p>
                                        </button>
                                    )
                                })}
                            </div>
                            <div>
                                <img src={middleLine} />
                            </div>
                            <div className="componentScreenshot">
                                {/* {activeSetting === "component1" && <Screenshot />}
                                {activeSetting === "component2" && <ActivityLevel />}
                                {activeSetting === "component3" && <UrlTracking />}
                                {activeSetting === "component4" && <WeeklyLimit />}
                                {activeSetting === "component5" && <AutoPause />}
                                {activeSetting === "component6" && <OfflineTime />}
                                {activeSetting === "component7" && <Notify />}
                                {activeSetting === "component8" && <WeekStart />}
                                {activeSetting === "component9" && <CurrencySymbol />} */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <img className="admin1Line" src={line} />
            </div>
        </div>
    );
}

export default Setting;