import React, { useState } from "react";
import UserHeader from "./component/userHeader";
import menu from "../images/menu.webp";
import loader from "../images/Rectangle.webp";
import check from "../images/check.webp";
import circle from "../images/circle.webp";
import user from "../images/user-account.webp";
import email from "../images/email.webp";
import passwords from "../images/passwordIcon.webp";
import edit from "../images/editIcon.webp";
import deleteIcon from "../images/deleteIcon.webp";
import line from "../images/line.webp";
import Footer from "./component/footer";
import UserDashboardSection from "./component/userDashboardsection";
import { json, useNavigate } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import axios from "axios";
import moment from "moment-timezone";

function Account() {

    const [show, setShow] = useState(false);
    const [deleteAccount, setDeleteAccount] = useState(false);
    const [updatePassword, setUpdatePassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPassword2, setNewPassword2] = useState("");
    const [verify, setVerify] = useState(false);
    let token = localStorage.getItem('token');
    const navigate = useNavigate('');
    const apiUrl = "https://myuniversallanguages.com:9093/api/v1";
    const items = JSON.parse(localStorage.getItem('items'));
    let headers = {
        Authorization: 'Bearer ' + token,
    }

    const handleShow = () => setShow(true);

    async function deleteMyAccount() {
        const res = await fetch(`${apiUrl}/signin/userDelete/${items._id}`, {
            headers,
            method: "DELETE"
        })
        try {
            if (res.status === 200) {
                console.log((await res.json()));
                localStorage.removeItem("items");
                localStorage.removeItem("token");
                enqueueSnackbar("Account Deleted successfully", {
                    variant: "success",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right"
                    }
                });
                setTimeout(() => {
                    navigate("/")
                    window.location.reload()
                }, 1000);
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    async function verifyPassword() {
        if (currentPassword !== "") {
            try {
                const res = await axios.patch(`${apiUrl}/signin/users/Verifypass`, {
                    oldPassword: currentPassword
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (res.status === 200) {
                    console.log(res);
                    setVerify(true);
                    enqueueSnackbar("Password verified successfully", {
                        variant: "success",
                        anchorOrigin: {
                            vertical: "top",
                            horizontal: "right"
                        }
                    });
                    updateMyPassword()
                } else {
                    // Handle cases where the status is not 200 (e.g., 400, 401, etc.)
                    setVerify(false);
                    enqueueSnackbar("Failed to verify password", {
                        variant: "error",
                        anchorOrigin: {
                            vertical: "top",
                            horizontal: "right"
                        }
                    });
                }
            } catch (error) {
                // Catch and handle any network or other unexpected errors
                setVerify(false);
                console.log(error);
                enqueueSnackbar(error?.response?.data?.message, {
                    variant: "error",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right"
                    }
                });
            }
        }
    }

    const updateMyPassword = async () => {
        if (newPassword === "" || newPassword2 === "") {
            console.log("asddas");
        }
        if (newPassword === currentPassword || newPassword2 === currentPassword) {
            enqueueSnackbar("New password should unique", {
                variant: "error",
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "right"
                }
            })
        }
        else {
            setUpdatePassword(false)
            const res = await fetch(`${apiUrl}/signin/users/Update`, {
                headers,
                method: "PATCH",
                body: JSON.stringify({
                    password: newPassword
                }),
            })
            try {
                if (res.status === 200) {
                    console.log((await res.json()));
                    enqueueSnackbar("password updated successfully", {
                        variant: "success",
                        anchorOrigin: {
                            vertical: "top",
                            horizontal: "right"
                        }
                    })
                }
            }
            catch (error) {
                console.log(error);
            }
        }
    }

    const offsetInMinutes = moment.tz(items.timezone).utcOffset();
    const offsetInHours = offsetInMinutes / 60;
    const offsetSign = offsetInHours >= 0 ? '+' : '-';
    const formattedOffset = `${offsetSign}${Math.abs(offsetInHours)}`;

    console.log(items)
    console.log(verify)

    return (
        <div>
            <SnackbarProvider />
            {show ? <Modal show={show} onHide={() => setShow(false)} animation={false} centered>
                <Modal.Body>
                    <p style={{ marginBottom: "20px", fontWeight: "600", fontSize: "20px" }}>Are you sure want to delete your account ?</p>
                    <p>All of the time tracking data and screenshots for this employee will be lost. This can not be undone.</p>
                </Modal.Body>
                <Modal.Footer>
                    <button className="teamActionButton" onClick={deleteMyAccount}>
                        DELETE
                    </button>
                    <button className="teamActionButton" onClick={() => setShow(false)}>
                        CANCEL
                    </button>
                </Modal.Footer>
            </Modal> : null}
            {updatePassword ? <Modal show={updatePassword} onHide={() => setShow(false)} animation={false} centered>
                <Modal.Body onKeyPress={(e) => {
                    if (e.key === "Enter") {
                        verifyPassword()
                    }
                }}>
                    <p style={{ marginBottom: "20px", fontWeight: "600", fontSize: "20px" }}>Change password</p>
                    <p style={{ marginBottom: "0", fontWeight: "500", fontSize: "16px" }}>Old password</p>
                    <input
                        value={currentPassword}
                        placeholder="Current password"
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        style={{
                            fontSize: "18px",
                            padding: "5px 10px",
                            margin: "10px 0 20px 0",
                            width: "100%",
                            border: "1px solid #cacaca"
                        }}
                    />
                    <p style={{ marginBottom: "0", fontWeight: "500", fontSize: "16px" }}>New password</p>
                    <input
                        value={newPassword}
                        placeholder="New password"
                        onChange={(e) => setNewPassword(e.target.value)} style={{
                            fontSize: "18px",
                            padding: "5px 10px",
                            margin: "10px 0 20px 0",
                            width: "100%",
                            border: "1px solid #cacaca"
                        }}
                    />
                    <p style={{ marginBottom: "0", fontWeight: "500", fontSize: "16px" }}>Confirm new password</p>
                    <input
                        value={newPassword2}
                        placeholder="Retype new password"
                        onChange={(e) => setNewPassword2(e.target.value)}
                        style={{
                            fontSize: "18px",
                            padding: "5px 10px",
                            margin: "10px 0",
                            width: "100%",
                            border: "1px solid #cacaca"
                        }}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <button style={{ backgroundColor: (currentPassword === "" || newPassword === "" || newPassword2 === "") && "grey", borderColor: (currentPassword === "" || newPassword === "" || newPassword2 === "") && "grey" }} className="teamActionButton" disabled={(currentPassword === "" || newPassword === "" || newPassword2 === "") ? true : false} onClick={() => {
                        if (verify === true) {
                            updateMyPassword()
                        }
                        else {
                            verifyPassword()
                        }
                    }}>
                        UPDATE
                    </button>
                    <button className="teamActionButton" onClick={() => setUpdatePassword(false)}>
                        CANCEL
                    </button>
                </Modal.Footer>
            </Modal> : null}
            <div className="container">
                <div className="userHeader">
                    <div className="headerTop">
                        <img src={user} />
                        <h5>My Account </h5>
                    </div>
                </div>
                <div className="mainwrapper">
                    <div className="accountContainer">
                        <p className="asadMehmood">{items?.name} <span>{items?.company}</span></p>
                        <p className="userEmail">
                            {items?.email}
                            <br />
                            {items?.timezone}
                            <br />
                            UTC {formattedOffset}
                        </p>
                        <div className="accountDiv">
                            <div onClick={() => navigate('/profile')} className="accountEditDiv"><div><img src={edit} /></div><p>Edit Profile</p></div>
                            <div onClick={() => setUpdatePassword(true)} className="accountEditDiv"><div><img src={passwords} /></div><p>Change Password</p></div>
                            {items?.userType === "owner" && (
                                <div onClick={handleShow} className="accountEditDiv">
                                    <div><img src={deleteIcon} alt="Delete Icon" /></div>
                                    <p>Delete my Account</p>
                                </div>
                            )}
                        </div>
                        <p className="companyPlan">Company plan</p>
                        <p className="userEmail">If you track your time for other companies - you do not need a plan and do not have to pay - your company pays for you.</p>
                    </div>
                </div>
            </div>
            <img className="accountLine" src={line} />
        </div>
    )

}

export default Account;