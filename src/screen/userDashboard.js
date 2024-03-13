
import React, { useEffect, useState } from "react";
import line from "../images/line.webp";
import check from "../images/online.webp";
import screenshot from "../images/white.svg";
import setting from "../images/setting.webp";
import { Link, useNavigate } from "react-router-dom";
import UserDashboardSection from "./component/userDashboardsection";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'
import useLoading from "../hooks/useLoading";
import axios from "axios";
import offline from "../images/not-active.svg";
import Pusher from 'pusher-js';
import moment from 'moment-timezone';

function UserDasboard() {

    const [lastScreenshot, setLastScreenshot] = useState(null)
    const [activeUser, setActiveUser] = useState(null)
    const { loading, setLoading } = useLoading()
    const [data, setData] = useState({});
    const navigate = useNavigate();
    let token = localStorage.getItem('token');
    let headers = {
        Authorization: 'Bearer ' + token,
    }
    const apiUrl = "http://54.158.251.164:9093/api/v1";

    async function getData() {
        setLoading(true)
        try {
            const response = await axios.get(`${apiUrl}/timetrack/hours`, {
                headers,
            })
            if (response.status) {
                setTimeout(() => {
                    setLoading(false)
                }, 1000);
                setData(response.data)
                console.log(response);
            }
        }
        catch (error) {
            setTimeout(() => {
                setLoading(false)
            }, 1000);
            console.log(error);
        }
    }

    useEffect(() => {
        getData();
    }, [])

    // var pusher = new Pusher('334425b3c859ed2f1d2b', {
    //     cluster: 'ap2'
    // });

    // var channel = pusher.subscribe('ss-track');

    // channel.bind('my-user', (data) => {
    //     setActiveUser(data?.data)
    //     console.log("active user ===>", data.data);
    // });

    // useEffect(() => {
    //     var channel = pusher.subscribe('ss-track');
    //     channel.bind("new-ss", (data) => {
    //         setLastScreenshot(data?.data)
    //         console.log("new ss ===>", data);
    //     });
    //     return () => {
    //         channel.unbind("new-ss");
    //     };
    // }, [])

    // channel.bind('my-event', (data) => {
    //     console.log(JSON.stringify(data));
    // });

    const items = JSON.parse(localStorage.getItem('items'));

    const offsetInMinutes = moment.tz(items?.timezone).utcOffset();
    const offsetInHours = offsetInMinutes / 60;
    const offsetSign = offsetInHours >= 0 ? '+' : '-';
    const formattedOffset = `${offsetSign}${Math.abs(offsetInHours)}`;

    return (
        <div>
            <div className="container">
                <div className="userHeader">
                    <div>
                        <h5>Employee Dashboard</h5>
                    </div>
                    <div className="headerTop">
                        <h6>All times are UTC {formattedOffset}</h6>
                        <img src={setting} alt="setting.png" style={{ cursor: "pointer" }} onClick={() => navigate("/account")} />
                    </div>
                </div>
                <div className="mainwrapper">
                    <div className="userDashboardContainer">
                        <div className="dashheadings">
                            <p style={{ fontSize: "18px", color: "#0D3756" }} className="dashheadingtop">Employee</p>
                            <p style={{ fontSize: "18px", color: "#0D3756" }} className="dashheadingtop textalign">Last active</p>
                            <p style={{ fontSize: "18px", color: "#0D3756" }} className="dashheadingtop textalign">Today</p>
                            <p style={{ fontSize: "18px", color: "#0D3756" }} className="dashheadingtop textalign">Yesterday</p>
                            <p style={{ fontSize: "18px", color: "#0D3756" }} className="dashheadingtop textalign">This week</p>
                            <p style={{ fontSize: "18px", color: "#0D3756" }} className="dashheadingtop textalign">This Month</p>
                        </div>
                        {loading || data.length === 0 ? (
                            <Skeleton count={1} height="107px" style={{ margin: "0 0 10px 0" }} />
                        ) : (
                            <div onClick={() => navigate('/userdashboard/userdetail')} className={`dashsheadings ${data.isActive === true ? "activeColorChange" : "bgColorChange"}`} key={data.userId}>
                                <div className="companyNameverified">
                                    <img src={activeUser?.isActive ? check : data?.data?.isActive ? check : offline} alt="Verified" />
                                    <h5 className="dashCompanyName">{data?.data?.name}</h5>
                                </div>
                                <div className="companyNameverified lastActive" style={{ width: "100%" }}>
                                    <img
                                        onClick={() => navigate('/userdashboard/userdetail')}
                                        className="screenShotPreview"
                                        src={lastScreenshot?.key ? lastScreenshot?.key : data?.data?.lastScreenshot?.key ? data?.data?.lastScreenshot?.key : screenshot}
                                        alt="Screenshot"
                                    />
                                    <p className="dashheadingtop">
                                        ({data?.data?.lastActiveTime === "0 minute ago" || data?.data?.lastActiveTime === "-1 minute ago" ? "a minute ago" : data?.data?.lastActiveTime})
                                    </p>
                                </div>
                                <div className="nameVerified">
                                    <p className="dashheadingtop textalign">{data?.data?.totalHours?.daily}</p>
                                    <p className="screenShotAmount" style={{ color: data.isActive === false && "#28659C" }}>${data?.data?.billingAmounts?.daily}</p>
                                </div>
                                <div className="nameVerified">
                                    <p className="dashheadingtop textalign">{data?.data?.totalHours?.yesterday}</p>
                                    <p className="screenShotAmount" style={{ color: data.isActive === false && "#28659C" }}>${data?.data?.billingAmounts?.yesterday}</p>
                                </div>
                                <div className="nameVerified">
                                    <p className="dashheadingtop textalign">{data?.data?.totalHours?.weekly}</p>
                                    <p className="screenShotAmount" style={{ color: data.isActive === false && "#28659C" }}>${data?.data?.billingAmounts?.weekly}</p>
                                </div>
                                <div className="nameVerified">
                                    <p className="dashheadingtop textalign">{data?.data?.totalHours?.monthly}</p>
                                    <p className="screenShotAmount" style={{ color: data.isActive === false && "#28659C" }}>${data?.data?.billingAmounts?.monthly}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <img className="userDasboardLine" src={line} />
        </div>
    )
}

export default UserDasboard;