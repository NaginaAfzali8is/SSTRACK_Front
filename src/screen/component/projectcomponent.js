import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import useLoading from '../../hooks/useLoading';

const Projectcomponent = (props) => {
    // style
    const buttonStyle = {
        padding: '5px 10px',
        border: 'none',
        cursor: 'pointer',
        flex: '1 1 auto',
        borderRadius: '5px'
    };

    const archiveButtonStyle = {
        ...buttonStyle,
        backgroundColor: '#007bff',
        color: 'white'
    };

    const deleteButtonStyle = {
        ...buttonStyle,
        backgroundColor: '#dc3545',
        color: 'white'
    };
    //style
    const { loading, setLoading } = useLoading()
    const [viewTimeline, setViewTimeline] = useState(false)
    const [role, setRole] = useState("")
    const [data, setData] = useState({});
    const [users, setUsers] = useState(null);

    const { fixId, archived_unarchived_users, isUserArchive, inviteStatus, handleSendInvitation, payrate, reSendInvitation, allowEmp, setAllowemp } = props
    const apiUrl = "https://myuniversallanguages.com:9093/api/v1";
    const token = localStorage.getItem('token');
    const headers = {
        Authorization: "Bearer " + token,
    };


    const getData = async (fixId) => {
        setLoading(true);
        try {
            const response = await axios.get(`${apiUrl}/owner/companies`, { headers })

            // console.log("API Response:", response); // Log the entire response for debugging

            if (response.status === 200) {
                setLoading(false);
                if (response.data) {
                    const responseData = response.data; // Assuming data is directly under 'data'
                    setData(responseData); // Set data from API response
                    // console.log("Data in component:", responseData); 
                    // const userIds = response.employees.map(employee => employee._id);
                    setUsers(() => {
                        return response?.data?.employees?.sort((a, b) => {
                            if (a.inviteStatus !== b.inviteStatus) {
                                return a.inviteStatus ? 1 : -1;
                            }
                            if (a.isArchived !== b.isArchived) {
                                return a.isArchive ? 1 : -1;
                            }
                            return 0;
                        });
                    })

                } else {
                    console.error("API Error:", response.data.message);
                }
            } else {
                console.error("Failed to fetch data:", response.statusText);
            }
        }
        catch (error) {
            setLoading(false);
            console.error("Error fetching data:", error);
        }
    };



    // const handleToggleUser = async (userID) => {
    //     try {
    //         const isAssign = !allowEmp.includes(userID);
    //         console.log("isAssign:", isAssign, "userID:", userID, "projectID:", fixId);
    //         const response = await axios.post(`${apiUrl}/superAdmin/assignProject`, {
    //             userIds: [userID],
    //             isAssign: isAssign,
    //             projectId: [fixId]
    //         }, { headers });
    //         if (response.status === 200) {


    //             // Update allowEmp state
    //             setAllowemp((prevAllowEmp) => {
    //                 if (isAssign) {
    //                     return [...prevAllowEmp, userID];
    //                 } else {
    //                     return prevAllowEmp.filter(id => id !== userID);
    //                 }
    //             });

    //             // Update users state to reflect the new isAssign status
    //             setUsers((prevUsers) => {
    //                 return prevUsers.map((user) => {
    //                     if (user._id === userID) {
    //                         return {
    //                             ...user,
    //                             isAssign: isAssign
    //                         };
    //                     }
    //                     return user;
    //                 });
    //             });
    //         }
    //     } catch (err) {
    //         console.error("Error toggling user:", err);
    //     }
    // };

    const handleToggleUser = async (userID) => {
        const isAssign = !allowEmp.includes(userID);

        // Optimistically update the state
        setAllowemp((prevAllowEmp) => {
            if (isAssign) {
                return [...prevAllowEmp, userID];
            } else {
                return prevAllowEmp.filter(id => id !== userID);
            }
        });

        setUsers((prevUsers) => {
            return prevUsers.map((user) => {
                if (user._id === userID) {
                    return {
                        ...user,
                        isAssign: isAssign
                    };
                }
                return user;
            });
        });

        try {
            console.log("isAssign:", isAssign, "userID:", userID, "projectID:", fixId);
            const response = await axios.post(`${apiUrl}/superAdmin/assignProject`, {
                userIds: [userID],
                isAssign: isAssign,
                projectId: [fixId]
            }, { headers });
            if (response.status === 200) {
                // enqueueSnackbar("Settings saved", {
                //     variant: "success",
                //     anchorOrigin: {
                //         vertical: "top",
                //         horizontal: "right"
                //     }
                // });
            }
        } catch (err) {
            console.error("Error toggling user:", err);

            // Revert the state if the API call fails
            setAllowemp((prevAllowEmp) => {
                if (isAssign) {
                    return prevAllowEmp.filter(id => id !== userID);
                } else {
                    return [...prevAllowEmp, userID];
                }
            });

            setUsers((prevUsers) => {
                return prevUsers.map((user) => {
                    if (user._id === userID) {
                        return {
                            ...user,
                            isAssign: !isAssign
                        };
                    }
                    return user;
                });
            });

            enqueueSnackbar("Failed to save settings", {
                variant: "error",
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "right"
                }
            });
        }
    };

    useEffect(() => {
        getData(fixId);
    }, [fixId])

    const user = JSON.parse(localStorage.getItem("items"))
    const navigate = useNavigate()

    useEffect(() => {
        setRole(data.userType)
    }, [data])

    // console.log('users',)
    // console.log('ID', fixId)
    // console.log(user)
    // console.log(data)
    const userType = 'owner'; // This should come from your authentication logic
    const deleteUser = () => console.log('Delete user function called'); // Replace with your actual delete logic


    const addAll = async () => {
        console.log("Add All clicked", users.map(employee => employee._id));
        let u_ID = users.map(employee => employee._id);
        let isAssign = true;
        try {

            console.log("projectID:", fixId);
            const response = await axios.post(`${apiUrl}/superAdmin/assignProject`, {
                userIds: u_ID,
                isAssign: isAssign,
                projectId: [fixId]
            }, { headers });
            if (response.status === 200) {


                // Update allowEmp state
                setAllowemp((prevAllowEmp) => {
                    if (isAssign) {
                        return [...prevAllowEmp, u_ID];
                    } else {
                        return prevAllowEmp.filter(id => id !== u_ID);
                    }
                });

                // Update users state to reflect the new isAssign status
                setUsers((prevUsers) => {
                    return prevUsers.map((user) => {
                        if (user._id === u_ID) {
                            return {
                                ...user,
                                isAssign: isAssign
                            };
                        }
                        return user;
                    });
                });
            }
        } catch (err) {
            console.error("Error toggling user:", err);
        }
        // Add your logic here for adding all items
    }

    const removeAll = async () => {
        console.log("Remove All clicked", allowEmp);
        let isAssign = false;
        try {

            console.log("projectID:", fixId);
            const response = await axios.post(`${apiUrl}/superAdmin/assignProject`, {
                userIds: [allowEmp],
                isAssign: isAssign,
                projectId: [fixId]
            }, { headers });
            if (response.status === 200) {


                // Update allowEmp state
                setAllowemp((prevAllowEmp) => {
                    if (isAssign) {
                        return [...prevAllowEmp, allowEmp];
                    } else {
                        return prevAllowEmp.filter(id => id !== allowEmp);
                    }
                });

                // Update users state to reflect the new isAssign status
                setUsers((prevUsers) => {
                    return prevUsers.map((user) => {
                        if (user._id === allowEmp) {
                            return {
                                ...user,
                                isAssign: isAssign
                            };
                        }
                        return user;
                    });
                });
            }
        } catch (err) {
            console.error("Error toggling user:", err);
        }
        // Add your logic here for removing all items
    }





    return (
        <div className="container p-3">
            {/* Header Right Side */}
            <div className="d-flex justify-content-between align-items-center flex-wrap w-100 mb-2">
                <div className="font-weight-bold" style={{ fontSize: '16px' }}>Project Name</div>
                <div className="d-flex gap-2">
                    <button style={archiveButtonStyle}>Archive</button>
                    <button style={deleteButtonStyle}>Delete</button>
                </div>
            </div>
            {/* Assign Project to Client */}
            <div className="text-primary" style={{ cursor: 'pointer', fontSize: '12px', }}>Assign Project to Client</div>
            {/* Project Member */}
            <div className="mt-3">Project Member</div>
            <div className="d-flex gap-2">
                <div className="text-primary" style={{ fontSize: '12px', cursor: 'pointer' }} onClick={addAll}>Add All</div>
                <div className="text-primary" style={{ fontSize: '12px', cursor: 'pointer' }} onClick={removeAll}>Remove All</div>
            </div>
            {/* toogle buttons */}
            {/* <div style={{ marginTop: 10 }}>
                {users?.filter(f => f?.isArchived === false).map((f) => (
                    <div key={f._id} style={{ display: "flex", marginBottom: 10 }}>
                        <input
                            onChange={() => {
                                setUsers((prevUsers) => {
                                    return prevUsers.map((user) => {
                                        if (user._id === f._id) {
                                            const newIsAssign = !user.isAssign;
                                            if (newIsAssign) {
                                                handleAssignUser([...user.managerId, f._id]); // Pass the updated userIds array
                                            } else {
                                                handleRemoveAssignUser(user._id); // Pass user ID to removal function
                                            }
                                            return {
                                                ...user,
                                                isAssign: newIsAssign,
                                                managerId: newIsAssign ? [...user.managerId, fixId] : user.managerId.filter(id => id !== fixId)
                                            };
                                        }
                                        return user;
                                    });
                                });
                            }}
                            className="react-switch-checkbox"
                            id={`react-switch-${f._id}`}
                            type="checkbox"
                            checked={allowEmp.includes(f._id)} // Check if f._id is in allowEmp array
                        />
                        {user?.userType !== "manager" && (
                            <label
                                style={{
                                    background: allowEmp.includes(f._id) ? "#5CB85C" : "grey" // Set background based on allowEmp array
                                }}
                                className="react-switch-label"
                                htmlFor={`react-switch-${f._id}`}
                            >
                                <span className={`react-switch-button`} />
                            </label>
                        )}
                        <p style={{ margin: "0 0 0 10px", color: "#aaa", fontWeight: "500" }}>{f.name}</p>
                    </div>
                ))}
            </div> */}
            <div style={{ marginTop: 10 }}>
                {users?.filter(f => !f.isArchived).map((f) => (
                    <div key={f._id} style={{ display: "flex", marginBottom: 10 }}>
                        <input
                            onChange={() => handleToggleUser(f._id)}
                            className="react-switch-checkbox"
                            id={`react-switch-${f._id}`}
                            type="checkbox"
                            checked={allowEmp.includes(f._id)}
                        />
                        {user?.userType !== "manager" && (
                            <label
                                style={{
                                    background: allowEmp.includes(f._id) ? "#5CB85C" : "grey"
                                }}
                                className="react-switch-label"
                                htmlFor={`react-switch-${f._id}`}
                            >
                                <span className={`react-switch-button`} />
                            </label>
                        )}
                        <p style={{ margin: "0 0 0 10px", color: "#aaa", fontWeight: "500" }}>{f.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Projectcomponent;
