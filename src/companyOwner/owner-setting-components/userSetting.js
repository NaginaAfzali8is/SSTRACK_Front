import React, { useEffect, useState } from "react";
import axios from "axios";
import line from '../../images/Line 3.webp'


const OwnerTeam = () => {
    const [requestedLeaves, setRequestedLeaves] = useState([]);
    const [approvedLeaves, setApprovedLeaves] = useState([]);
    const [loading, setLoading] = useState(true);

    const apiUrl = "https://ss-track-xi.vercel.app/api/v1";
    const token = localStorage.getItem("token");
    const headers = {
        Authorization: `Bearer ${token}`,
    };

    // Fetch the leave requests data
    const fetchLeaveRequests = async () => {
        try {
            const response = await axios.get(`${apiUrl}/superAdmin/getAllLeaveRequests`, { headers });
            const { requestedLeaves, approvedLeaves } = response.data;

            setRequestedLeaves(requestedLeaves);
            setApprovedLeaves(approvedLeaves);

            console.log("Requested Leaves:", requestedLeaves);
            console.log("Approved Leaves:", approvedLeaves);
        } catch (error) {
            console.error("Error fetching leave requests:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaveRequests();
    }, []);

    const [selectedUser, setSelectedUser] = useState(null);

    // Combine and group requests by userName
    const groupedLeaves = {};
    [...requestedLeaves, ...approvedLeaves].forEach((leave) => {
        if (!groupedLeaves[leave.userName]) {
            groupedLeaves[leave.userName] = {
                leave,
                count: 0,
            };
        }
        groupedLeaves[leave.userName].count += 1;
    });

    const uniqueLeaves = Object.values(groupedLeaves);

    return (
        <div className="container">
            <div className="userHeader">
                <h5>Team</h5>
            </div>
            <div className="mainwrapper ownerTeamContainer" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                {/* Left Section */}
                <div style={{ width: "350px", marginRight: "20px" }}>
                    <div className="companyFont">
                        <p
                            style={{
                                margin: 0,
                                padding: 0,
                                fontSize: "20px",
                                color: "#0E4772",
                                fontWeight: "600",
                            }}
                        >
                            Total
                        </p>
                        <div
                            style={{
                                backgroundColor: "#28659C",
                                color: "white",
                                fontSize: "600",
                                width: "30px",
                                height: "30px",
                                borderRadius: "100%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            {requestedLeaves.length + approvedLeaves.length}
                        </div>
                    </div>

                    {/* Requested and Approved Leaves */}
                    <div>
                        {uniqueLeaves.map(({ leave, count }, index) => (
                            <div
                                key={index}
                                className="requested-leave-item"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    borderBottom: "1px solid #ccc",
                                    padding: "10px 0",
                                    cursor: "pointer", // Added this line
                                }}
                                onClick={() => setSelectedUser(leave)} // Update selected user on click
                            >
                                <div
                                    style={{
                                        backgroundColor: "#e7e7e7",
                                        borderRadius: "50%",
                                        width: "30px",
                                        height: "30px",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {index + 1}
                                </div>
                                <div style={{ flexGrow: 1 }}>
                                    <strong>{leave.userName}</strong>
                                    <span style={{ marginLeft: "10px", color: "#888" }}>
                                        ({count} request{count > 1 ? "s" : ""})
                                    </span>
                                </div>
                                <div
                                    style={{
                                        color:
                                            leave.status === "Pending"
                                                ? "orange"
                                                : leave.status === "Approved"
                                                ? "green"
                                                : "red",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {leave.status}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Center Line */}
                <div>
                    <img src={line} style={{ height: "100%" }} alt="divider" />
                </div>

                {/* Right Section */}
                <div style={{ flexGrow: 1, paddingLeft: "20px" }}>
                    {selectedUser ? (
                        <div>
                            <p
                                style={{
                                    fontSize: "18px",
                                    color: "#0E4772",
                                    fontWeight: "600",
                                    marginBottom: "10px",
                                }}
                            >
                                Selected User Details
                            </p>
                            <p>
                                <strong>Name:</strong> {selectedUser.userName}
                            </p>
                            <p>
                                <strong>Status:</strong> {selectedUser.status}
                            </p>
                        </div>
                    ) : (
                        <p
                            style={{
                                fontSize: "16px",
                                color: "#666",
                            }}
                        >
                            Click on a user to view their details here.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OwnerTeam;
