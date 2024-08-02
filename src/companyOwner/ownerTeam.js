import React, { useEffect, useState } from "react";
import UserHeader from "../screen/component/userHeader";
import OwnerSection from "./ownerComponent/ownerSection";
import groupCompany from "../images/Group.webp";
import search from "../images/searchIcon.webp";
import line from "../images/Line 3.webp";
import OwnerTeamComponent from "./ownerTeamComponent";
import axios from "axios";
import { enqueueSnackbar, SnackbarProvider } from 'notistack'
import Footer from "../screen/component/footer";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'
import useLoading from "../hooks/useLoading";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2/dist/sweetalert2.js'
import '../../node_modules/sweetalert2/src/sweetalert2.scss'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { AiOutlineUser, AiFillCrown, AiFillStar } from 'react-icons/ai'
import archiveIcon from "../images/archive.svg";
import inviteIcon from "../images/invitation.svg";
import { useQuery } from 'react-query';

import { useSocket } from '../io'; // Correct import

const apiUrl = "https://myuniversallanguages.com:9093/api/v1";


function OwnerTeam() {

    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);
    const [show3, setShow3] = useState(false);
    const [email, setEmail] = useState("")
    const [deleteType, setDeleteType] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const navigate = useNavigate()
    const { loading, setLoading, loading2, setLoading2 } = useLoading()
    const [payrate, setPayrate] = useState(null)
    const [inviteStatus, setInviteStatus] = useState("")
    const [isUserArchive, setIsUserArchive] = useState(false)
    const [isArchived, setIsArchived] = useState(true)
    const [activeId, setActiveId] = useState(null)
    const socket = useSocket()
    const [mainId, setMainId] = useState(null)
    const [users, setUsers] = useState(null);
    const apiUrl = "https://myuniversallanguages.com:9093/api/v1";
    const token = localStorage.getItem('token');
    const headers = {
        Authorization: "Bearer " + token,
    };
    const user = JSON.parse(localStorage.getItem("items"))

    const fetchOwnerCompanies = async () => {
        const response = await axios.get(`${apiUrl}/owner/companies`, { headers });
        return response.data;  // React Query will handle the response status internally
    }



    // const getData = async () => {
    //     setLoading(true)
    //     try {
    //         setLoading2(true)
    //         const response = await axios.get(`${apiUrl}/owner/companies`, { headers })
    //         if (response.status) {
    //             setLoading(false)
    //             setLoading2(false)
    //             setUsers(() => {
    //                 return response?.data?.employees?.sort((a, b) => {
    //                     if (a.inviteStatus !== b.inviteStatus) {
    //                         return a.inviteStatus ? 1 : -1;
    //                     }
    //                     if (a.isArchived !== b.isArchived) {
    //                         return a.isArchive ? 1 : -1;
    //                     }
    //                     return 0;
    //                 });
    //             })
    //             console.log(response);
    //         }
    //     }
    //     catch (err) {
    //         console.log(err);
    //         setLoading(false)
    //         setLoading2(false)
    //     }
    // }

    // useEffect(() => {
    //     const handleUserArchive = (data) => {
    //       console.log('User archived event received:', data);
    //       setUsers((prevUsers) =>
    //         prevUsers.map((user) =>
    //           user._id === data.userId ? { ...user, isArchived: data.active } : user
    //         )
    //       );
    //       if (data.userId === mainId) {
    //         setIsUserArchived(data.isArchived);
    //       }
    //     };

    //     const handleUserUnarchive = (data) => {
    //       console.log('User unarchived event received:', data);
    //       setUsers((prevUsers) =>
    //         prevUsers.map((user) =>
    //           user._id === data.userId ? { ...user, isArchived: data.archive } : user
    //         )
    //       );
    //       if (data.userId === mainId) {
    //         setIsUserArchived(false);
    //       }
    //     };

    //     // const handleRoleUpdate = (data) => {
    //     //   console.log('Role updated event received:', data);
    //     //   setRole(data.role);
    //     // };

    //     if (socket) {
    //       console.log('Socket connection established:', socket.connected);

    //       socket.on('user_archive', handleUserArchive);
    //       socket.on('user_unarchive', handleUserUnarchive);
    //     //   socket.on('role_update', handleRoleUpdate);

    //       // Emit user_archive event to socket when user is archived
    //       const archiveUser = (userId) => {
    //         socket.emit('user_archive', userId);
    //         handleUserArchive({ userId });
    //       };

    //       // Emit user_unarchive event to socket when user is unarchived
    //       const unarchiveUser = (userId) => {
    //         socket.emit('user_unarchive', userId);
    //         handleUserUnarchive({ userId });
    //       };

    //       return () => {
    //         console.log('Socket connection closed:', socket.connected);
    //         socket.off('user_archive', handleUserArchive);
    //         socket.off('user_unarchive', handleUserUnarchive);
    //         // socket.off('role_update', handleRoleUpdate);
    //       };
    //     }
    //   }, [socket, mainId, setUsers]);
    useEffect(() => {
        if (socket) {
            console.log('Socket connection established:', socket.connected);
            socket.on('user_archive', (userId) => {
                console.log(`Received user archived update event: ${userId}`);
                // Update the archive icon in real-time
                const user = users.find((user) => user._id === userId);
                if (user) {
                    user.isArchived = true;
                    setUsers([...users]);
                }
            });

            socket.on('user_unarchive', (userId) => {
                console.log(`Received user unarchived update event: ${userId}`);
                // Update the archive icon in real-time
                const user = users.find((user) => user._id === userId);
                if (user) {
                    user.isArchived = false;
                    setUsers([...users]);
                }
            });
        }
    }, [socket, users, setUsers]);

    // When you archive a user on this device
    const archiveUser = (userId) => {
        socket.emit('user_archive', userId);
        // Update the local state
        const user = users.find((user) => user._id === userId);
        if (user) {
            user.isArchived = true;
            setUsers([...users]);
        }
    };

    // When you unarchive a user on this device
    const unarchiveUser = (userId) => {
        socket.emit('user_unarchive', userId);
        // Update the local state
        const user = users.find((user) => user._id === userId);
        if (user) {
            user.isArchived = false;
            setUsers([...users]);
        }
    };

    const { data: users1, isLoading, isError, refetch } = useQuery({
        queryKey: ['ownerCompanies'],
        queryFn: fetchOwnerCompanies,
        select: (data) => {
            return data?.employees?.sort((a, b) => {
                if (a.inviteStatus !== b.inviteStatus) {
                    return a.inviteStatus ? 1 : -1;
                }
                if (a.isArchived !== b.isArchived) {
                    return a.isArchived ? 1 : -1;
                }
                return 0;
            });
        },
        onError: (error) => {
            console.error("Error fetching data:", error);
            enqueueSnackbar("Error fetching data", {
                variant: "error",
                anchorOrigin: { vertical: "top", horizontal: "right" }
            });
        }
    });

    // Update users state whenever users1 changes
    useEffect(() => {
        if (users1) {
            setUsers(users1);
        }
    }, [users1]);


    // useEffect(() => {
    //     const handleUserArchive = (data) => {
    //         console.log('User archived event received:', data);

    //         // Update users state
    //         setUsers((prevUsers) =>
    //             prevUsers.map((user) =>
    //                 user._id === data.userId ? { ...user, isArchived: data.isArchived } : user
    //             )
    //         );

    //         // Update local state for current user
    //         if (data.userId === fixId) {
    //             setIsUserArchived(data.isArchived);
    //         }
    //     };

    //     if (socket) {
    //         socket.on('user_archive', handleUserArchive);

    //         return () => {
    //             socket.off('user_archive', handleUserArchive);
    //         };
    //     }
    // }, [socket, fixId, setUsers]);


    // const getManagerTeam = async () => {
    //     setLoading(true)
    //     try {
    //         setLoading2(true)
    //         const response = await axios.get(`${apiUrl}/manager/employees`, { headers })
    //         if (response.status) {
    //             setLoading(false)
    //             setLoading2(false)
    //             setUsers(() => {
    //                 const filterCompanies = response?.data?.convertedEmployees?.sort((a, b) => {
    //                     if (a.inviteStatus !== b.inviteStatus) {
    //                         return a.inviteStatus ? 1 : -1;
    //                     }
    //                     if (a.isArchived !== b.isArchived) {
    //                         return a.isArchive ? 1 : -1;
    //                     }
    //                     return 0;
    //                 });
    // return filterCompanies
    //             })
    //             console.log(response);
    //         }
    //     }
    //     catch (err) {
    //         console.log(err);
    //         setLoading(false)
    //         setLoading2(false)
    //     }
    // }

    const fetchManagerTeam = async () => {
        const response = await axios.get(`${apiUrl}/manager/employees`, { headers });
        return response.data;  // React Query will handle the response status internally
    };

    // Integrate React Query for fetching manager team
    const { data: managerTeam, isLoading: isManagerLoading, isError: isManagerError, refetch: refetchManager } = useQuery({
        queryKey: ['managerTeam'],  // Query key
        queryFn: fetchManagerTeam,  // Fetching function
        select: (data) => {
            return data?.convertedEmployees?.sort((a, b) => {
                if (a.inviteStatus !== b.inviteStatus) {
                    return a.inviteStatus ? 1 : -1;
                }
                if (a.isArchived !== b.isArchived) {
                    return a.isArchived ? 1 : -1;
                }
                return 0;
            });

        },
        // onError: (error) => {
        //     console.error("Error fetching manager team:", error);
        //     enqueueSnackbar("Error fetching manager team", {
        //         variant: "error",
        //         anchorOrigin: { vertical: "top", horizontal: "right" }
        //     });
        // }
    });
    // Update users state whenever users1 changes
    useEffect(() => {
        if (managerTeam) {
            setUsers(managerTeam);
        }
    }, [managerTeam]);

    useEffect(() => {
        if (user?.userType === "manager") {
            fetchManagerTeam();
        }
        else {
            fetchOwnerCompanies();
        }
    }, [])



    async function archived_unarchived_users() {
        setShow2(false);
        setLoading(true);

        try {
            const res = await axios.patch(`${apiUrl}/superAdmin/archived/${mainId}`, {
                isArchived: isUserArchive // Toggle the current archive status
            }, {
                headers: headers
            });

            if (res.status) {
                // Update the local state to reflect the new archive status
                setUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user._id === mainId ? { ...user, isArchived: !user.isArchived } : user
                    )
                );

                // Update the selected user state
                setSelectedUser((prevUser) => ({
                    ...prevUser,
                    isArchived: !prevUser.isArchived
                }));

                // Update the archive state
                setIsUserArchive(!isUserArchive);

                enqueueSnackbar(res.data.message, {
                    variant: "success",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right"
                    }
                });
            }
        } catch (error) {
            enqueueSnackbar(error?.response?.data?.message ? error?.response?.data?.message : "Network error", {
                variant: "error",
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "right"
                }
            });
        } finally {
            setLoading(false);
        }
    }


    async function deleteUser() {
        setShow(false)
        try {
            const res = await axios.delete(`${apiUrl}/superAdmin/deleteEmp/${mainId}`)
            if (res.status === 200) {
                fetchOwnerCompanies()
                enqueueSnackbar(res.data.Message, {
                    variant: "success",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right"
                    }
                })
                setTimeout(() => {
                    setMainId(null)
                }, 1000);
                console.log("deleteUser RESPONSE =====>", res);
            }
        } catch (error) {
            enqueueSnackbar(error?.response?.data?.message ? error?.response?.data?.message : "Network error", {
                variant: "error",
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "right"
                }
            })
        }
    }

    const handleSendInvitation = async () => {
        if (email !== "") {
            setShow3(false)
            try {
                const res = await axios.post(`${apiUrl}/superAdmin/email`, {
                    toEmail: email,
                    company: user.company,
                }, {
                    headers: headers,
                })
                if (res.status) {
                    enqueueSnackbar(res.data.message, {
                        variant: "success",
                        anchorOrigin: {
                            vertical: "top",
                            horizontal: "right"
                        }
                    })
                    fetchOwnerCompanies()
                }
                console.log("invitationEmail RESPONSE =====>", res);
            } catch (error) {
                enqueueSnackbar(error?.response?.data?.message ? error?.response?.data?.message : "Network error", {
                    variant: "error",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right"
                    }
                })
                console.log("catch error =====>", error);
            }
        }
        else {
            enqueueSnackbar("Email address is required", {
                variant: "error",
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "right"
                }
            })
        }
    }

    const isAdmin = user?.userType === "admin";
    const isOwner = user?.userType === "owner";

    const combinedData = users1?.length ? users1 : managerTeam;


    return (
        <div>
            {show ? <Modal show={show} onHide={() => setShow(false)} animation={false} centered>
                <Modal.Body>
                    <p style={{ marginBottom: "20px", fontWeight: "600", fontSize: "20px" }}>Are you sure want to delete {selectedUser?.name} ?</p>
                    <p>All of the time tracking data and screenshots for this employee will be lost. This can not be undone. Please type <b>DELETE</b> in the box below to acknowledge that employee will be deleted.</p>
                    <input value={deleteType} onChange={(e) => setDeleteType(e.target.value.trim())} type="text" placeholder="DELETE" style={{
                        fontSize: "18px",
                        padding: "5px 10px",
                        width: "100%",
                        border: "1px solid #cacaca"
                    }} />
                </Modal.Body>
                <Modal.Footer>
                    <button disabled={deleteType !== "DELETE" ? true : false} className={`${deleteType !== "DELETE" ? "teamActionButtonDisabled" : "teamActionButton"}`} onClick={deleteUser}>
                        DELETE
                    </button>
                    <button className="teamActionButton" onClick={() => setShow(false)}>
                        CANCEL
                    </button>
                </Modal.Footer>
            </Modal> : null}
            {show2 ? <Modal show={show2} onHide={() => setShow2(false)} animation={false} centered>
                <Modal.Body>
                    <p style={{ marginBottom: "20px", fontWeight: "600", fontSize: "20px" }}>{!isUserArchive ? "Unarchive" : "Archive"} {selectedUser?.name} ?</p>
                    <p>The user:</p>
                    {!isUserArchive ? (
                        <ul>
                            <li>Will be able to track time for your company</li>
                            <li>Will appear in the list of users on your home or timeline</li>
                            <li>Their data will not be retained and accessible in reports</li>
                            <li>You will be charged for this user</li>
                        </ul>
                    ) : (
                        <ul>
                            <li>Will not be able to track time for your company</li>
                            <li>Will not appear in the list of users on your home or timeline</li>
                            <li>Their data will be retained and accessible in reports</li>
                            <li>You will not be charged for this user</li>
                        </ul>
                    )}
                    {!isUserArchive && <p>You can restore this user any time</p>}
                </Modal.Body>
                <Modal.Footer>
                    <button className="teamActionButton" onClick={archived_unarchived_users}>
                        {!isUserArchive ? "UN-ARCHIVE" : "ARCHIVE"}
                    </button>
                    <button className="teamActionButton" onClick={() => setShow2(false)}>
                        CANCEL
                    </button>
                </Modal.Footer>
            </Modal> : null}
            {show3 ? <Modal show={show3} onHide={() => setShow3(false)} animation={false} centered>
                <Modal.Body>
                    <p style={{ marginBottom: "20px", fontWeight: "600", fontSize: "20px" }}>Invite user via email address</p>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} type="text" placeholder="Enter user email" style={{
                        fontSize: "18px",
                        padding: "5px 10px",
                        width: "100%",
                        border: "1px solid #cacaca"
                    }} />
                </Modal.Body>
                <Modal.Footer>
                    <button className="teamActionButton" onClick={handleSendInvitation}>
                        SEND
                    </button>
                    <button className="teamActionButton" onClick={() => setShow3(false)}>
                        CANCEL
                    </button>
                </Modal.Footer>
            </Modal> : null}
            <SnackbarProvider />
            <div className="container">
                <div className="userHeader">
                    <div className="d-flex align-items-center gap-3">
                        <div><img src={groupCompany} /></div>
                        <h5>Team</h5>
                    </div>
                </div>
                <div className="mainwrapper">
                    <div className="ownerTeamContainer">
                        <div className="d-flex gap-3">
                            <div style={{ width: "350px" }}>
                                {user?.userType !== "manager" && (
                                    <>
                                        <p className="addUserButton" onClick={() => navigate('/company-owner-user')}>+ Create user</p>
                                        <div style={{
                                            marginTop: "20px",
                                            display: "flex",
                                            width: '350px',
                                            justifyContent: "space-between"
                                        }}>
                                            <input value={email} onChange={(e) => setEmail(e.target.value)} type="text" placeholder="Add user by email" style={{
                                                fontSize: "18px",
                                                padding: "6px 10px",
                                                width: "100%",
                                                border: "1px solid #cacaca",
                                                outline: "none",
                                                borderTopLeftRadius: '5px',
                                                borderBottomLeftRadius: '5px',
                                            }} />
                                            <button style={{
                                                backgroundColor: "#7acb59",
                                                borderTopRightRadius: "4px",
                                                borderBottomRightRadius: "4px",
                                                padding: "10px 25px",
                                                color: "white",
                                                border: "none",
                                            }} onClick={handleSendInvitation}>
                                                INVITE
                                            </button>
                                        </div>
                                    </>
                                )}

                                <div className="companyFont">
                                    <p style={{
                                        margin: 0,
                                        padding: 0,
                                        fontSize: "20px",
                                        color: "#0E4772",
                                        fontWeight: "600",
                                    }}>Total</p>
                                    <div style={{
                                        backgroundColor: "#28659C",
                                        color: "white",
                                        fontSize: "600",
                                        width: "30px",
                                        height: "30px",
                                        borderRadius: "100%",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}>
                                        {users?.length}
                                    </div>
                                </div>
                                <div>
                                    {users?.map((e, i) => {
                                        return (
                                            <div className={`adminTeamEmployess ${activeId === e._id ? "activeEmploy" : ""} align-items-center`} onClick={() => {
                                                setMainId(e._id)
                                                setActiveId(e._id)
                                                setIsUserArchive(e?.isArchived ? false : true)
                                                setInviteStatus(false)
                                                setPayrate(e)
                                                setSelectedUser(e)
                                            }}>
                                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: '100%' }}>
                                                    <div style={{ display: "flex", alignItems: "center" }}>
                                                        <div className="groupContentMainImg">
                                                            <p>{i + 1}</p>
                                                        </div>
                                                        <p className="groupContent">{e?.inviteStatus === true ? e?.email : e?.name}</p>
                                                    </div>
                                                    {e?.inviteStatus === true ? (
                                                        <div style={{
                                                            marginRight: "3px",
                                                            padding: "3px 10px",

                                                            borderRadius: "3px",
                                                            color: "#fff",
                                                            fontSize: "12px",
                                                            lineHeight: 1.4,
                                                        }}>
                                                            <img width={30} src={inviteIcon} />
                                                        </div>
                                                    ) : e?.isArchived === true ? (
                                                        <div style={{
                                                            marginRight: "3px",
                                                            padding: "3px 10px",

                                                            borderRadius: "3px",
                                                            color: "#fff",
                                                            fontSize: "12px",
                                                            lineHeight: 1.4,
                                                        }}>
                                                            <img width={30} src={archiveIcon} />
                                                        </div>
                                                    ) : null}
                                                </div>
                                                {
                                                    e?.userType === "owner" ? <div>
                                                        <AiFillStar color="#e7c741" size={20} />
                                                    </div> :
                                                        e?.userType === "admin" ? <div>
                                                            <AiFillStar color="#28659C" size={20} />
                                                        </div>
                                                            :
                                                            e?.userType === "manager" && (
                                                                <div style={{ backgroundColor: "#5CB85C", width: 80, padding: "5px 10px", borderRadius: "3px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                                                    <AiOutlineUser color="white" size={20} />
                                                                    <p style={{ margin: 0, fontWeight: "600", color: "white" }}>{e?.assignedUsers?.filter(f => f !== user._id)?.length}</p>
                                                                </div>
                                                            )}
                                            </div>
                                        )
                                    })}

                                </div>
                            </div>
                            <div>
                                <img src={line} style={{ height: '100%' }} />
                            </div>
                            <div style={{ width: "100%", display: mainId === null ? "flex" : "", justifyContent: mainId === null ? "center" : "", alignItems: mainId === null ? "center" : "" }}>
                                <OwnerTeamComponent
                                    fixId={mainId}
                                    archived_unarchived_users={() => setShow2(true)}
                                    deleteUser={() => setShow(true)}
                                    isArchived={isArchived}
                                    setIsUserArchive={setIsUserArchive}
                                    isUserArchive={isUserArchive}
                                    inviteStatus={inviteStatus}
                                    handleSendInvitation={handleSendInvitation}
                                    payrate={payrate}
                                    users={users}
                                    setUsers={setUsers}
                                    selectedUser={selectedUser}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OwnerTeam;