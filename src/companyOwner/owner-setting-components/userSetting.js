import React, { useEffect, useState } from "react";
import axios from "axios";
import line from "../../images/Line 3.webp";

const OwnerTeam = () => {
    const [leaveRequest, setLeaveRequest] = useState({
        leaveType: "",
        startDate: "",
        endDate: "",
        reason: "",
    });
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [formSubmitting, setFormSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    const currentUser = JSON.parse(localStorage.getItem("items"));
    const userId = currentUser?.id || "";
    const userType = currentUser?.userType || "";
    const apiUrl = "https://ss-track-xi.vercel.app/api/v1";
    const token = localStorage.getItem("token");
    const headers = {
        Authorization: `Bearer ${token}`,
    };

    // Predefined reasons for leave
    const leaveReasons = [
        "Personal Reason",
        "Health Issues",
        "Family Emergency",
        "Vacation",
        "Other",
    ];
    
    // Fetch all leave requests for the current user
    const fetchLeaveRequests = async () => {
        try {
            // Debug localStorage data
            // console.log("LocalStorage items:", localStorage.getItem("items"));   
    
            const currentUser = JSON.parse(localStorage.getItem("items")) || {};
            const userId = currentUser?.id || currentUser?._id || "";
    
            if (!userId) {
                console.error("No userId found. Ensure the logged-in user data is correct.");
                return;
            }
    
            console.log("Current userId:", userId);
    
            const response = await axios.get(`${apiUrl}/superAdmin/getAllLeaveRequests`, { headers });
            const { requestedLeaves, approvedLeaves } = response.data;
    
            // Filter leave requests for the logged-in user only
            const userRequestedLeaves = requestedLeaves.filter((leave) => leave.userId === userId);
            const userApprovedLeaves = approvedLeaves.filter((leave) => leave.userId === userId);
    
            // Combine filtered data for the logged-in user
            const userLeaves = [...userRequestedLeaves, ...userApprovedLeaves];
    
            // Log filtered leaves for the specific user
            console.log(`Filtered leaves for userId (${userId}):`, userLeaves);
    
            setLeaveRequests(userLeaves); // Update state to display filtered data
        } catch (error) {
            console.error("Error fetching leave requests:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userType === "user") {
            fetchLeaveRequests();
        }
    }, [userType]);

    // Handle input changes in the form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLeaveRequest((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setFormSubmitting(true);

        try {
            const response = await axios.post(`${apiUrl}/timetrack/applyForLeave`, leaveRequest, {
                headers,
            });

            if (response.status === 200) {
                alert("Leave request submitted successfully!");

                // Clear the form fields
                setLeaveRequest({
                    leaveType: "",
                    startDate: "",
                    endDate: "",
                    reason: "",
                });

                // Fetch updated leave requests
                fetchLeaveRequests();
            } else {
                alert("Failed to submit leave request.");
            }
        } catch (error) {
            console.error("Error submitting leave request:", error);
            alert(error.response?.data?.message || "An error occurred.");
        } finally {
            setFormSubmitting(false);
        }
    };

    return (
        <div className="container">
            {userType === "user" ? (
                <>
                    <div className="userHeader">
                        <h5>Apply For Leave</h5>
                    </div>
                    <div
                        className="mainwrapper ownerTeamContainer"
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                        }}
                    >
                        {/* Left Section: Leave Form */}
                        <div
                            style={{
                                flex: "1",
                                backgroundColor: "#f9f9f9",
                                padding: "20px",
                                borderRadius: "10px",
                                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                            }}
                        >
                            <h3
                                style={{
                                    color: "#0E4772",
                                    fontWeight: "600",
                                    marginBottom: "20px",
                                }}
                            >
                                Apply for Leave
                            </h3>
                            <form onSubmit={handleFormSubmit}>
                                <div style={{ marginBottom: "15px" }}>
                                    <label
                                        style={{
                                            display: "block",
                                            marginBottom: "5px",
                                            fontWeight: "600",
                                        }}
                                    >
                                        Leave Type:
                                    </label>
                                    <select
                                        name="leaveType"
                                        value={leaveRequest.leaveType}
                                        onChange={handleInputChange}
                                        style={{
                                            width: "100%",
                                            padding: "10px",
                                            border: "1px solid #ccc",
                                            borderRadius: "5px",
                                        }}
                                        required
                                    >
                                        <option value="">Select Leave Type</option>
                                        <option value="casualLeaves">Casual Leave</option>
                                        <option value="sickLeaves">Sick Leave</option>
                                        <option value="earnedLeaves">Earned Leave</option>
                                    </select>
                                </div>
                                <div style={{ marginBottom: "15px" }}>
                                    <label
                                        style={{
                                            display: "block",
                                            marginBottom: "5px",
                                            fontWeight: "600",
                                        }}
                                    >
                                        Start Date:
                                    </label>
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={leaveRequest.startDate}
                                        onChange={handleInputChange}
                                        style={{
                                            width: "100%",
                                            padding: "10px",
                                            border: "1px solid #ccc",
                                            borderRadius: "5px",
                                        }}
                                        required
                                    />
                                </div>
                                <div style={{ marginBottom: "15px" }}>
                                    <label
                                        style={{
                                            display: "block",
                                            marginBottom: "5px",
                                            fontWeight: "600",
                                        }}
                                    >
                                        End Date:
                                    </label>
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={leaveRequest.endDate}
                                        onChange={handleInputChange}
                                        style={{
                                            width: "100%",
                                            padding: "10px",
                                            border: "1px solid #ccc",
                                            borderRadius: "5px",
                                        }}
                                        required
                                    />
                                </div>
                                <div style={{ marginBottom: "20px" }}>
                                    <label
                                        style={{
                                            display: "block",
                                            marginBottom: "5px",
                                            fontWeight: "600",
                                        }}
                                    >
                                        Reason:
                                    </label>
                                    <select
                                        name="reason"
                                        value={leaveRequest.reason}
                                        onChange={handleInputChange}
                                        style={{
                                            width: "100%",
                                            padding: "10px",
                                            border: "1px solid #ccc",
                                            borderRadius: "5px",
                                        }}
                                        required
                                    >
                                        <option value="">Select a Reason</option>
                                        {leaveReasons.map((reason, index) => (
                                            <option key={index} value={reason}>
                                                {reason}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <button
                                    type="submit"
                                    style={{
                                        padding: "10px 20px",
                                        backgroundColor: "#0E4772",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "5px",
                                        cursor: "pointer",
                                        fontWeight: "600",
                                    }}
                                    disabled={formSubmitting}
                                >
                                    {formSubmitting ? "Submitting..." : "Submit Leave Request"}
                                </button>
                            </form>
                        </div>

                        {/* Center Line */}
                        <div>
                            <img src={line} style={{ height: "100%" }} alt="divider" />
                        </div>

                        {/* Right Section: Display Leave Requests */}
                        <div style={{ flexGrow: 1, paddingLeft: "20px" }}>
                            <h5 style={{ color: "#0E4772", fontWeight: "600" }}>
                                Your Leave Requests
                            </h5>
                            {loading ? (
                                <p>Loading...</p>
                            ) : leaveRequests.length > 0 ? (
                                <table className="table table-bordered table-striped">
                                    <thead>
                                        <tr>
                                            <th>Leave Type</th>
                                            <th>Start Date</th>
                                            <th>End Date</th>
                                            <th>Reason</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {leaveRequests.map((leave, index) => (
                                            <tr key={index}>
                                                <td>{leave.leaveType}</td>
                                                <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                                                <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                                                <td>{leave.reason}</td>
                                                <td>{leave.status}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p>No leave requests submitted yet.</p>
                            )}
                        </div>
                    </div>
                </>
            ) : (
                <p>You are not authorized to submit leave requests.</p>
            )}
        </div>
    );
};

export default OwnerTeam;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import line from "../../images/Line 3.webp";

// const OwnerTeam = () => {
//     const [leaveRequests, setLeaveRequests] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const currentUser = JSON.parse(localStorage.getItem("items")); // Logged-in user details
//     const userId = currentUser?.id || ""; // Current user ID
//     const apiUrl = "https://ss-track-xi.vercel.app/api/v1";
//     const token = localStorage.getItem("token");
//     const headers = {
//         Authorization: `Bearer ${token}`,
//     };

//     // Fetch leave requests for the current user
//     // const fetchLeaveRequests = async () => {
//     //     try {
//     //         const response = await axios.get(`${apiUrl}/superAdmin/getAllLeaveRequests`, { headers });
//     //         const { requestedLeaves, approvedLeaves } = response.data;

//     //         // Filter leave requests for the current user only
//     //         const userLeaves = [...requestedLeaves, ...approvedLeaves].filter(
//     //             (leave) => leave.userId === userId  
//     //         );
//     //         // Console log the filtered requestedLeaves
//     //         console.log("All requestedLeaves:", requestedLeaves);
//     //         console.log(`Filtered leaves for userId (${userId}):`, userLeaves);

//     //         setLeaveRequests(userLeaves);
//     //     } catch (error) {
//     //         console.error("Error fetching leave requests:", error);
//     //     } finally {
//     //         setLoading(false);
//     //     }
//     // };
//     const fetchLeaveRequests = async () => {
//         try {
//             // Debug localStorage data
//             // console.log("LocalStorage items:", localStorage.getItem("items"));   
    
//             const currentUser = JSON.parse(localStorage.getItem("items")) || {};
//             const userId = currentUser?.id || currentUser?._id || "";
    
//             if (!userId) {
//                 console.error("No userId found. Ensure the logged-in user data is correct.");
//                 return;
//             }
    
//             console.log("Current userId:", userId);
    
//             const response = await axios.get(`${apiUrl}/superAdmin/getAllLeaveRequests`, { headers });
//             const { requestedLeaves, approvedLeaves } = response.data;
    
//             // Filter leave requests for the logged-in user only
//             const userRequestedLeaves = requestedLeaves.filter((leave) => leave.userId === userId);
//             const userApprovedLeaves = approvedLeaves.filter((leave) => leave.userId === userId);
    
//             // Combine filtered data for the logged-in user
//             const userLeaves = [...userRequestedLeaves, ...userApprovedLeaves];
    
//             // Log filtered leaves for the specific user
//             console.log(`Filtered leaves for userId (${userId}):`, userLeaves);
    
//             setLeaveRequests(userLeaves); // Update state to display filtered data
//         } catch (error) {
//             console.error("Error fetching leave requests:", error);
//         } finally {
//             setLoading(false);
//         }
//     };
    
    
//     useEffect(() => {
//         fetchLeaveRequests();
//     }, []);

//     return (
//         <div className="container">
//             <div className="userHeader">
//                 <h5>Your Leave Requests</h5>
//             </div>
//             <div
//                 className="mainwrapper ownerTeamContainer"
//                 style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     alignItems: "flex-start",
//                 }}
//             >
//                 {/* Right Section: Display Leave Requests */}
//                 <div style={{ flexGrow: 1, paddingLeft: "20px" }}>
//                     <h5 style={{ color: "#0E4772", fontWeight: "600" }}>
//                         Submitted Leave Requests
//                     </h5>
//                     {loading ? (
//                         <p>Loading...</p>
//                     ) : leaveRequests.length > 0 ? (
//                         <table className="table table-bordered table-striped">
//                             <thead>
//                                 <tr>
//                                     <th>Leave Type</th>
//                                     <th>Start Date</th>
//                                     <th>End Date</th>
//                                     <th>Reason</th>
//                                     <th>Status</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {leaveRequests.map((leave, index) => (
//                                     <tr key={index}>
//                                         <td>{leave.leaveType}</td>
//                                         <td>{new Date(leave.startDate).toLocaleDateString()}</td>
//                                         <td>{new Date(leave.endDate).toLocaleDateString()}</td>
//                                         <td>{leave.reason}</td>
//                                         <td>{leave.status}</td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     ) : (
//                         <p>No leave requests submitted yet.</p>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default OwnerTeam;
