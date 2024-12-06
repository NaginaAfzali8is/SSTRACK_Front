// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const MyLeavesApplication = () => {
//     const [leaveCounts, setLeaveCounts] = useState({}); // For storing remaining leaves
//     const [leaveRequests, setLeaveRequests] = useState([]); // For storing leave details
//     const [loading, setLoading] = useState(true);

//     // Retrieve current user details from localStorage
//     const currentUser = JSON.parse(localStorage.getItem("items"));
//     const userId = currentUser?.id || ""; // Logged-in user's ID
//     const userType = currentUser?.role || ""; // Assuming `role` contains the userType

//     const apiUrl = "https://ss-track-xi.vercel.app/api/v1";
//     const token = localStorage.getItem("token");
//     const headers = {
//         Authorization: `Bearer ${token}`,
//     };

//     const fetchUserLeaves = async () => {
//         try {
//             const response = await axios.get(`${apiUrl}/superAdmin/getAllUserLeaves`, {
//                 headers,
//             });

//             const usersData = response.data?.data || [];

//                 const userData = usersData.find((user) => user.userId?._id === userId);
//                 if (userData) {
//                     const { sickLeaves, casualLeaves, annualLeaves, leaveHistory } = userData;
//                     setLeaveCounts({
//                         annualLeaves: annualLeaves || 0,
//                         sickLeaves: sickLeaves || 0,
//                         casualLeaves: casualLeaves || 0,
//                     });
//                     setLeaveRequests(leaveHistory || []);
//                 } else {
//                     setLeaveRequests([]);
//                     setLeaveCounts({});
//                 }

//         } catch (error) {
//             console.error("Error fetching user leaves:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchUserLeaves();
//     }, []);

//     return (
//         <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
//             <h1 style={{ color: "#0E4772", marginBottom: "20px" }}>My Leaves Application</h1>
//             <div
//                 style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     alignItems: "center",
//                     marginBottom: "20px",
//                     padding: "10px 20px",
//                     backgroundColor: "#f5f5f5",
//                     borderRadius: "8px",
//                 }}
//             >
//                 <p style={{ margin: 0 }}>
//                     <b>Remaining Leaves:</b> Annual Leaves: {leaveCounts.annualLeaves || 0}, Sick Leaves:{" "}
//                     {leaveCounts.sickLeaves || 0}, Casual Leaves: {leaveCounts.casualLeaves || 0}
//                 </p>
//                 <button
//                     style={{
//                         padding: "10px 20px",
//                         backgroundColor: "#7FC45B",
//                         color: "#fff",
//                         border: "none",
//                         borderRadius: "5px",
//                         cursor: "pointer",
//                         fontWeight: "600",
//                     }}
//                 >
//                     Apply For Leave
//                 </button>
//             </div>
//             {loading ? (
//                 <p>Loading...</p>
//             ) : leaveRequests.length > 0 ? (
//                 <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
//                     {leaveRequests.map((leave, index) => (
//                         <div
//                             key={index}
//                             style={{
//                                 padding: "20px",
//                                 backgroundColor: "#fff",
//                                 border: "1px solid #ddd",
//                                 borderRadius: "8px",
//                                 boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
//                                 display: "flex",
//                                 justifyContent: "space-between",
//                                 alignItems: "center",
//                             }}
//                         >
//                             <div>
//                                 <h3 style={{ color: "#0E4772", margin: 0 }}>
//                                     {leave.leaveType || "Leave Type"}
//                                 </h3>
//                                 <p style={{ margin: "5px 0", color: "#777" }}>
//                                     The concise explanation for leave......
//                                 </p>
//                                 <p style={{ margin: "5px 0", color: "#555" }}>
//                                     <b>Start Date:</b>{" "}
//                                     {new Date(leave.startDate).toLocaleDateString()} &nbsp; | &nbsp;
//                                     <b>End Date:</b> {new Date(leave.endDate).toLocaleDateString()}{" "}
//                                     &nbsp; | &nbsp;
//                                     <b>Approved Date:</b> {leave.approvedAt || "-"}
//                                 </p>
//                             </div>
//                             <div style={{ textAlign: "center" }}>
//                                 <button
//                                     style={{
//                                         padding: "10px 20px",
//                                         backgroundColor: "#7FC45B",
//                                         color: "#fff",
//                                         border: "none",
//                                         borderRadius: "5px",
//                                         cursor: "pointer",
//                                         fontWeight: "600",
//                                     }}
//                                 >
//                                     View
//                                 </button>
//                                 <p
//                                     style={{
//                                         marginTop: "10px",
//                                         fontWeight: "600",
//                                         color:
//                                             leave.status === "APPROVED"
//                                                 ? "green"
//                                                 : leave.status === "PENDING"
//                                                 ? "orange"
//                                                 : "red",
//                                     }}
//                                 >
//                                     {leave.status}
//                                 </p>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             ) : (
//                 <p>No leave requests submitted yet.</p>
//             )}
//         </div>
//     );
// };

// export default MyLeavesApplication;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const MyLeavesApplication = () => {
    // State for leave counts and requests
    const [leaveCounts, setLeaveCounts] = useState({
        annualLeaves: 0,
        sickLeaves: 0,
        casualLeaves: 0,
    });
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const apiUrl = "https://ss-track-xi.vercel.app/api/v1/superAdmin/getAllUserLeaves";
    const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
    const headers = {
        Authorization: `Bearer ${token}`,
    };

    // Fetch leave data from API
    const fetchLeaveData = async () => {
        try {
            const response = await axios.get(apiUrl, { headers });
            const usersData = response.data?.data || [];

            // Assuming the API returns data for multiple users, filter for the current user
            const currentUser = JSON.parse(localStorage.getItem("items")); // Current user data from localStorage
            const userId = currentUser?.id || currentUser?._id;

            // Find the current user's leave data
            const userData = usersData.find((user) => user.userId?._id === userId);

            if (userData) {
                const { sickLeaves, casualLeaves, annualLeaves, leaveHistory } = userData;

                // Set leave counts and requests
                setLeaveCounts({
                    annualLeaves: annualLeaves || 0,
                    sickLeaves: sickLeaves || 0,
                    casualLeaves: casualLeaves || 0,
                });
                setLeaveRequests(leaveHistory || []);
            } else {
                console.warn("No data found for the current user.");
            }
        } catch (error) {
            console.error("Error fetching leave data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaveData();
    }, []);

    return (
        <>
            <div className="container">
                <div
                    className="userHeader"
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: "#28659C",
                        padding: "16px 20px",
                        color: "white",
                        borderRadius: "5px 5px 0 0",
                    }}
                >
                    <h5 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>
                        Employee Leave Management
                    </h5>
                </div>

                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div className="mainwrapper ownerTeamContainer">
                        <div className="d-flex" style={{ gap: "40px", justifyContent: "space-between" }}>
                            <h3 style={{ textAlign: "left", color: "#0E4772" }}>My Leave Application</h3>
                            <p style={{ margin: 0, gap: "10px", padding: "15px", border: "1px solid #000" }}>
                                <b>Remaining Leaves:</b> Annual Leaves: {leaveCounts.annualLeaves}, Sick Leaves:{" "}
                                {leaveCounts.sickLeaves}, Casual Leaves: {leaveCounts.casualLeaves}
                            </p>
                            <Link to="/applyForLeave">
                                <button
                                    style={{
                                        padding: "10px 20px",
                                        backgroundColor: "#7FC45B",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "5px",
                                        cursor: "pointer",
                                        fontWeight: "600",
                                    }}
                                >
                                    Apply For Leave
                                </button>
                            </Link>
                        </div>

                        {leaveRequests.length > 0 ? (
                            leaveRequests.map((leave, index) => (
                                <div
                                    key={index}
                                    style={{
                                        padding: "20px",
                                        backgroundColor: "#fff",
                                        border: "1px solid #ddd",
                                        borderRadius: "8px",
                                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        marginTop: "10px",
                                    }}
                                >
                                    <div>
                                        <h3 style={{ color: "#0E4772", margin: 0 }}>{leave.leaveType}</h3>
                                        <p style={{ margin: "5px 0", color: "#777", fontWeight: "bold" }}>
                                            The concise explanation for leave......
                                        </p>
                                        <p style={{ margin: "5px 0", color: "#555" }}>
                                            <b>Start Date:</b>{" "}
                                            {new Date(leave.startDate).toLocaleDateString()} &nbsp; | &nbsp;
                                            <b>End Date:</b>{" "}
                                            {new Date(leave.endDate).toLocaleDateString()} &nbsp; | &nbsp;
                                            <b>Approved Date:</b> {leave.approvedAt || "-"}
                                        </p>
                                    </div>
                                    <div style={{ textAlign: "center" }}>
                                        <button
                                            style={{
                                                padding: "10px 20px",
                                                backgroundColor: "#7FC45B",
                                                color: "#fff",
                                                border: "none",
                                                borderRadius: "5px",
                                                cursor: "pointer",
                                                fontWeight: "600",
                                            }}
                                        >
                                            View
                                        </button>
                                        <p
                                            style={{
                                                marginTop: "10px",
                                                fontWeight: "600",
                                                color:
                                                    leave.status === "APPROVED"
                                                        ? "green"
                                                        : leave.status === "PENDING"
                                                        ? "orange"
                                                        : "red",
                                            }}
                                        >
                                            {leave.status}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No leave requests found.</p>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default MyLeavesApplication;

