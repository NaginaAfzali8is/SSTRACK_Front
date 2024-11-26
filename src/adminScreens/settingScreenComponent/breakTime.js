import React, { useEffect, useState } from "react";
import Switch from "../../screen/component/switch";
import user from '../../images/groupImg.svg'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import CompanyEmployess from "../../screen/component/breakTimeEmployess";
import SaveChanges from "../../screen/component/button";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import { getEmployess, setAllUserSetting, setAllUserSetting2, setAllUserSetting3, setEmployess, setEmployessSetting, setEmployessSetting2, setEmployessSetting4 } from "../../store/adminSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

function Screenshot() {

    let token = localStorage.getItem('token');
    let headers = {
        Authorization: 'Bearer ' + token,
    }
    // const [startTime, setStartTime] = useState("");
    // const [endTime, setEndTime] = useState("");
    const dispatch = useDispatch()
    const [number, setNumber] = useState(null)
    const ids = useSelector((state) => state.adminSlice.ids)
    const employees = useSelector((state) => state?.adminSlice?.employess)

    const handleApplySettings = async (employee, type, setting) => {
        const settings = {
            ...employee.effectiveSettings,
            screenshots: {
                ...employee.effectiveSettings.screenshots,
                enabled: setting
            }
        }
        const settings2 = {
            ...employee.effectiveSettings,
            screenshots: {
                ...employee.effectiveSettings.screenshots,
                frequency: `${setting}/hr`
            }
        }
        const settings3 = {
            ...employee.effectiveSettings,
            screenshots: {
                ...employee.effectiveSettings.screenshots,
                allowBlur: setting
            }
        }
        try {
            const res = await axios.patch(`https://ss-track-xi.vercel.app/api/v1/owner/settingsE/${employee._id}`,
                {
                    userId: employee._id,
                    effectiveSettings: type === "setting1" ? settings : type === "setting2" ? settings2 : settings3
                }, { headers })

            console.log('Response owner', res);

            if (res.status === 200) {
                enqueueSnackbar("Employee settings updated", {
                    variant: "success",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right"
                    }
                })
            }
            else {
                if (res.status === 403) {
                    alert("Access denied. Please check your permissions.")
                } else if (res.data.success === false) {
                    alert(res.data.message)
                }
            }
            // console.log('Employee setting ka message', response?.data?.message);
        } catch (error) {
            if (error.response && error.response.data) {
                if (error.response.status === 403 && error.response.data.success === false) {
                    // alert(error.response.data.message)
                    enqueueSnackbar(error.response.data.message, {
                        variant: "error",
                        anchorOrigin: {
                            vertical: "top",
                            horizontal: "right"
                        }
                    })
                }
            }
        }
    }

    function Setting({ setting, setSetting, employee }) {
        const salaryString = employee?.effectiveSettings?.screenshots?.frequency;
        const numberPattern = /\d+/;
        const matches = salaryString?.match(numberPattern);
        const number = matches?.length > 0 && parseInt(matches[0]);
        return (
            <>
                <div>
                    <input
                        checked={employee?.effectiveSettings?.screenshots?.enabled === true}
                        onChange={() => {
                            handleApplySettings(employee, "setting1", true);
                            dispatch(setEmployessSetting({ id: employee._id, checked: true }));
                        }}
                        type="radio"
                        id={`${employee._id}_take`} // Unique ID for "Take" option
                        name={`${employee._id}_takeOption`} // Unique name for this user's radio button group
                        value="take"
                    />
                    <label htmlFor={`${employee._id}_take`}>Take21212</label>
                </div>
                <div>
                    <select
                        value={number}
                        className="myselect"
                        onChange={(e) => {
                            handleApplySettings(employee, "setting2", e.target.value)
                            dispatch(setEmployessSetting2({ id: employee._id, frequency: e.target.value }))
                        }}
                    >
                        <option value={3}>3</option>
                        <option value={5}>5</option>
                        <option value={6}>6</option>
                        <option value={10}>10</option>
                        <option value={12}>12</option>
                        <option value={15}>15</option>
                        <option value={20}>20</option>
                        <option value={30}>30</option>
                    </select>
                </div>
                <div>
                    <p>per hour</p>
                </div>
                <div>
                    <select
                        value={employee?.effectiveSettings?.screenshots?.allowBlur === true ? "Blur" : "Do Not Blur"}
                        className="myselect"
                        onChange={(e) => {
                            const isBlurAllowed = e.target.value === "Blur"; // Check for "Blur" option
                            handleApplySettings(employee, "setting3", isBlurAllowed);
                            dispatch(setEmployessSetting4({ id: employee._id, checked: isBlurAllowed }));
                        }}
                    >
                        <option value="Blur">Allow Blur</option>
                        <option value="Do Not Blur">Disallow Blur</option>
                        <option value="Blur All">Blur all</option>
                    </select>

                </div>
                {/* <div>
                    <input
                    type="checkbox"
                        name="fav_language"
                    />
                    <label for="test2">Do not take</label>
                </div> */}
                <div>
                    <input
                        checked={employee?.effectiveSettings?.screenshots?.enabled === false}
                        onChange={() => {
                            handleApplySettings(employee, "setting1", false);
                            dispatch(setEmployessSetting({ id: employee._id, checked: false }));
                        }}
                        type="radio"
                        id={`${employee._id}_do_not_take`} // Unique ID for "Do Not Take" option
                        name={`${employee._id}_takeOption`} // Unique name for this user's radio button group
                        value="do_not_take"
                    />
                    <label htmlFor={`${employee._id}_do_not_take`}>Do Not Take</label>

                </div>
            </>
        )
    }

    async function handleApply(type) {
        try {
            const res = await axios.patch(`https://ss-track-xi.vercel.app/api/v1/superAdmin/settingsE`,
                employees?.filter(f => f.effectiveSettings?.individualss === false).map((prevEmployess) => {
                    return {
                        userId: prevEmployess._id,
                        settings: {
                            ...prevEmployess?.effectiveSettings,
                            screenshots: {
                                ...prevEmployess?.effectiveSettings?.screenshots,
                                enabled: type === "take" ? true : false,
                            },
                            userId: prevEmployess._id,
                        }
                    }
                }), { headers })
            if (res.status === 200) {
                enqueueSnackbar("Employee settings updated", {
                    variant: "success",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right"
                    }
                })
            }
            console.log(res);
        } catch (error) {
            if (error.response && error.response.data) {
                if (error.response.status === 404 && error.response.data.success === false) {
                    // alert(error.response.data.message)
                    enqueueSnackbar(error.response.data.message, {
                        variant: "error",
                        anchorOrigin: {
                            vertical: "top",
                            horizontal: "right"
                        }
                    })
                }
            }
        }
    }

    useEffect(() => {
        const salaryString = employees?.find(f => f?.effectiveSettings?.individualss === false)?.effectiveSettings?.screenshots?.frequency;
        const numberPattern = /\d+/;
        const matches = salaryString?.match(numberPattern);
        setNumber(matches?.length > 0 && parseInt(matches[0]))
    }, [employees])


    async function getData() {
        try {
            const response = await fetch(`https://ss-track-xi.vercel.app/api/v1/superAdmin/employees`, { headers })
            const json = await response.json();
            dispatch(getEmployess(json?.convertedEmployees))
            // json?.convertedEmployees.map(async (employee) => {
            //     const data = await axios.get(`https://ss-track-xi.vercel.app/api/v1/superAdmin/Settings/${employee._id}`)
            //     if (data?.data?.employeeSettings?.userId) {
            //         dispatch(setIds(data?.data?.employeeSettings?.userId))
            //     }
            // })
        }
        catch (error) {
            if (error.response && error.response.data) {
                if (error.response.status === 404 && error.response.data.success === false) {
                    // alert(error.response.data.message)
                    enqueueSnackbar(error.response.data.message, {
                        variant: "error",
                        anchorOrigin: {
                            vertical: "top",
                            horizontal: "right"
                        }
                    })
                }
            }
        }
    }

    useEffect(() => {
        getData()
    }, [])

    console.log("screenshot employess =====>", employees);
    const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);

    // const handleCheckboxChange = () => {
    //     setIsCheckboxChecked(!isCheckboxChecked);
    // };
    // const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);

    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [calculatedDuration, setCalculatedDuration] = useState("");




    const handleDurationChange = (e) => {
        const input = e.target.value; // Capture user input
        setCalculatedDuration(input); // Update the field value immediately

        // Only validate if input matches the complete format
        const regex = /^(\d+)\s*hr\s*(\d+)?\s*min?$/i; // Match "X hr Y min"
        const match = input.match(regex);

        if (match) {
            const hours = parseInt(match[1], 10) || 0; // Extract hours
            const minutes = parseInt(match[2], 10) || 0; // Extract minutes

            if ((hours === 0 && minutes >= 1 && minutes <= 59) || (hours === 1 && minutes === 0)) {
                // Valid duration range
                calculateStartAndEndTime(hours, minutes);
            } else {
                enqueueSnackbar("Please enter a valid duration between 0 hr 1 min and 1 hr 0 min.", {
                    variant: "warning",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right",
                    },
                });
            }
        }
    };

    const validateAndFormatDuration = (input) => {
        const regex = /^(\d+)\s*hr\s*(\d+)?\s*min?$/i; // Match inputs like "0 hr 1 min"
        const match = input.match(regex);

        if (match) {
            const hours = parseInt(match[1], 10) || 0; // Extract hours
            const minutes = parseInt(match[2], 10) || 0; // Extract minutes

            if (hours === 0 && minutes >= 1 && minutes <= 59) {
                // Allow valid range for 0 hours
                setCalculatedDuration(`0 hr ${minutes} min`);
                calculateStartAndEndTime(0, minutes);
            } else if (hours === 1 && minutes === 0) {
                // Allow exactly 1 hr 0 min
                setCalculatedDuration("1 hr 0 min");
                calculateStartAndEndTime(1, 0);
            } else {
                // Invalid input
                setCalculatedDuration("Invalid Time Range");
                alert("Please enter a valid duration between 0 hr 1 min and 1 hr 0 min.");
            }
        } else if (input === "") {
            // Clear input
            setCalculatedDuration("");
        } else {
            // Invalid input
            setCalculatedDuration("Invalid Time Range");
            alert("Please enter a valid duration between 0 hr 1 min and 1 hr 0 min.");
        }
    };


    const formatDurationInput = (input) => {
        const regex = /^(\d+)\s*:?(\d+)?$/; // Matches numbers with optional separator (e.g., "2 30" or "2:30")
        const match = input.match(regex);

        if (match) {
            const hours = Math.min(parseInt(match[1], 10) || 0, 1); // Restrict hours to max 1
            const minutes = parseInt(match[2], 10) || 0;

            if (hours === 1 && minutes > 0) {
                // If hours is 1, minutes must be 0
                setCalculatedDuration("1 hr 0 min");
                calculateStartAndEndTime(1, 0);
            } else if (hours === 0 && minutes >= 1 && minutes <= 59) {
                // Allow valid minutes range for 0 hours
                setCalculatedDuration(`0 hr ${minutes} min`);
                calculateStartAndEndTime(0, minutes);
            } else if (hours === 1 && minutes === 0) {
                // Allow exactly 1 hr 0 min
                setCalculatedDuration("1 hr 0 min");
                calculateStartAndEndTime(1, 0);
            } else {
                // Invalid input outside the range
                setCalculatedDuration("Invalid Time Range");
                alert("Please enter a valid duration between 0 hr 1 min and 1 hr 0 min.");
            }
        } else {
            setCalculatedDuration("");
        }
    };




    const calculateStartAndEndTime = (hours, minutes) => {
        const startDate = new Date();
        startDate.setHours(9, 0, 0); // Default start time: 09:00 AM
        const endDate = new Date(startDate);
        endDate.setHours(startDate.getHours() + hours, startDate.getMinutes() + minutes);

        const startTimeString = startDate.toTimeString().slice(0, 5); // Format as HH:MM
        const endTimeString = endDate.toTimeString().slice(0, 5); // Format as HH:MM

        setStartTime(startTimeString);
        setEndTime(endTimeString);
    };

    const formatEndTime = (startDate, hours, minutes) => {
        const endDate = new Date(startDate);
        endDate.setHours(startDate.getHours() + hours, startDate.getMinutes() + minutes);
        return endDate.toTimeString().slice(0, 5);
    };

    const handleStartTimeChange = (e) => {
        const newStartTime = e.target.value;
        setStartTime(newStartTime);
        calculateDuration(newStartTime, endTime);
    };

    const handleEndTimeChange = (e) => {
        const newEndTime = e.target.value;
        setEndTime(newEndTime);
        calculateDuration(startTime, newEndTime);
    };
    // const handleEndTimeChange = (index, value) => {
    //     const startTime = new Date(breakTime[index].breakStartTime);
    //     const endTime = new Date(value);

    //     if (endTime <= startTime) {
    //         enqueueSnackbar("End time must be later than start time.", {
    //             variant: "error",
    //             anchorOrigin: {
    //                 vertical: "top",
    //                 horizontal: "right",
    //             },
    //         });
    //         return;
    //     }

    //     handleInputChange(index, "breakEndTime", value); // Update state if valid
    // };

    const calculateDuration = (start, end) => {
        if (start && end) {
            const startDate = new Date(`1970-01-01T${start}:00`);
            const endDate = new Date(`1970-01-01T${end}:00`);

            if (endDate > startDate) {
                const durationMs = endDate - startDate;
                const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
                const durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

                setCalculatedDuration(`${durationHours}h:${durationMinutes}m`);
            } else {
                setCalculatedDuration("Invalid Time Range");
                enqueueSnackbar("End time must be after start time.", {
                    variant: "error",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right",
                    },
                });
            }
        } else {
            setCalculatedDuration("");
        }
    };


    const validateTimeDifference = (start, end) => {
        if (start && end) {
            const startDate = new Date(`1970-01-01T${start}:00`);
            const endDate = new Date(`1970-01-01T${end}:00`);

            const differenceMs = endDate - startDate;
            const differenceMinutes = differenceMs / (1000 * 60); // Convert ms to minutes

            if (differenceMinutes > 60) {
                enqueueSnackbar("The time difference cannot exceed 1 hour.", {
                    variant: "error",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right",
                    },
                });
                setEndTime(""); // Clear the invalid end time
            } else if (differenceMinutes < 0) {
                enqueueSnackbar("End time must be after start time.", {
                    variant: "error",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right",
                    },
                });
                setEndTime(""); // Clear the invalid end time
            } else {
                setEndTime(end); // Valid end time
            }
        }
    };

    const handleCheckboxChange = () => {
        setIsCheckboxChecked(!isCheckboxChecked);
        // Reset all fields when checkbox is unchecked
        if (isCheckboxChecked) {
            setStartTime("");
            setEndTime("");
            setCalculatedDuration("");
        }
    };


    // const [breakTime, setBreakTime] = useState(() => {
    //     const savedBreakTime = localStorage.getItem('breakTime');
    //     return savedBreakTime ? JSON.parse(savedBreakTime) : [{ TotalHours: "", breakStartTime: "", breakEndTime: "" }];
    // });
    const [breakTime, setBreakTime] = useState([
        { TotalHours: "", breakStartTime: "", breakEndTime: "" },
    ]);

    const [puncStartTime, setPuncStartTime] = useState("");
    const [puncEndTime, setPuncEndTime] = useState("");

    const handleInputChange = (index, field, value) => {
        const updatedBreakTime = [...breakTime];
        updatedBreakTime[index][field] = value;
        setBreakTime(updatedBreakTime);
    };

    // const addBreakTimeField = () => {
    //     setBreakTime([
    //         ...breakTime,
    //         { TotalHours: "", breakStartTime: "", breakEndTime: "" },
    //     ]);
    // };

    const [clickCount, setClickCount] = useState(0); // Counter to track clicks

    // Load break time data from local storage when the component mounts
    //   useEffect(() => {
    //     const savedBreakTime = localStorage.getItem('breakTime');
    //     if (savedBreakTime) {
    //         setBreakTime(JSON.parse(savedBreakTime));
    //     }
    // }, []);

    // Save break time data to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem('breakTime', JSON.stringify(breakTime));
    }, [breakTime]);

    const [breakCount, setBreakCount] = useState(0); // Track the number of breaks added

    const addBreakTimeField = () => {
        if (breakCount < 2) {
            setBreakCount(breakCount + 1);
            enqueueSnackbar("Break time added!", {
                variant: "success",
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "right",
                },
            });
        } else {
            enqueueSnackbar("You can only add 3 break times.", {
                variant: "warning",
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "right",
                },
            });
        }
    };


    const handleSubmit = async () => {
        // Validate inputs
        for (const breakField of breakTime) {
            if (!breakField.start || !breakField.breakEndTime) {
                enqueueSnackbar("Break Time Added Successfully", {
                    variant: "success",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right"
                    }
                });
                return; // Stop the function if validation fails
            }
        }
    
        // Format the data for API
        const requestData = [
            {
                userId: "65570c6f35e0cf001ca86c3c", // Replace with actual userId
                settings: {
                    breakTime: breakTime.map((slot) => {
                        const startTime = new Date(slot.breakStartTime);
                        const endTime = new Date(slot.breakEndTime);
    
                        // Calculate total hours
                        const totalMinutes = Math.floor((endTime - startTime) / (1000 * 60)); // Ensure correct calculation
                        const hours = Math.floor(totalMinutes / 60); // Extract hours
    
                        return {
                            TotalHours: `${hours}h`, // Only include hours
                            breakStartTime: startTime.toISOString(),
                            breakEndTime: endTime.toISOString(),
                        };
                    }),
                },
            },
        ];
    
        try {
            const response = await axios.post(
                "https://ss-track-xi.vercel.app/api/v1/superAdmin/addPunctualityzRule",
                requestData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                }
            );
    
            if (response.status === 200) {
                enqueueSnackbar("Data successfully submitted!", {
                    variant: "success",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right"
                    }
                });
            } else {
                enqueueSnackbar("Failed to submit data.", { variant: "error" });
            }
        } catch (error) {
            enqueueSnackbar("Error submitting data. Please try again later.", {
                variant: "error",
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "right"
                }
            });
            console.error("Error submitting data:", error);
        }
    };
    

    const handleIndividualPunctualitySubmit = async () => {
        try {
            // Create the request payload for all users
            const requestData = employees.map((employee) => ({
                userId: employee.userId, // Extract userId dynamically
                settings: {
                    breakTime: breakTime.map((slot) => {
                        const startTime = new Date(slot.breakStartTime);
                        const endTime = new Date(slot.breakEndTime);

                        // Calculate total hours and minutes
                        const totalMinutes = Math.floor((endTime - startTime) / (1000 * 60));
                        const hours = Math.floor(totalMinutes / 60);
                        const minutes = totalMinutes % 60;

                        return {
                            TotalHours: `${hours}h:${minutes}m`,
                            breakStartTime: startTime.toISOString(),
                            breakEndTime: endTime.toISOString(),
                        };
                    }),
                    puncStartTime: new Date(puncStartTime).toISOString(),
                    puncEndTime: new Date(puncEndTime).toISOString(),
                },
            }));

            console.log("Request Data:", requestData); // Debugging

            // Send the POST request to the API
            const response = await axios.post(
                "https://ss-track-xi.vercel.app/api/v1/superAdmin/addIndividualPunctuality",
                requestData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 200) {
                enqueueSnackbar("Punctuality rules successfully submitted!", {
                    variant: "success",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right",
                    },
                });
                console.log("API Response:", response.data);
            } else {
                enqueueSnackbar("Failed to submit punctuality rules.", {
                    variant: "error",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right",
                    },
                });
            }
        } catch (error) {
            console.error("Error submitting punctuality rules:", error);
            enqueueSnackbar(
                error?.response?.data?.message || "An error occurred while submitting the rules.",
                {
                    variant: "error",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right",
                    },
                }
            );
        }
    };

    // const handleStartTimeChange = (e) => {
    //     const newStartTime = e.target.value;
    //     setStartTime(newStartTime);
    //     calculateDuration(newStartTime, endTime);
    // };

    // const handleEndTimeChange = (e) => {
    //     const newEndTime = e.target.value;
    //     setEndTime(newEndTime);
    //     calculateDuration(startTime, newEndTime);
    // };
    const handleAddBreakTime = () => {
        if (breakTimes.length < 3) {
            setBreakTimes([...breakTimes, { start: "", end: "", duration: "" }]);
            enqueueSnackbar("Break time added!", {
                variant: "success",
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "right",
                },
            });
        } else {
            enqueueSnackbar("You can only add 2 break times.", {
                variant: "warning",
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "right",
                },
            });
        }
    };

    const [breakTimes, setBreakTimes] = useState([]); // Track the added break times

    // const handleBreakTimeChange = (index, field, value) => {
    //     const newBreakTimes = [...breakTimes];
    //     newBreakTimes[index][field] = value;
    //     setBreakTimes(newBreakTimes);
    // };
    const calculateBreakDuration = (start, end) => {
        if (start && end) {
            const startDate = new Date(`1970-01-01T${start}:00`);
            const endDate = new Date(`1970-01-01T${end}:00`);

            if (endDate > startDate) {
                const durationMs = endDate - startDate;
                const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
                const durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
                return `${durationHours}h:${durationMinutes}m`;
            } else {
                return "Invalid Time Range";
            }
        }
        return ""; // Return empty if either time is not set

    };
    
    const [errors, setErrors] = useState([]);

    const handleBreakTimeChange = (index, field, value) => {
        const updatedBreakTimes = [...breakTimes];
        updatedBreakTimes[index][field] = value;

        // Validate duration if both start and end times are provided
        const start = updatedBreakTimes[index].start;
        const end = updatedBreakTimes[index].end;

        if (start && end) {
            const startTime = new Date(`1970-01-01T${start}:00`);
            const endTime = new Date(`1970-01-01T${end}:00`);

            // Calculate duration in minutes
            const durationMinutes = Math.floor((endTime - startTime) / (1000 * 60));

            // If duration exceeds 60 minutes, show error and reset the end time
            if (durationMinutes > 60) {
                alert("Duration cannot exceed 1 hour. Please adjust the times.");
                updatedBreakTimes[index][field] = ""; // Reset the invalid field
            }
        }
        const breakTime = updatedBreakTimes[index];
        if (field === "start" || field === "end") {
            if (!breakTime.start || !breakTime.end) {
                // alert("Please fill in both Break Start Time and Break End Time.");
            }
        }
        setBreakTimes(updatedBreakTimes);
        calculateTotalDuration(); // Recalculate total duration after any change
    };

    const [totalDuration, setTotalDuration] = useState("0h:0m");

    const calculateTotalDuration = () => {
        let totalMinutes = 0;

        breakTimes.forEach(({ start, end }) => {
            if (start && end) {
                const startTime = new Date(`1970-01-01T${start}:00`);
                const endTime = new Date(`1970-01-01T${end}:00`);

                if (endTime < startTime) {
                    endTime.setDate(endTime.getDate() + 1);
                }

                totalMinutes += Math.floor((endTime - startTime) / (1000 * 60));
            }
        });

        // Cap total minutes at 60 (1 hour)
        totalMinutes = Math.min(totalMinutes, 60);

        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        setTotalDuration(`${hours}h:${minutes}m`);
    };



    return (
        <div>
            <SnackbarProvider />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div>
                    <p className="settingScreenshotHeading">Break Time</p>
                </div>
            </div>
            <div className="settingScreenshotDiv">
                <p>How frequently screenshots will be taken.</p>
                <p>This number is an average since screenshots are taken at random intervals.</p>
            </div>
            {/* Total Duration */}
            <h3>Total Break Time:</h3>
            <input type="text" value={totalDuration} readOnly placeholder="Total Duration" />

            <div className="takeScreenShotDiv">
                <div className="d-flex gap-3">


                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column", // Ensures new rows are added below each other
                            gap: "10px", // Adds spacing between rows
                        }}
                    >
                        {/* {breakTime.map((breakField, index) => {
                            // Calculate duration for the current break
                            const calculateDuration = () => {
                                if (breakField.breakStartTime && breakField.breakEndTime) {
                                    const start = new Date(breakField.breakStartTime);
                                    const end = new Date(breakField.breakEndTime);

                                    if (end > start) {
                                        const totalMinutes = Math.floor((end - start) / (1000 * 60));
                                        const hours = Math.floor(totalMinutes / 60);
                                        const minutes = totalMinutes % 60;

                                        return `${hours}h:${minutes}m`; // Format as "Xh:Ym"
                                    }
                                }
                                return "0h:0m"; // Default value
                            };

                            return (
                                <div
                                    key={index}
                                    style={{
                                        display: "flex", // Ensures the fields are laid out horizontally
                                        alignItems: "center",
                                        marginBottom: "10px",
                                        gap: "10px", // Adds spacing between fields

                                    }}
                                >
                                    <div style={{ marginBottom: "10px" }}>
                                        <input
                                            type="text"
                                            value={calculatedDuration}
                                            readOnly
                                            placeholder="Total Duration"
                                        />
                                    </div>
                                    <div className="d-flex gap-3">
                                        <input
                                            type="time"
                                            placeholder="Break Start Time"
                                            value={startTime}
                                            onChange={handleStartTimeChange}
                                            style={{
                                                marginLeft: "10px",
                                                padding: "5px",
                                                borderRadius: "4px",
                                                border: "1px solid #ccc",
                                                // flex: 1, // Adjust width of the fields proportionally

                                            }}
                                        />
                                        <input
                                            type="time"
                                            placeholder="Break End Time"
                                            value={endTime}
                                            onChange={handleEndTimeChange}
                                        />
                                    </div>
                                </div>
                            );
                        })} */}
                        {/* Break Times Section */}
                        {breakTimes.map((breakTime, index) => (
                            <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                {/* <h3>Break Time {index + 1}</h3> */}
                                <div>
                                    <label>Break Start Time:</label>
                                    <input
                                        type="time"
                                        value={breakTime.start || ""}
                                        onFocus={(e) => e.target.showPicker()} // Automatically open the time picker
                                        onChange={(e) => handleBreakTimeChange(index, "start", e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label>Break End Time:</label>
                                    <input
                                        type="time"
                                        value={breakTime.end || ""}
                                        onFocus={(e) => e.target.showPicker()} // Automatically open the time picker
                                        onChange={(e) => handleBreakTimeChange(index, "end", e.target.value)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* <div style={{ marginTop: "20px" }}>
                        <h3>Total Duration:</h3>
                        <input type="text" value={totalDuration} readOnly placeholder="Total Duration" />
                    </div> */}
                </div>
            </div>
            {/* <h3>Total Duration:</h3>
            <input type="text" value={totalDuration} readOnly placeholder="Total Duration" /> */}
            <div className="d-flex gap-3">

                <button
                    onClick={handleAddBreakTime}
                    disabled={clickCount >= 2} // Disable button after 2 clicks
                    style={{
                        padding: "10px 20px",
                        backgroundColor: clickCount >= 2 ? "#ccc" : "#7fc45a",
                        color: "#fff",
                        gap: '10px',
                        border: "none",
                        borderRadius: "5px",
                        cursor: clickCount >= 2 ? "not-allowed" : "pointer",
                    }}
                >
                    Add Break Time
                </button>
                <button onClick={handleSubmit} style={{
                    padding: "10px 20px",
                    backgroundColor: "#7fc45a",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    // cursor: clickCount >= 2 ? "not-allowed" : "pointer",
                }}>
                    Save
                </button>
            </div>

            <div className="activityLevelIndividual">
                <p className="settingScreenshotIndividual">Individual Settings</p>
                <p className="individualSettingFont">If enabled, the individual setting will be used instead of the team setting</p>
                {/* {loading ? (
                    <>
                        <Skeleton count={1} height="107px" style={{ margin: "0 0 10px 0" }} />
                        <Skeleton count={1} height="107px" style={{ margin: "0 0 10px 0" }} />
                        <Skeleton count={1} height="107px" style={{ margin: "0 0 10px 0" }} />
                        <Skeleton count={1} height="107px" style={{ margin: "0 0 10px 0" }} />
                        <Skeleton count={1} height="107px" style={{ margin: "0 0 10px 0" }} />
                    </>
                ) : ( */}
                <CompanyEmployess Setting={Setting} />
                {/* )} */}
            </div>
        </div>
    );
}


export default Screenshot;
