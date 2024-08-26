import React, { useEffect, useRef, useState } from "react";
import circle from "../images/online.webp";
import setting from "../images/setting.webp";
import left from "../images/Leftarrow.webp";
import right from "../images/Rightarrow.webp";
import circleDot from "../images/CircleDot.webp";
import line from "../images/line.webp";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import leftArrow from "../images/left-arrow.png"
import rightArrow from "../images/right-arrow.png"
import CircularProgressBar from "./component/circularProgressBar";
import activityImage from "../images/activity-level.svg"
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'
import useLoading from "../hooks/useLoading";
import axios from "axios";
import logo from '../images/app-logo-white.svg'
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import deleteIcon from '../images/delete.svg'
import brushIcon from '../images/brush.svg'
import { enqueueSnackbar, SnackbarProvider } from 'notistack'
import BackToTop from "./component/backToTop";
import Modal from 'react-bootstrap/Modal';
import perc_20 from "../images/Red.svg"
import perc_40 from "../images/Orange.svg"
import perc_60 from "../images/Yellow.svg"
import perc_80 from "../images/LightGreen.svg"
import perc_100 from "../images/FullGreen.svg"
import { ImCross } from "react-icons/im";
import edit from '../images/EditTimeZone.webp';
import moment from "moment-timezone";
import { useQuery } from 'react-query';
import { useSocket } from '../io'; // Correct import



function UserDetails() {

    const { loading, setLoading } = useLoading()
    const [data, setData] = useState([]);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [ssData, setSSData] = useState(null);
    const [totalActivityByDay, setTotalActivityByDay] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [activeButton, setActiveButton] = useState(null);
    const [date, setDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const today = new Date().getFullYear();
    const [clickDay, setClickDay] = useState()
    const [month, setMonth] = useState()
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [timeEntryId, setTimeEntryId] = useState(null)
    const [showScrollButton, setShowScrollButton] = useState(false)
    const [splitTime, setSplitTime] = useState(null)
    const [offlineTime, setOfflineTime] = useState({ startTime: '', endTime: '', totalHours: '0h 0m' });


    const [trimActivity, setTrimActivity] = useState(null)
    const [screenshotId, setScreenshotId] = useState(null)
    const [showSplitActivity, setShowSplitActivity] = useState(false)
    const [showTrimActivity, setShowTrimActivity] = useState(false)
    const [showOfflineTime, setShowOfflineTime] = useState(false)
    const [showDeleteButton, setShowDeleteButton] = useState(false)
    const [showEditButton, setShowEditButton] = useState(false)
    // const [fetchData, UseFetchData] = useState([])
    const [timeEntries, setTimeEntries] = useState([]);

    const [totalPercentageByDay, setTotalPercentageByDay] = useState(null)
    const [activeMonth, setActiveMonth] = useState(new Date().toLocaleDateString())
    const [timeTrackingId, setTimeTrackingId] = useState(null)

    const currentMonths = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const currentDate = new Date().getDate().toString().padStart(2, '0');
    const todayDate = `${today}-${currentMonths}-${currentDate}`;
    const [formattedDate, setFormattedDate] = useState(todayDate);
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",];
    const months = ["January", "Feburary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    const currentMonth = new Date().getMonth();
    const currentDay = new Date().getDay();
    const [startTime, setStartTime] = useState(null)
    const [endTime, setEndTime] = useState(null)
    const [deleteActivity, setDeleteActivity] = useState(false)
    const socket = useSocket()



    const apiUrl = "https://myuniversallanguages.com:9093/api/v1";
    let token = localStorage.getItem('token');
    let items = JSON.parse(localStorage.getItem('items'));
    let headers = {
        Authorization: "Bearer " + token,
    }
    const params = useParams()
    const apiUrl2 = "https://ss-track.vercel.app/api/v1/owner";
    const userId = params.id;


    const fetchScreenshots = async (userId, formattedDate, headers) => {
        const response = await axios.get(`${apiUrl}/owner/sorted-screenshots/${userId}?date=${formattedDate}`, { headers });
        return response.data;
    };

    const fetchActivities = async (userId, formattedDate, headers) => {
        const response = await axios.get(`${apiUrl}/owner/sorted-activities/${userId}?date=${formattedDate}`, { headers });
        return response.data;
    };

    const fetchHours = async (userId, formattedDate, headers) => {
        const response = await axios.get(`${apiUrl}/owner/sorted-hours/${userId}?date=${formattedDate}`, { headers });
        return response.data;
    };

    const fetchTimeTrack = async (formattedDate, headers) => {
        const response = await axios.get(`${apiUrl}/timetrack/sorted-screenshot?date=${encodeURIComponent(formattedDate)}`, { headers });
        return response.data;
    };


    const useFetchScreenshots = (userId, formattedDate, headers) => {
        return useQuery(
            'screenshots',
            () => fetchScreenshots(userId, formattedDate, headers),
            {
                enabled: items?.userType === "admin" || items?.userType === "owner" || items?.userType === "manager",
            }
        );
    };

    useEffect(() => {
        if (!socket) {
            console.error('Socket instance is null or undefined');
            return;
        }

        socket.on('connect', () => {
            console.log('Socket connected:', socket.id);
        });

        const handleUpdateData = () => {
            // console.log('Received updateData event');
            fetchData();
        };

        socket.on('new-ss', handleUpdateData);

        return () => {
            socket.off('new-ss', handleUpdateData);
        };
    }, [socket]);

    //   const useFetchActivities = (userId, formattedDate, headers) => {
    //     return useQuery(
    //       'activities',
    //       () => fetchActivities(userId, formattedDate, headers),
    //       {
    //         enabled: items?.userType === "admin" || items?.userType === "owner" || items?.userType === "manager",
    //       }
    //     );
    //   };

    //   const useFetchHours = (userId, formattedDate, headers) => {
    //     return useQuery(
    //       'hours',
    //       () => fetchHours(userId, formattedDate, headers),
    //       {
    //         enabled: items?.userType === "admin" || items?.userType === "owner" || items?.userType === "manager",
    //       }
    //     );
    //   };

    //   const useFetchTimeTrack = (formattedDate, headers) => {
    //     return useQuery(
    //       'timeTrack',
    //       () => fetchTimeTrack(formattedDate, headers),
    //       {
    //         enabled: !(items?.userType === "admin" || items?.userType === "owner" || items?.userType === "manager"),
    //       }
    //     );
    //   };
    // const { data: screenshotsData, error: screenshotsError } = useQuery(
    //     'screenshots',
    //     () => fetchScreenshots(userId, formattedDate, headers),
    //     {
    //         enabled: items?.userType === "admin" || items?.userType === "owner" || items?.userType === "manager",
    //     }
    // );

    // const { data: activitiesData, error: activitiesError } = useQuery(
    //     'activities',
    //     () => fetchActivities(userId, formattedDate, headers),
    //     {
    //         enabled: items?.userType === "admin" || items?.userType === "owner" || items?.userType === "manager",
    //     }
    // );

    // const { data: hoursData, error: hoursError } = useQuery(
    //     'hours',
    //     () => fetchHours(userId, formattedDate, headers),
    //     {
    //         enabled: items?.userType === "admin" || items?.userType === "owner" || items?.userType === "manager",
    //     }
    // );

    // const { data: timeTrackData, error: timeTrackError } = useQuery(
    //     'timeTrack',
    //     () => fetchTimeTrack(formattedDate, headers),
    //     {
    //         enabled: !(items?.userType === "admin" || items?.userType === "owner" || items?.userType === "manager"),
    //     }
    // )

    const { data: screenshotsData, error: screenshotsError } = useQuery(
        'screenshots',
        () => fetchScreenshots(userId, formattedDate, headers),
        {
            enabled: items?.userType === "admin" || items?.userType === "owner" || items?.userType === "manager",
        }
    );

    const { data: activitiesData, error: activitiesError } = useQuery(
        'activities',
        () => fetchActivities(userId, formattedDate, headers),
        {
            enabled: items?.userType === "admin" || items?.userType === "owner" || items?.userType === "manager",
        }
    );

    const { data: hoursData, error: hoursError } = useQuery(
        'hours',
        () => fetchHours(userId, formattedDate, headers),
        {
            enabled: items?.userType === "admin" || items?.userType === "owner" || items?.userType === "manager",
        }
    );

    const { data: timeTrackData, error: timeTrackError } = useQuery(
        'timeTrack',
        () => fetchTimeTrack(formattedDate, headers),
        {
            enabled: !(items?.userType === "admin" || items?.userType === "owner" || items?.userType === "manager"),
        }
    );

    // const UseFetchData = () => {
    //     setLoading(true);

    // const { data: screenshotsData, error: screenshotsError } = useQuery(
    //     'screenshots',
    //     () => fetchScreenshots(userId, formattedDate, headers),
    //     {
    //       enabled: items?.userType === "admin" || items?.userType === "owner" || items?.userType === "manager",
    //     }
    //   );

    //   const { data: activitiesData, error: activitiesError } = useQuery(
    //     'activities',
    //     () => fetchActivities(userId, formattedDate, headers),
    //     {
    //       enabled: items?.userType === "admin" || items?.userType === "owner" || items?.userType === "manager",
    //     }
    //   );

    //   const { data: hoursData, error: hoursError } = useQuery(
    //     'hours',
    //     () => fetchHours(userId, formattedDate, headers),
    //     {
    //       enabled: items?.userType === "admin" || items?.userType === "owner" || items?.userType === "manager",
    //     }
    //   );

    //   const { data: timeTrackData, error: timeTrackError } = useQuery(
    //     'timeTrack',
    //     () => fetchTimeTrack(formattedDate, headers),
    //     {
    //       enabled: !(items?.userType === "admin" || items?.userType === "owner" || items?.userType === "manager"),
    //     }
    //   );

    //   if (screenshotsData && activitiesData && hoursData) {
    //     setData(hoursData.data);
    //     setTotalActivityByDay(activitiesData.data);
    //     setTimeEntryId(hoursData.data.TimeTrackingId);
    //     setTimeTrackingId(hoursData.data.TimeTrackingId);
    //     setTimeEntries(screenshotsData.data.groupedScreenshots || []);
    //     setTrimActivity({ ...trimActivity, totalHours: hoursData.data.totalHours.daily });
    //   } else if (timeTrackData) {
    //     setData(timeTrackData.data);
    //     setTimeEntryId(timeTrackData.data.TimeTrackingId);
    //     setTimeTrackingId(timeTrackData.data.TimeTrackingId);
    //     setTimeEntries(timeTrackData.data.groupedScreenshots || []);
    //     setTrimActivity({ ...trimActivity, totalHours: timeTrackData.data.totalHours.daily });
    //   }
    // }
    const UseFetchData = () => {


        // rest of your code
    };

    useEffect(() => {
        if (screenshotsData && activitiesData && hoursData) {
            setData(hoursData.data);
            setTotalActivityByDay(activitiesData.data);
            setTimeEntryId(hoursData.data.TimeTrackingId);
            setTimeTrackingId(hoursData.data.TimeTrackingId);
            setTimeEntries(screenshotsData.data.groupedScreenshots || []);
            setTrimActivity({ ...trimActivity, totalHours: hoursData.data.totalHours.daily });
        } else if (timeTrackData) {
            setData(timeTrackData.data);
            setTimeEntryId(timeTrackData.data.TimeTrackingId);
            setTimeTrackingId(timeTrackData.data.TimeTrackingId);
            setTimeEntries(timeTrackData.data.groupedScreenshots || []);
            setTrimActivity({ ...trimActivity, totalHours: timeTrackData.data.totalHours.daily });
        }
    })
    // useEffect(() => {
    //     if(activitiesData){
    //         UseFetchData(activitiesData)
    //     }
    // })

    // useEffect(() => {
    //     if(timeTrackData){
    //         UseFetchData(timeTrackData)
    //     }
    // })

    // useEffect(() => {
    //     if(hoursData){
    //         UseFetchData(hoursData)
    //     }
    // })

    const fetchData = async () => {
        // setLoading(true);
        try {
            if (items?.userType === "admin" || items?.userType === "owner" || items?.userType === "manager") {
                const [screenshotsResponse, activitiesResponse, hoursResponse] = await Promise.all([
                    axios.get(`${apiUrl}/owner/sorted-screenshots/${userId}?date=${formattedDate}`, { headers }),
                    axios.get(`${apiUrl}/owner/sorted-activities/${userId}?date=${formattedDate}`, { headers }),
                    axios.get(`${apiUrl}/owner/sorted-hours/${userId}?date=${formattedDate}`, { headers })
                ]);

                const screenshotsData = screenshotsResponse.data;
                const activitiesData = activitiesResponse.data;
                const hoursData = hoursResponse.data;

                setData(hoursData.data);
                setTotalActivityByDay(activitiesData.data);
                setTimeEntryId(hoursData.data.TimeTrackingId);
                setTimeTrackingId(hoursData.data.TimeTrackingId);
                setTimeEntries(screenshotsData.data.groupedScreenshots || []);
                setTrimActivity({ ...trimActivity, totalHours: hoursData.data.totalHours.daily });
            } else {
                const response = await axios.get(`${apiUrl}/timetrack/sorted-screenshot?date=${encodeURIComponent(formattedDate)}`, { headers });
                if (response.data) {
                    console.log(response);
                    setData(response.data.data);
                    setTimeEntryId(response.data.data.TimeTrackingId);
                    setTimeTrackingId(response.data.data.TimeTrackingId);
                    setTimeEntries(response?.data?.data?.groupedScreenshots || []);
                    setTrimActivity({ ...trimActivity, totalHours: response?.data?.data?.totalHours.daily });
                }
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };
    // import { useQuery, useQueryClient } from 'react-query';
    // const queryClient = useQueryClient();

    // const fetchData = async () => {

    //   const { data, error, isLoading } = useQuery(
    //     'fetchData', // key
    //     async () => {
    //       if (items?.userType === "admin" || items?.userType === "owner" || items?.userType === "manager") {
    //         const [screenshotsResponse, activitiesResponse, hoursResponse] = await Promise.all([
    //           axios.get(`${apiUrl}/owner/sorted-screenshots/${userId}?date=${formattedDate}`, { headers }),
    //           axios.get(`${apiUrl}/owner/sorted-activities/${userId}?date=${formattedDate}`, { headers }),
    //           axios.get(`${apiUrl}/owner/sorted-hours/${userId}?date=${formattedDate}`, { headers })
    //         ]);

    //         const screenshotsData = screenshotsResponse.data;
    //         const activitiesData = activitiesResponse.data;
    //         const hoursData = hoursResponse.data;

    //         return {
    //           hoursData: hoursData.data,
    //           totalActivityByDay: activitiesData.data,
    //           timeEntryId: hoursData.data.TimeTrackingId,
    //           timeTrackingId: hoursData.data.TimeTrackingId,
    //           timeEntries: screenshotsData.data.groupedScreenshots || [],
    //           trimActivity: { ...trimActivity, totalHours: hoursData.data.totalHours.daily }
    //         };
    //       } else {
    //         const response = await axios.get(`${apiUrl}/timetrack/sorted-screenshot?date=${encodeURIComponent(formattedDate)}`, { headers });
    //         if (response.data) {
    //           return {
    //             data: response.data.data,
    //             timeEntryId: response.data.data.TimeTrackingId,
    //             timeTrackingId: response.data.data.TimeTrackingId,
    //             timeEntries: response?.data?.data?.groupedScreenshots || [],
    //             trimActivity: { ...trimActivity, totalHours: response?.data?.data?.totalHours.daily }
    //           };
    //         }
    //       }
    //     },
    //     {
    //       enabled: true, // default: true
    //       staleTime: 60000, // 1 minute
    //     }
    //   );

    //   if (isLoading) {
    //     setLoading(true);
    //   } else {
    //     setLoading(false);
    //   }

    //   if (error) {
    //     console.log(error);
    //   }

    //   if (data) {
    //     setData(data.hoursData);
    //     setTotalActivityByDay(data.totalActivityByDay);
    //     setTimeEntryId(data.timeEntryId);
    //     setTimeTrackingId(data.timeTrackingId);
    //     setTimeEntries(data.timeEntries);
    //     setTrimActivity(data.trimActivity);
    //   }
    // };

    // const UseFetchData = () => {
    //     setLoading(true);

    //     const { data: screenshotsData, error: screenshotsError } = useFetchScreenshots(userId, formattedDate, headers);
    //     const { data: activitiesData, error: activitiesError } = useFetchActivities(userId, formattedDate, headers);
    //     const { data: hoursData, error: hoursError } = useFetchHours(userId, formattedDate, headers);
    //     const { data: timeTrackData, error: timeTrackError } = useFetchTimeTrack(formattedDate, headers);

    //     if (screenshotsData && activitiesData && hoursData) {
    //       setData(hoursData.data);
    //       setTotalActivityByDay(activitiesData.data);
    //       setTimeEntryId(hoursData.data.TimeTrackingId);
    //       setTimeTrackingId(hoursData.data.TimeTrackingId);
    //       setTimeEntries(screenshotsData.data.groupedScreenshots || []);
    //       setTrimActivity({ ...trimActivity, totalHours: hoursData.data.totalHours.daily });
    //     } else if (timeTrackData) {
    //       setData(timeTrackData.data);
    //       setTimeEntryId(timeTrackData.data.TimeTrackingId);
    //       setTimeTrackingId(timeTrackData.data.TimeTrackingId);
    //       setTimeEntries(timeTrackData.data.groupedScreenshots || []);
    //       setTrimActivity({ ...trimActivity, totalHours: timeTrackData.data.totalHours.daily });
    //     }
    //   };

    const calculateTimeDifference = (start, end) => {
        const parseTime = (timeStr) => {
            const timeFormatRegex = /^([0-9]{1,2}):([0-9]{2})([ ]{1})(AM|PM)$/i;
            const match = timeStr.match(timeFormatRegex);

            if (!match) {
                throw new Error('Invalid time format');
            }

            let [, hours, minutes, , modifier] = match;

            hours = parseInt(hours, 10);
            minutes = parseInt(minutes, 10);

            if (modifier.toUpperCase() === 'PM' && hours !== 12) {
                hours += 12;
            } else if (modifier.toUpperCase() === 'AM' && hours === 12) {
                hours = 0;
            }

            return new Date(1970, 0, 1, hours, minutes);
        };

        try {
            if (!start || !end) {
                throw new Error('Missing start or end time');
            }

            const startTime = parseTime(start);
            const endTime = parseTime(end);
            const diff = (endTime - startTime) / 1000 / 60; // difference in minutes

            const hours = Math.floor(diff / 60);
            const minutes = Math.round(diff % 60);

            return `${hours}h ${minutes}m`;
        } catch (error) {
            console.error('Error calculating time difference:', error.message);
            return '0h 0m';
        }
    };


    const handleInputChange = (field, value) => {
        setOfflineTime((prevState) => {
            const newState = { ...prevState, [field]: value };
            if (newState.startTime && newState.endTime) {
                newState.totalHours = calculateTimeDifference(newState.startTime, newState.endTime);
            } else {
                newState.totalHours = '0h 0m';
            }
            return newState;
        });
    };


    useEffect(() => {
        UseFetchData();
    }, [formattedDate]);

    const navigate = useNavigate("")

    const isValidTimeFormat = (timeString) => {
        const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9] [AP]M$/i;
        return timeRegex.test(timeString);
    }

    const prevMonth = () => {
        setDate((prevDate) => {
            const prevMonthDate = new Date(prevDate.getFullYear(), prevDate.getMonth() - 1);
            setActiveMonth(prevMonthDate.toLocaleDateString())
            setTotalPercentageByDay(null)
            return prevMonthDate;
        });
    };

    const nextMonth = () => {
        setDate((prevDate) => {
            const nextMonthDate = new Date(prevDate.getFullYear(), prevDate.getMonth() + 1);
            setActiveMonth(nextMonthDate.toLocaleDateString())
            setTotalPercentageByDay(null)
            return nextMonthDate;
        });
    };

    const goBackToPreviousImage = () => {
        if (selectedImageIndex >= 0) {
            setSelectedImageIndex(selectedImageIndex - 1)
        }
        else {
            setSelectedImage(null);
            setSelectedImageIndex(null)
            setSSData(null)
        }
    };

    const goToNextImage = () => {
        if (selectedImageIndex < ssData?.screenshots?.length - 1) {
            setSelectedImageIndex(selectedImageIndex + 1)
        }
        else {
            setSelectedImage(null);
            setSelectedImageIndex(null)
            setSSData(null)
        }
    };

    const openModal = (element, imageSrc, index) => {
        setSelectedImage(imageSrc);
        setSelectedImageIndex(index)
        setSSData(element)
    };

    const renderCalendar = () => {
        const month = date.getMonth();
        const year = date.getFullYear();
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const daysInMonth = lastDayOfMonth.getDate();
        const weeks = [];
        let days = [];
        let currentDay = new Date(firstDayOfMonth);

        const handleClick = (key) => {
            setSelectedDate(key);
            const clickDay = new Date(key).getFullYear();
            const clickMonth = (new Date(key).getMonth() + 1).toString().padStart(2, '0');
            const clickDate = new Date(key).getDate().toString().padStart(2, '0');
            const clickDa = new Date(key).getDay();
            const clickMon = new Date(key).getMonth();
            // console.log(clickDa);
            setClickDay(clickDa)
            setMonth(clickMon)
            const formattedsDate = `${clickDay}-${clickMonth}-${clickDate}`;
            setFormattedDate(formattedsDate);
            setActiveButton(key)
        };

        // Generate cells for each day in the current month
        // ...

        // Generate cells for each day in the current month
        for (let i = 0; i < daysInMonth; i++) {
            const isWeekend = currentDay.getDay() === 0 || currentDay.getDay() === 6;
            const isFirstDayOfWeek = currentDay.getDay() === 1;
            const isLastDayOfWeek = currentDay.getDay() === 0 || i === daysInMonth - 1;
            const dayKey = currentDay.toString();
            const isCurrentDate = currentDay.getDate() === new Date().getDate() && currentDay.getMonth() === new Date().getMonth();

            const dayFormatted = `${currentDay.getFullYear()}-${(currentDay.getMonth() + 1).toString().padStart(2, '0')}-${currentDay.getDate().toString().padStart(2, '0')}`;

            // Generate a unique key using the string representation of the date
            days.push(
                <div
                    style={{ cursor: "pointer", border: "1px solid #ebeaea" }}
                    className={`col cell ${isWeekend ? "week day week first" : "day"} ${dayKey === activeButton ? "active" : isCurrentDate ? "active2" : ""}`}
                    key={dayKey}
                    onClick={() => handleClick(dayKey)}
                >
                    <p className="weekName">{currentDay.toLocaleString("en-US", { weekday: "short" })}</p>
                    <p className="Weekdate">{currentDay.getDate()}</p>
                    {/* <p className="nonetaken">{currentDay.toLocaleString("en-US", { weekday: "short" })}</p> */}
                    <div style={{ padding: "2px" }}>
                        <div style={{ width: `${totalPercentageByDay === null ? 0 : totalPercentageByDay[i]?.percentage}%`, background: 'linear-gradient(180deg,#cdeb8e 0,#a5c956)', height: '10px' }}></div>
                    </div>
                </div>
            );

            currentDay.setDate(currentDay.getDate() + 1);
        }

        weeks.push(<div className="days" key={currentDay}>{days}</div>);
        return weeks;
    };

    const closeModal = () => {
        setSelectedImage(null);
        setSSData(null)
        setSelectedImageIndex(null)
    };

    useEffect(() => {
        if (selectedImageIndex) {
            setSelectedImage(ssData?.screenshots[selectedImageIndex]?.key)
        }
        if (selectedImageIndex === 0) {
            setSelectedImage(ssData?.screenshots[0]?.key)
        }
    }, [selectedImageIndex])

    useEffect(() => {
        const keyPressHandler = (event) => {
            if (event.key === 'ArrowLeft') {
                console.log(event);
                goBackToPreviousImage();
            }
            else if (event.key === 'ArrowRight') {
                console.log(event);
                goToNextImage();
            }
            else if (event.key === 'Escape') {
                setSelectedImage(null);
                setSSData(null)
                setSelectedImageIndex(null)
            }
        }
        window.addEventListener('keydown', keyPressHandler);
        return () => window.removeEventListener('keydown', keyPressHandler);
    }, [selectedImageIndex]);

    const renderTimeIntervals = () => {
        const intervals = [];

        for (let hour = 0; hour <= 23; hour++) {
            const isPM = hour >= 12;
            const formattedHour = hour <= 12 ? hour : hour - 12;

            intervals.push(
                <div key={hour} className="time-slot">
                    <div className="hour-color">
                        {formattedHour === 0 ? 12 : formattedHour} {isPM ? 'pm' : 'am'}
                        <div className="minute-container">
                            {Array.from({ length: 60 }, (_, minute) => {
                                const timeWithMinutes = `${hour}:${minute < 10 ? '0' + minute : minute}`;
                                const color = getColorForTime(timeWithMinutes);

                                return (
                                    <div
                                        key={minute}
                                        className={`time-interval ${color !== 'transparent' ? 'red' : ''}`}
                                        style={{ background: color }}
                                    >
                                        {minute}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                </div>
            );
        }

        return intervals;
    };

    const getColorForTime = (time) => {
        const matchingEntry = timeEntries.find(entry => {
            const [startTime, endTime] = entry?.time?.split(' - ');
            const startTimeFormatted = new Date(`${encodeURIComponent(formattedDate)} ${startTime}`).getTime();
            const endTimeFormatted = new Date(`${encodeURIComponent(formattedDate)} ${endTime}`).getTime();
            const currentTimeFormatted = new Date(`${encodeURIComponent(formattedDate)} ${time}`).getTime();
            return currentTimeFormatted >= startTimeFormatted && currentTimeFormatted <= endTimeFormatted;
        });
        return matchingEntry ? "#A8C96A" : '#EFF9EC';
    };

    const fetchUser = async (activeMonth, headers) => {
        const response = await axios.get(`${apiUrl}/timetrack/hoursbyday?date=${activeMonth}`, { headers });
        return response.data;
    };

    const fetchOwner = async (activeMonth, headers, paramsId) => {
        const response = await axios.get(`${apiUrl}/superAdmin/hoursbyday/${params.id}?date=${activeMonth}`, { headers });
        return response.data;
    };



    const { data: userData, error: userError } = useQuery(
        'screenshots',
        () => fetchUser(activeMonth, headers),
        {
            enabled: items?.userType === "user",
        }
    );

    const { data: ownerData, error: ownerError } = useQuery(
        'activities',
        () => fetchOwner(),
        {
            enabled: items?.userType === "admin" || items?.userType === "owner" || items?.userType === "manager",
        }
    );
    // const fetchTotalHours = async ({ queryKey }) => {
    //     const [url, params] = queryKey;
    //     const response = await axios.get(url, { params, headers });
    //     return response.data.data.totalHoursByDay;
    // };

    // const useTotalHours = (params) => {
    //     const apiUrl = items?.userType === "user" ? `${apiUrl}/timetrack/hoursbyday` : `${apiUrl}/superAdmin/hoursbyday/${params.id}`;
    //     const queryKey = [apiUrl, { date: activeMonth }];

    //     const { data: totalHours, error, isLoading } = useQuery(
    //         queryKey,
    //         fetchTotalHours,
    //         {
    //             staleTime: 10000, // 10 seconds
    //         }
    //     );

    //     return totalHours;
    // };

    // useEffect(() => {
    //     if (totalHours) {
    //         const currentDate = new Date();
    //         const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    //         const currentYear = currentDate.getFullYear();
    //         const maxHours = 6;
    //         let percentagesByDay = [];
    //         const processMonth = (totalHours, month, year) => {
    //             const filteredHours = totalHours.filter(th => {
    //                 const dateParts = th.date.split('-').map(part => part);
    //                 return "0" + dateParts[1] === month && dateParts[2] === year;
    //             });

    //             console.log(`filteredHoursss for ${month}-${year}`, filteredHours);

    //             filteredHours.forEach(th => {
    //                 const timeMatches = th.totalHours.match(/(\d+)h\s*(\d*)m/);
    //                 let totalMinutes = 0;

    //                 if (timeMatches) {
    //                     const hours = parseInt(timeMatches[1], 10) || 0;
    //                     const minutes = parseInt(timeMatches[2], 10) || 0;
    //                     totalMinutes = hours * 60 + minutes;
    //                 }

    //                 const totalHoursDecimal = totalMinutes / 60;
    //                 const widthPercentage = (totalMinutes / (maxHours * 60)) * 100;
    //                 const widthPercentageExact = (totalHoursDecimal / maxHours) * 100;

    //                 percentagesByDay.push({
    //                     date: th.date,
    //                     totalMinutes: totalMinutes,
    //                     percentage: Math.min(widthPercentage, 100),
    //                     percentageExact: Math.min(widthPercentageExact, 100),
    //                 });
    //             });
    //         };
    //         let isFirstMonthProcessed = false;
    //         for (let year = currentDate.getFullYear(); year >= 2022; year--) {
    //             for (let month = 12; month >= 1; month--) {
    //                 processMonth(totalHours, month.toString().padStart(2, '0'), year.toString());

    //                 // Break out of the loop after processing the first month
    //                 if (month === 1 && !isFirstMonthProcessed) {
    //                     isFirstMonthProcessed = true;
    //                     break;
    //                 }
    //             }
    //         }
    //         console.log({ percentagesByDay });
    //         setTotalPercentageByDay(percentagesByDay);
    //     }
    // })
    const getUserHoursByDay = async ({ apiUrl, activeMonth, headers }) => {
        const response = await axios.get(`${apiUrl}/timetrack/hoursbyday?date=${activeMonth}`, { headers });
        return response.data.data.totalHoursByDay;
    };

    const useGetUserHoursByDay = (apiUrl, activeMonth, headers) => {
        return useQuery(
            ['getUserHoursByDay', apiUrl, activeMonth],
            () => getUserHoursByDay({ apiUrl, activeMonth, headers }),
            {
                enabled: items?.userType === "user",
            }
        );
    };

    const getSuperAdminHoursByDay = async ({ apiUrl, activeMonth, id, headers }) => {
        const response = await axios.get(`${apiUrl}/superAdmin/hoursbyday/${id}?date=${activeMonth}`, { headers });
        return response.data.data.totalHoursByDay;
    };

    const useGetSuperAdminHoursByDay = (apiUrl, activeMonth, id, headers) => {
        return useQuery(
            ['getSuperAdminHoursByDay', apiUrl, activeMonth, id],
            () => getSuperAdminHoursByDay({ apiUrl, activeMonth, id, headers }),
            {
                enabled: items?.userType === "superAdmin",
            }
        );
    };


    debugger
    // const { data: getAllUserData, error, isLoading } = useQuery(
    //     ['getAllDays', params, activeMonth], // cache key
    //     async () => {
    //       try {
    //         const { data: response } = await axios.get(
    //           items?.userType === "user"
    //             ? `${apiUrl}/timetrack/hoursbyday?date=${activeMonth}`
    //             : `${apiUrl}/superAdmin/hoursbyday/${params.id}?date=${activeMonth}`,
    //           { headers }
    //         );

    //         if (!response || !response.data) {
    //           throw new Error('Invalid API response');
    //         }

    //         const totalHours = response.data.totalHoursByDay;

    //         if (!totalHours) {
    //           console.log('totalHoursByDay property is missing or undefined');
    //           return [];
    //         }

    //         console.log("totalHours of active month", response);

    //         const currentDate = new Date();
    //         const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    //         const currentYear = currentDate.getFullYear();
    //         const maxHours = 6;
    //         let percentagesByDay = [];

    //         const processMonth = (totalHours, month, year) => {
    //             const filteredHours = totalHours.filter(th => {
    //                 const [_, monthPart, yearPart] = th.date.split('-').map(part => part);
    //                 return monthPart === month && yearPart === year;
    //               });

    //           console.log(`filteredHoursss for ${month}-${year}`, filteredHours);

    //           filteredHours.forEach(th => {
    //             if (!th || !th.date) return; // Add this check
    //             let totalMinutes = 0;

    //             if (th.totalHours) {
    //               const timeMatches = th.totalHours.match(/(\d+)h\s*(\d*)m/);
    //               if (timeMatches && timeMatches.length > 0) {
    //                 const hours = parseInt(timeMatches[1], 10) || 0;
    //                 const minutes = parseInt(timeMatches[2], 10) || 0;
    //                 totalMinutes = hours * 60 + minutes;
    //               } else {
    //                 console.log(`Invalid time format: ${th.totalHours}`);
    //               }
    //             } else {
    //               console.log(`totalHours is null or undefined: ${th.date}`);
    //             }

    //             const totalHoursDecimal = totalMinutes / 60;
    //             const widthPercentage = (totalMinutes / (maxHours * 60)) * 100;
    //             const widthPercentageExact = (totalHoursDecimal / maxHours) * 100;

    //             percentagesByDay.push({
    //               date: th.date,
    //               totalMinutes: totalMinutes,
    //               percentage: Math.min(widthPercentage, 100),
    //               percentageExact: Math.min(widthPercentageExact, 100),
    //             });
    //           });
    //         };

    //         let isFirstMonthProcessed = false;
    //         for (let year = currentDate.getFullYear(); year >= 2022; year--) {
    //           for (let month = 12; month >= 1; month--) {
    //             processMonth(totalHours, month.toString().padStart(2, '0'), year.toString());

    //             // Break out of the loop after processing the first month
    //             if (month === 1 && !isFirstMonthProcessed) {
    //               isFirstMonthProcessed = true;
    //               break;
    //             }
    //           }
    //         }

    //         console.log({ percentagesByDay });
    //         if (getAllUserData) {
    //             setTotalPercentageByDay(getAllUserData);
    //           }
    //         // return percentagesByDay;
    //       } catch (error) {
    //         console.log(error);
    //         throw error; // re-throw the error so that React Query can handle it
    //       }
    //     },
    //     {
    //       // React Query v5 options
    //       staleTime: 1000, // 1 second
    //       cacheTime: 30000, // 30 seconds
    //       onSuccess: (data) => {
    //         setTotalPercentageByDay(data);
    //       },
    //     }
    //   );
    // const fetchTotalHours = async (params, activeMonth) => {
    //     try {
    //       const { data: response } = await axios.get(
    //         items?.userType === "user"
    //           ? `${apiUrl}/timetrack/hoursbyday?date=${activeMonth}`
    //           : `${apiUrl}/superAdmin/hoursbyday/${params.id}?date=${activeMonth}`,
    //         { headers }
    //       );

    //       if (!response || !response.data) {
    //         throw new Error('Invalid API response');
    //       }

    //       return response.data.totalHoursByDay;
    //     } catch (error) {
    //       console.log(error);
    //       throw error; // re-throw the error so that React Query can handle it
    //     }
    //   };

    //   const processTotalHours = (totalHours) => {
    //     if (!totalHours) {
    //       console.log('totalHoursByDay property is missing or undefined');
    //       return [];
    //     }

    //     const currentDate = new Date();
    //     const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    //     const currentYear = currentDate.getFullYear();
    //     const maxHours = 6;
    //     let percentagesByDay = [];

    //     const processMonth = (totalHours, month, year) => {
    //       const filteredHours = totalHours.filter(th => {
    //         if (!th || !th.date) return false;
    //         if (!dateParts || dateParts.length < 3) return false; // Add this check
    //         return "0" + dateParts[1] === month && dateParts[2] === year;
    //       });

    //       console.log(`filteredHoursss for ${month}-${year}`, filteredHours);

    //       filteredHours.forEach(th => {
    //         let totalMinutes = 0;

    //         if (th.totalHours) {
    //           const timeMatches = th.totalHours.match(/(\d+)h\s*(\d*)m/);
    //           if (timeMatches && timeMatches.length > 0) {
    //             const hours = parseInt(timeMatches[1], 10) || 0;
    //             const minutes = parseInt(timeMatches[2], 10) || 0;
    //             totalMinutes = hours * 60 + minutes;
    //           } else {
    //             console.log(`Invalid time format: ${th.totalHours}`);
    //           }
    //         } else {
    //           console.log(`totalHours is null or undefined: ${th.date}`);
    //         }

    //         const totalHoursDecimal = totalMinutes / 60;
    //         const widthPercentage = (totalMinutes / (maxHours * 60)) * 100;
    //         const widthPercentageExact = (totalHoursDecimal / maxHours) * 100;

    //         percentagesByDay.push({
    //           date: th.date,
    //           totalMinutes: totalMinutes,
    //           percentage: Math.min(widthPercentage, 100),
    //           percentageExact: Math.min(widthPercentageExact, 100),
    //         });
    //       });
    //     };

    //     let isFirstMonthProcessed = false;
    //     for (let year = currentDate.getFullYear(); year >= 2022; year--) {
    //       for (let month = 12; month >= 1; month--) {
    //         processMonth(totalHours, month.toString().padStart(2, '0'), year.toString());

    //         // Break out of the loop after processing the first month
    //         if (month === 1 && !isFirstMonthProcessed) {
    //           isFirstMonthProcessed = true;
    //           break;
    //         }
    //       }
    //     }

    //     console.log({ percentagesByDay });
    //     return percentagesByDay;
    //   };

    //   const { data: getAllUserData, error, isLoading } = useQuery(
    //     ['getAllDays', params, activeMonth], // cache key
    //     async () => {
    //       const totalHours = await fetchTotalHours(params, activeMonth);
    //       return processTotalHours(totalHours);
    //     },
    //     {
    //       // React Query v5 options
    //       staleTime: 1000, // 1 second
    //       cacheTime: 30000, // 30 seconds
    //     }
    //   );
    async function getAllDays() {
        console.log(params);
        try {
            const response = await axios.get(items?.userType === "user" ? `${apiUrl}/timetrack/hoursbyday?date=${activeMonth}` : `${apiUrl}/superAdmin/hoursbyday/${params.id}?date=${activeMonth}`, { headers });
            const totalHours = response.data.data.totalHoursByDay;
            console.log("totalHours of active month", response.data);
            const currentDate = new Date();
            const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
            const currentYear = currentDate.getFullYear();
            const maxHours = 6;
            let percentagesByDay = [];
            const processMonth = (totalHours, month, year) => {
                const filteredHours = totalHours.filter(th => {
                    const dateParts = th.date.split('-').map(part => part);
                    return "0" + dateParts[1] === month && dateParts[2] === year;
                });

                console.log(`filteredHoursss for ${month}-${year}`, filteredHours);

                filteredHours.forEach(th => {
                    const timeMatches = th.totalHours.match(/(\d+)h\s*(\d*)m/);
                    let totalMinutes = 0;

                    if (timeMatches) {
                        const hours = parseInt(timeMatches[1], 10) || 0;
                        const minutes = parseInt(timeMatches[2], 10) || 0;
                        totalMinutes = hours * 60 + minutes;
                    }

                    const totalHoursDecimal = totalMinutes / 60;
                    const widthPercentage = (totalMinutes / (maxHours * 60)) * 100;
                    const widthPercentageExact = (totalHoursDecimal / maxHours) * 100;

                    percentagesByDay.push({
                        date: th.date,
                        totalMinutes: totalMinutes,
                        percentage: Math.min(widthPercentage, 100),
                        percentageExact: Math.min(widthPercentageExact, 100),
                    });
                });
            };
            let isFirstMonthProcessed = false;
            for (let year = currentDate.getFullYear(); year >= 2022; year--) {
                for (let month = 12; month >= 1; month--) {
                    processMonth(totalHours, month.toString().padStart(2, '0'), year.toString());

                    // Break out of the loop after processing the first month
                    if (month === 1 && !isFirstMonthProcessed) {
                        isFirstMonthProcessed = true;
                        break;
                    }
                }
            }
            console.log({ percentagesByDay });
            setTotalPercentageByDay(percentagesByDay);
        }
        catch (error) {
            console.log(error);
        }
    }
    const { data: totalHoursData, error: totalHoursError, isLoading: totalHoursLoading } = useQuery(
        'totalHours',
        async () => {
          const response = await axios.get(items?.userType === "user" ? `${apiUrl}/timetrack/hoursbyday?date=${activeMonth}` : `${apiUrl}/superAdmin/hoursbyday/${params.id}?date=${activeMonth}`, { headers });
          return response.data.data.totalHoursByDay;
        },
        {
          enabled: Boolean(params) && Boolean(activeMonth),
        }
      );
      
      useEffect(() => {
        if (totalHoursData) {
          const currentDate = new Date();
          const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
          const currentYear = currentDate.getFullYear();
          const maxHours = 6;
          let percentagesByDay = [];
      
          const processMonth = (totalHours, month, year) => {
            const filteredHours = totalHours.filter(th => {
              const dateParts = th.date.split('-').map(part => part);
              return "0" + dateParts[1] === month && dateParts[2] === year;
            });
      
            console.log(`filteredHoursss for ${month}-${year}`, filteredHours);
      
            filteredHours.forEach(th => {
              const timeMatches = th.totalHours.match(/(\d+)h\s*(\d*)m/);
              let totalMinutes = 0;
      
              if (timeMatches) {
                const hours = parseInt(timeMatches[1], 10) || 0;
                const minutes = parseInt(timeMatches[2], 10) || 0;
                totalMinutes = hours * 60 + minutes;
              }
      
              const totalHoursDecimal = totalMinutes / 60;
              const widthPercentage = (totalMinutes / (maxHours * 60)) * 100;
              const widthPercentageExact = (totalHoursDecimal / maxHours) * 100;
      
              percentagesByDay.push({
                date: th.date,
                totalMinutes: totalMinutes,
                percentage: Math.min(widthPercentage, 100),
                percentageExact: Math.min(widthPercentageExact, 100),
              });
            });
          };
      
          let isFirstMonthProcessed = false;
          for (let year = currentDate.getFullYear(); year >= 2022; year--) {
            for (let month = 12; month >= 1; month--) {
              processMonth(totalHoursData, month.toString().padStart(2, '0'), year.toString());
      
              // Break out of the loop after processing the first month
              if (month === 1 && !isFirstMonthProcessed) {
                isFirstMonthProcessed = true;
                break;
              }
            }
          }
      
          console.log({ percentagesByDay });
          setTotalPercentageByDay(percentagesByDay);
        }
      }, [totalHoursData]);
      
    // const fetchAllDays = async (params, apiUrl, activeMonth, headers) => {
    //     try {
    //         const response = await axios.get(
    //             items?.userType === "user"
    //                 ? `${apiUrl}/timetrack/hoursbyday?date=${activeMonth}`
    //                 : `${apiUrl}/superAdmin/hoursbyday/${params.id}?date=${activeMonth}`,
    //             { headers }
    //         );
    //         return response.data;
    //     } catch (error) {
    //         console.log(error);
    //         throw error;
    //     }
    // };

    // const { data: allDaysData, error: allDaysError, isLoading: allDaysLoading } = useQuery(
    //     'allDays',
    //     () => fetchAllDays(params, apiUrl, activeMonth, headers),
    //     {
    //         enabled: !!params && !!apiUrl && !!activeMonth && !!headers,
    //     }
    // );

    // if (allDaysData) {
    //     const totalHours = allDaysData.data.totalHoursByDay;
    //     console.log("totalHours of active month", allDaysData);
    //     const currentDate = new Date();
    //     const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    //     const currentYear = currentDate.getFullYear();
    //     const maxHours = 6;
    //     let percentagesByDay = [];
    //     const processMonth = (totalHours, month, year) => {
    //         const filteredHours = totalHours.filter(th => {
    //             const dateParts = th.date.split('-').map(part => part);
    //             return "0" + dateParts[1] === month && dateParts[2] === year;
    //         });

    //         console.log(`filteredHoursss for ${month}-${year}`, filteredHours);

    //         filteredHours.forEach(th => {
    //             const timeMatches = th.totalHours.match(/(\d+)h\s*(\d*)m/);
    //             let totalMinutes = 0;

    //             if (timeMatches) {
    //                 const hours = parseInt(timeMatches[1], 10) || 0;
    //                 const minutes = parseInt(timeMatches[2], 10) || 0;
    //                 totalMinutes = hours * 60 + minutes;
    //             }

    //             const totalHoursDecimal = totalMinutes / 60;
    //             const widthPercentage = (totalMinutes / (maxHours * 60)) * 100;
    //             const widthPercentageExact = (totalHoursDecimal / maxHours) * 100;

    //             percentagesByDay.push({
    //                 date: th.date,
    //                 totalMinutes: totalMinutes,
    //                 percentage: Math.min(widthPercentage, 100),
    //                 percentageExact: Math.min(widthPercentageExact, 100),
    //             });
    //         });
    //     };
    //     let isFirstMonthProcessed = false;
    //     for (let year = currentDate.getFullYear(); year >= 2022; year--) {
    //         for (let month = 12; month >= 1; month--) {
    //             processMonth(totalHours, month.toString().padStart(2, '0'), year.toString());

    //             // Break out of the loop after processing the first month
    //             if (month === 1 && !isFirstMonthProcessed) {
    //                 isFirstMonthProcessed = true;
    //                 break;
    //             }
    //         }
    //     }
    //     console.log({ percentagesByDay });
    //     setTotalPercentageByDay(percentagesByDay);
    // }

    const getAllDaysData = async ({ apiUrl, activeMonth, headers, params }) => {
        try {
            const response = await axios.get(items?.userType === "user" ? `${apiUrl}/timetrack/hoursbyday?date=${activeMonth}` : `${apiUrl}/superAdmin/hoursbyday/${params.id}?date=${activeMonth}`, { headers });
            const totalHours = response.data.data.totalHoursByDay;

            const currentDate = new Date();
            const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
            const currentYear = currentDate.getFullYear();
            const maxHours = 6;
            let percentagesByDay = [];

            const processMonth = (totalHours, month, year) => {
                const filteredHours = totalHours.filter(th => {
                    const dateParts = th.date.split('-').map(part => part);
                    return "0" + dateParts[1] === month && dateParts[2] === year;
                });

                filteredHours.forEach(th => {
                    const timeMatches = th.totalHours.match(/(\d+)h\s*(\d*)m/);
                    let totalMinutes = 0;

                    if (timeMatches) {
                        const hours = parseInt(timeMatches[1], 10) || 0;
                        const minutes = parseInt(timeMatches[2], 10) || 0;
                        totalMinutes = hours * 60 + minutes;
                    }

                    const totalHoursDecimal = totalMinutes / 60;
                    const widthPercentage = (totalMinutes / (maxHours * 60)) * 100;
                    const widthPercentageExact = (totalHoursDecimal / maxHours) * 100;

                    percentagesByDay.push({
                        date: th.date,
                        totalMinutes: totalMinutes,
                        percentage: Math.min(widthPercentage, 100),
                        percentageExact: Math.min(widthPercentageExact, 100),
                    });
                });
            };

            let isFirstMonthProcessed = false;
            for (let year = currentDate.getFullYear(); year >= 2022; year--) {
                for (let month = 12; month >= 1; month--) {
                    processMonth(totalHours, month.toString().padStart(2, '0'), year.toString());

                    // Break out of the loop after processing the first month
                    if (month === 1 && !isFirstMonthProcessed) {
                        isFirstMonthProcessed = true;
                        break;
                    }
                }
            }

            return percentagesByDay;
        } catch (error) {
            throw error;
        }
    };
    // const useGetAllDays = (apiUrl, activeMonth, headers, params) => {
    //     return useQuery(
    //       ['getAllDays', apiUrl, activeMonth, params],
    //       () => getAllDaysData({ apiUrl, activeMonth, headers, params }),
    //       {
    //         enabled: true,
    //       }
    //     );
    //   };


    useEffect(() => {
        getAllDays();
    }, []);



    const handleOpenDeleteModal = (element, elements) => {
        setShowDeleteModal(true)
        setScreenshotId(elements._id)
    }

    const handleDeleteSS = async () => {
        setShowDeleteModal(false)
        try {
            const response = await axios.delete(`${apiUrl}/timetrack/deleteScreenshot/${screenshotId}/TimeTracking/${timeEntryId}`, {
                headers: headers
            })
            if (response.status === 200) {
                console.log(response);
                enqueueSnackbar("Screenshot deleted", {
                    variant: "success",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right"
                    }
                })
            }
            UseFetchData()
        } catch (error) {
            console.log(error);
            enqueueSnackbar("network error", {
                variant: "error",
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "right"
                }
            })
        }
    }

    const handleSplitActivity = async () => {
        setShowSplitActivity(false)
        setShowTrimActivity(false)
        setShowOfflineTime(false)
        if (!isValidTimeFormat(splitTime?.splitTime)) {
            setShowSplitActivity(true)
            enqueueSnackbar("Invalid time format", {
                variant: "error",
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "right"
                }
            })
            return;
        }
        try {
            const response = await axios.post(`${apiUrl}/superAdmin/split-activity`, {
                timeEntryId: trimActivity?.timeentryId,
                userId: params.id,
                splitTime: formattedDate + " " + splitTime?.splitTime
            }, {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            })
            if (response.status === 200) {
                enqueueSnackbar(response.data.message, {
                    variant: "success",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right"
                    }
                })
                UseFetchData()
                console.log(response);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const offsetInMinutes = moment.tz(items?.timezone).utcOffset();
    const offsetInHours = offsetInMinutes / 60;
    const offsetSign = offsetInHours >= 0 ? '+' : '-';
    const formattedOffset = `${offsetSign}${Math.abs(offsetInHours)}`;

    const handleTrimActivity = async () => {
        setShowOfflineTime(false)
        setShowTrimActivity(false)
        setShowSplitActivity(false)
        const timeEntryId = trimActivity?.timeentryId
        if (deleteActivity === false) {
            const formattedStartTime = formattedDate + " " + trimActivity?.startTime;
            const formattedEndTime = formattedDate + " " + trimActivity?.endTime;
            if (!isValidTimeFormat(trimActivity.startTime) || !isValidTimeFormat(trimActivity.endTime)) {
                setShowTrimActivity(true)
                enqueueSnackbar("Invalid time format", {
                    variant: "error",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right"
                    }
                })
                return;
            }
            try {
                const response = await axios.patch(`${apiUrl}/superAdmin/trim-activity/${params.id}/${timeEntryId}`, {
                    startTime: formattedStartTime,
                    endTime: formattedEndTime,
                }, {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                });
                if (response.status === 200) {
                    enqueueSnackbar(response.data.data.message, {
                        variant: "success",
                        anchorOrigin: {
                            vertical: "top",
                            horizontal: "right"
                        }
                    })
                    UseFetchData()
                    console.log(response);
                }
            } catch (error) {
                console.log(error);
            }
        }
        else {
            try {
                const response = await axios.delete(`${apiUrl}/superAdmin/time-tracking/${timeTrackingId}/activity/${timeEntryId}`, {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                });
                if (response.status === 200) {
                    enqueueSnackbar(response.data.message, {
                        variant: "success",
                        anchorOrigin: {
                            vertical: "top",
                            horizontal: "right"
                        }
                    })
                    UseFetchData()
                    console.log(response);
                }
            } catch (error) {
                console.log(error);
            }
        }
    };

    const handleAddOfflineTime = async () => {
        setShowOfflineTime(false)
        setShowSplitActivity(false)
        setShowTrimActivity(false)
        console.log({
            startTime: formattedDate + " " + offlineTime?.startTime,
            endTime: formattedDate + " " + offlineTime?.endTime,
            projectId: "643fb528272a1877e4fcf30e",
            notes: "Offline activity description"
        });
        if (!isValidTimeFormat(offlineTime.startTime) || !isValidTimeFormat(offlineTime.endTime)) {
            setShowOfflineTime(true)
            enqueueSnackbar("Please enter the valid time format 00:00 AM/PM", {
                variant: "error",
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "right"
                }
            })
            return;
        }
        try {
            const response = await axios.post(`${apiUrl}/superAdmin/offline-time/${params.id}`, {
                startTime: formattedDate + " " + offlineTime?.startTime,
                endTime: formattedDate + " " + offlineTime?.endTime,
                projectId: "643fb528272a1877e4fcf30e",
                notes: "Offline activity description"
            }, {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            })
            if (response.status === 200) {
                enqueueSnackbar("offline time added", {
                    variant: "success",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right"
                    }
                })
                console.log(response);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleDivClick = () => {
        setDeleteActivity(!deleteActivity);
    };

    async function handleBlurSS(timeEntId, ssId) {
        if (items.userType === "user") {
            setData((prevData) => {
                return {
                    ...prevData,
                    groupedScreenshots: prevData.groupedScreenshots.map((groupSS, ind) => {
                        if (groupSS.timeentryId === timeEntId) {
                            return {
                                ...groupSS,
                                screenshots: groupSS.screenshots.map((ss) => {
                                    if (ss._id === ssId) {
                                        return {
                                            ...ss,
                                            screenshot: {
                                                ...ss.screenshot,
                                                blur: true
                                            }
                                        }
                                    }
                                    return ss
                                })
                            }
                        }
                        return groupSS
                    })
                }
            })
            try {
                const response = await axios.post(`${apiUrl}/timetrack/blur/${ssId}/TimeTracking/${data?.TimeTrackingId}`, {}, {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                });
                if (response.status === 200) {
                    enqueueSnackbar("screenshot blur successfully", {
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
        else {
            setTimeEntries((prevData) => {
                return prevData.map((f) => {
                    return {
                        ...f,
                        screenshots: f.screenshots.map((ss) => {
                            if (ss._id === ssId) {
                                return {
                                    ...ss,
                                    screenshot: {
                                        ...ss.screenshot,
                                        blur: true
                                    }
                                }
                            }
                            return ss
                        })
                    }
                })
            })
            try {
                const response = await axios.post(`${apiUrl}/timetrack/blur/${ssId}/TimeTracking/${timeTrackingId}`, {}, {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                });
                if (response.status === 200) {
                    enqueueSnackbar("screenshot blur successfully", {
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

    console.log(timeEntries);


    const handleKeyPress = (e) => {
        const charCode = e.charCode;
        const char = String.fromCharCode(charCode).toUpperCase();
        const currentValue = e.target.value.toUpperCase();

        // Allow only numbers, colon, dash, space, and single instance of AM/PM
        if (
            (charCode < 48 || charCode > 57) && // numeric (0-9)
            charCode !== 58 && // colon (:)
            charCode !== 45 && // dash (-)
            !(char === 'A' || char === 'P' || char === 'M' || char === ' ') // AM/PM or space
        ) {
            e.preventDefault();
        }

        // Prevent multiple instances of AM/PM
        if ((char === 'A' || char === 'P' || char === 'M') && currentValue.includes(char)) {
            e.preventDefault();
        }
    };


    return (
        <div>
            {showScrollButton === true ? <BackToTop /> : null}

            {showDeleteModal ? <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} animation={true} centered>
                <Modal.Body>
                    <p style={{ marginBottom: "20px", fontWeight: "700", fontSize: "20px" }}>Delete screenshot</p>
                    <p>Are you sure want to delete this screenshot? This will also cut time from your timeline.</p>
                </Modal.Body>
                <Modal.Footer>
                    <button className="teamActionButton" onClick={handleDeleteSS}>
                        DELETE
                    </button>
                    <button className="teamActionButton" onClick={() => setShowDeleteModal(false)}>
                        CANCEL
                    </button>
                </Modal.Footer>
            </Modal> : null}

            {showTrimActivity ? <Modal show={showTrimActivity} onHide={() => {
                setShowOfflineTime(true)
                setShowTrimActivity(false)
                setShowSplitActivity(false)
            }} animation={true} centered>
                <Modal.Body>
                    <p style={{ marginBottom: "20px", fontWeight: "700", fontSize: "20px" }}>Edit time</p>
                    <div className="editBoxLowerDiv">
                        <p>You can trim activity time, or edit activity note. <br />
                            If you need add time, then <span style={{ cursor: "pointer", fontWeight: "bold", textDecoration: "underline" }} onClick={() => {
                                setShowOfflineTime(true)
                                setShowTrimActivity(false)
                                setShowSplitActivity(false)
                            }}>Add Offline Time </span> instead
                        </p>

                        {trimActivity?.startTime < startTime || trimActivity?.endTime > endTime ? (
                            <p style={{ color: "red" }}>`From` and `To` must be within current bounds. <br /> To add extra time, Add Offline Time instead.</p>
                        ) : null}

                        <div className="editboxinputdiv">
                            <input onChange={(e) => setTrimActivity({ ...trimActivity, startTime: e.target.value })} value={trimActivity?.startTime} />
                            -
                            <input onChange={(e) => setTrimActivity({ ...trimActivity, endTime: e.target.value })} value={trimActivity?.endTime} />
                            <p>{trimActivity?.totalHours ? trimActivity?.totalHours : "0h 0m"}</p>
                        </div>
                        <p className="sevenAm">eg 7am to 9:10am or 17:30 to 22:00</p>
                        {/* <div>
                            <select className="projectOption" defaultValue="">
                                <option>Infiniti Solutions</option>
                                <option>Y8HR</option>
                                <option>Peel HR</option>
                                <option>Geox HR</option>
                                <option>Click HR</option>
                            </select>
                        </div> */}
                        <textarea placeholder="Note (optional)" rows="5" ></textarea>
                        <div className="deleteActivityPart">
                            <div style={{ cursor: "pointer", display: "flex", alignItems: "center" }} onClick={handleDivClick}>
                                <input id="editcheck" type="checkbox" checked={deleteActivity} onChange={(e) => setDeleteActivity(e.target.checked)} />
                                <p style={{ margin: "0 0 0 10px", padding: 0 }}>Delete this activity</p>
                            </div>
                            <p style={{ margin: 0, cursor: "pointer" }} onClick={() => {
                                setShowSplitActivity(true)
                                setShowTrimActivity(false)
                            }}>Split Activity</p>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button className="teamActionButton" onClick={handleTrimActivity}>
                        SAVE CHANGES
                    </button>
                    <button className="teamActionButton" onClick={() => {
                        setShowOfflineTime(false)
                        setShowTrimActivity(false)
                        setShowSplitActivity(false)
                    }}>
                        CANCEL
                    </button>
                </Modal.Footer>
            </Modal> : null}

            {showSplitActivity ? <Modal show={showSplitActivity} onHide={() => {
                setShowSplitActivity(false)
                setShowTrimActivity(false)
                setShowOfflineTime(false)
            }} animation={true} centered>
                <Modal.Body>
                    <p style={{ marginBottom: "20px", fontWeight: "700", fontSize: "20px" }}>Edit time</p>
                    <div className="editBoxLowerDiv">
                        <div className="editboxinputdiv">
                            <input disabled={true} value={splitTime?.startTime} />
                            -<input value={splitTime?.splitTime} onChange={(e) => setSplitTime({ ...splitTime, splitTime: e.target.value })}

                                onKeyPress={(e) => {
                                    // Prevent non-numeric characters
                                    const keyCode = e.keyCode || e.which;
                                    const keyValue = String.fromCharCode(keyCode);
                                    if (!/^\d+$/.test(keyValue)) {
                                        e.preventDefault();
                                    }
                                }}
                                placeholder="split" />-

                            <p>{trimActivity?.totalHours ? trimActivity?.totalHours : "0h 0m"}</p>

                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button className="teamActionButton" onClick={handleSplitActivity}>
                        SAVE CHANGES
                    </button>
                    <button className="teamActionButton" onClick={() => {
                        setShowSplitActivity(false)
                        setShowTrimActivity(false)
                        setShowOfflineTime(false)
                    }}>
                        CANCEL
                    </button>
                </Modal.Footer>
            </Modal> : null}
            {showOfflineTime ? <Modal show={showOfflineTime} onHide={() => {
                setShowOfflineTime(false)
                setShowSplitActivity(false)
                setShowTrimActivity(false)
            }} animation={true} centered>
                <Modal.Body>
                    <p style={{ marginBottom: "20px", fontWeight: "700", fontSize: "20px" }}>Add Offline Time</p>
                    <div className="editBoxLowerDiv">
                        <p>Offline time range will appear on your timeline <br />
                            You will able to edit or delete from there
                        </p>
                        <div className="editboxinputdiv">
                            <input onKeyPress={handleKeyPress}
                                onChange={(e) => handleInputChange('startTime', e.target.value)} placeholder="09:00 AM" />
                            -
                            <input onKeyPress={handleKeyPress}
                                onChange={(e) => handleInputChange('endTime', e.target.value)} placeholder="05:00 PM" />
                            {/* <p>{trimActivity?.totalHours ? trimActivity?.totalHours : "0h 0m"}</p> */}
                            <p>{offlineTime.totalHours}</p>
                        </div>
                        <p className="sevenAm">eg 7am to 9:10am or 17:30 to 22:00</p>
                        <div>
                            <select className="projectOption">
                                <option>i8iS</option>

                            </select>
                        </div>
                        <textarea placeholder="Note (optional)" rows="5" ></textarea>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button className="teamActionButton" onClick={handleAddOfflineTime}>
                        SAVE CHANGES
                    </button>
                    <button className="teamActionButton" onClick={() => {
                        setShowOfflineTime(false)
                        setShowSplitActivity(false)
                        setShowTrimActivity(false)
                    }}>
                        CANCEL
                    </button>
                </Modal.Footer>
            </Modal> : null}
            <SnackbarProvider />
            <div className="container">
                <div className="mainwrapper">
                    <div className="userHeader">
                        <div className="headerTop">
                            <h5><img src={circle} alt="" /> {data?.name}</h5>
                        </div>
                        <div className="headerTop">
                            <p>All times are UTC {formattedOffset}</p>
                            <img
                                src={setting}
                                alt="setting.png"
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                    navigate("/account")
                                }}
                            />
                        </div>
                    </div>
                    <div className="userMainContent">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div className="header">
                                <img src={left} onClick={prevMonth} alt="Previous Month" />
                                <h2 className="monthName">{date.toLocaleString("en-US", { month: "long", year: "numeric" })}</h2>
                                <img src={right} onClick={nextMonth} alt="Next Month" />
                            </div>
                            {/* <div>
                                <button onClick={() => navigate(`/activity/${params.id}`)}>View activity</button>
                            </div> */}
                        </div>
                        <div className="days-weeks">{renderCalendar()}</div>
                        {items.userType === "user" ? (
                            <div className="timerAndTracking">
                                <div style={{ margin: "0 10px 0 0" }} className="timerLeft">
                                    <div>
                                        <img width={120} src={logo} alt="" />
                                    </div>
                                    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
                                        <p className="weekDayTimer">{formattedDate == todayDate ? days[currentDay] : days[clickDay]} </p>
                                        <p className="weekDayTimer">{formattedDate && formattedDate.split('-')[2]}</p>
                                        <p className="weekDateTimer">{formattedDate == todayDate ? months[currentMonth] : months[month]}</p>
                                        <OverlayTrigger placement="top" overlay={<Tooltip>{Math.floor(data?.totalactivity)} %</Tooltip>}>
                                            <div className="circular-progress" style={{
                                                cursor: "pointer"
                                            }}>
                                                <CircularProgressBar activityPercentage={data?.totalactivity} size={30} />
                                            </div>
                                        </OverlayTrigger>
                                        <p className="timerClock">{data?.totalHours?.daily}</p>
                                        <p className="weekTimer">Week</p>
                                        <p className="weekTimerDigit">{data?.totalHours?.weekly}</p>
                                        <img src={circleDot} alt="CircleDot.png" />
                                        <p className="weekTimer">Month</p>
                                        <p className="monthTimerDigit">{data?.totalHours?.monthly}</p>
                                    </div>
                                </div>
                                <div className="activity-image-container">
                                    <div className="activityMainHeading">
                                        <h4 className="activityMainHeadingContent">Activity Tracker</h4>
                                        <p className="activityMainContent">Activity Level</p>
                                    </div>
                                    <div className="activityMeternContent">
                                        <div className="activityMeterContentMain">
                                            <div className="activityMeterContent">
                                                <img src={perc_20} alt="" />
                                                <p className="activityMeterContentPercent">0 - 20 %</p>
                                            </div>
                                            <div className="activityMeterContent">
                                                <img src={perc_40} alt="" />
                                                <p className="activityMeterContentPercent">21 - 40 %</p>
                                            </div>
                                            <div className="activityMeterContent">
                                                <img src={perc_60} alt="" />
                                                <p className="activityMeterContentPercent">41 - 60 %</p>
                                            </div>
                                            <div className="activityMeterContent">
                                                <img src={perc_80} alt="" />
                                                <p className="activityMeterContentPercent">61 - 80 %</p>
                                            </div>
                                            <div className="activityMeterContent" style={{ width: 200 }}>
                                                <img src={perc_100} alt="" />
                                                <p className="activityMeterContentPercent" >81 - 100 %</p>
                                            </div>
                                        </div>
                                        <div className="activityMeterMain">
                                            <div className="activityMeterMainContainer">
                                                <img className="activityMeterMainImage" src={activityImage} alt="" />
                                                <div className="needleContainerMain">
                                                    <div
                                                        className="needleContainerMainAlingment"
                                                        style={{
                                                            transform: `translateY(-50%) rotate(${Math.floor(data?.totalactivity) <= 20 ? -75 :
                                                                Math.floor(data?.totalactivity) > 20 && Math.floor(data?.totalactivity) <= 40 ? -38 :
                                                                    Math.floor(data?.totalactivity) > 40 && Math.floor(data?.totalactivity) <= 60 ? 0 :
                                                                        Math.floor(data?.totalactivity) > 60 && Math.floor(data?.totalactivity) <= 80 ? 35 :
                                                                            Math.floor(data?.totalactivity) > 80 ? 75 : -108
                                                                }deg)`
                                                        }}
                                                    >
                                                        <div className="needleContainerAlingment">
                                                            <div className="diamond"></div>
                                                            <div className="needlePointerMain"></div>
                                                            <OverlayTrigger placement="bottom" overlay={<Tooltip>{Math.floor(data?.totalactivity)} %</Tooltip>}>
                                                                <div className="needleScrewMain"></div>
                                                            </OverlayTrigger>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : <div className="timerAndTracking">
                            <div style={{ margin: "0 10px 0 0" }} className="timerLeft">
                                <div>
                                    <img width={120} src={logo} alt="" />
                                </div>
                                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
                                    <p className="weekDayTimer">{formattedDate == todayDate ? days[currentDay] : days[clickDay]} </p>
                                    <p className="weekDayTimer">{formattedDate && formattedDate.split('-')[2]}</p>
                                    <p className="weekDateTimer">{formattedDate == todayDate ? months[currentMonth] : months[month]}</p>
                                    <OverlayTrigger placement="top" overlay={<Tooltip>{Math.floor(totalActivityByDay?.totalactivity)} %</Tooltip>}>
                                        <div className="circular-progress" style={{
                                            cursor: "pointer"
                                        }}>
                                            <CircularProgressBar activityPercentage={totalActivityByDay?.totalactivity} size={30} />
                                        </div>
                                    </OverlayTrigger>
                                    <p className="timerClock">{data?.totalHours?.daily}</p>
                                    <p className="weekTimer">Week</p>
                                    <p className="weekTimerDigit">{data?.totalHours?.weekly}</p>
                                    <img src={circleDot} alt="CircleDot.png" />
                                    <p className="weekTimer">Month</p>
                                    <p className="monthTimerDigit">{data?.totalHours?.monthly}</p>
                                </div>
                            </div>
                            <div className="activity-image-container">
                                <div className="activityMainHeading">
                                    <h4 className="activityMainHeadingContent">Activity Tracker</h4>
                                    <p className="activityMainContent">Activity Level</p>
                                </div>
                                <div className="activityMeternContent">
                                    <div className="activityMeterContentMain">
                                        <div className="activityMeterContent">
                                            <img src={perc_20} alt="" />
                                            <p className="activityMeterContentPercent">0 - 20 %</p>
                                        </div>
                                        <div className="activityMeterContent">
                                            <img src={perc_40} alt="" />
                                            <p className="activityMeterContentPercent">21 - 40 %</p>
                                        </div>
                                        <div className="activityMeterContent">
                                            <img src={perc_60} alt="" />
                                            <p className="activityMeterContentPercent">41 - 60 %</p>
                                        </div>
                                        <div className="activityMeterContent">
                                            <img src={perc_80} alt="" />
                                            <p className="activityMeterContentPercent">61 - 80 %</p>
                                        </div>
                                        <div className="activityMeterContent" style={{ width: 200 }}>
                                            <img src={perc_100} alt="" />
                                            <p className="activityMeterContentPercent" >81 - 100 %</p>
                                        </div>
                                    </div>
                                    <div className="activityMeterMain">
                                        <div className="activityMeterMainContainer">
                                            <img className="activityMeterMainImage" src={activityImage} alt="" />
                                            <div className="needleContainerMain">
                                                <div
                                                    className="needleContainerMainAlingment"
                                                    style={{
                                                        transform: `translateY(-50%) rotate(${Math.floor(totalActivityByDay?.totalactivity) <= 20 ? -75 :
                                                            Math.floor(totalActivityByDay?.totalactivity) > 20 && Math.floor(totalActivityByDay?.totalactivity) <= 40 ? -38 :
                                                                Math.floor(totalActivityByDay?.totalactivity) > 40 && Math.floor(totalActivityByDay?.totalactivity) <= 60 ? 0 :
                                                                    Math.floor(totalActivityByDay?.totalactivity) > 60 && Math.floor(totalActivityByDay?.totalactivity) <= 80 ? 35 :
                                                                        Math.floor(totalActivityByDay?.totalactivity) > 80 ? 75 : -108
                                                            }deg)`
                                                    }}>
                                                    <div className="needleContainerAlingment">
                                                        <div className="diamond"></div>
                                                        <div className="needlePointerMain"></div>
                                                        <OverlayTrigger placement="bottom" overlay={<Tooltip>{Math.floor(totalActivityByDay?.totalactivity)} %</Tooltip>}>
                                                            <div className="needleScrewMain"></div>
                                                        </OverlayTrigger>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>}
                        <div className="time-scale" style={{ display: "flex", justifyContent: "space-between" }}>
                            {renderTimeIntervals()}
                        </div>
                        <div>
                            {items.userType === "user" ? (
                                <div>
                                    {data && (data?.groupedScreenshots?.map((element) => {
                                        return (
                                            <div>
                                                {loading ? <Skeleton count={1} width="300px" height="34.5px" style={{ margin: "40px 0 0 0" }} /> : <div
                                                    onClick={() => {
                                                        setShowTrimActivity(true)
                                                        setTrimActivity({
                                                            ...trimActivity,
                                                            timeentryId: element.timeentryId,
                                                            startTime: element.time.split(" ")[0] + " " + element.time.split(" ")[1],
                                                            endTime: element.time.split(" ")[3] + " " + element.time.split(" ")[4]
                                                        })
                                                        setSplitTime({
                                                            ...splitTime,
                                                            timeentryId: element.timeentryId,
                                                            startTime: element.time.split(" ")[0] + " " + element.time.split(" ")[1],
                                                            endTime: element.time.split(" ")[3] + " " + element.time.split(" ")[4]
                                                        })
                                                        setOfflineTime({
                                                            ...offlineTime,
                                                            timeentryId: element.timeentryId,
                                                            startTime: element.time.split(" ")[0] + " " + element.time.split(" ")[1],
                                                            endTime: element.time.split(" ")[3] + " " + element.time.split(" ")[4]
                                                        })
                                                        setStartTime(element.time.split(" ")[0] + " " + element.time.split(" ")[1])
                                                        setEndTime(element.time.split(" ")[3] + " " + element.time.split(" ")[4])
                                                    }}
                                                    style={{ cursor: "pointer" }}
                                                    className="timeZone" onMouseOver={() => setShowEditButton(true)} onMouseOut={() => setShowEditButton(false)}>
                                                    <p className="timeDuration">{element.time}</p>
                                                    <OverlayTrigger placement="top" overlay={<Tooltip>{Math.floor(element?.totalactivity)} %</Tooltip>}>
                                                        <div className="circular-progress" style={{ margin: "0 20px", cursor: "pointer" }}>
                                                            <CircularProgressBar activityPercentage={element?.totalactivity} size={30} />
                                                        </div>
                                                    </OverlayTrigger>
                                                    {showEditButton && <img onClick={() => {
                                                        console.log(element);
                                                        setShowTrimActivity(true)
                                                        setTrimActivity({
                                                            ...trimActivity,
                                                            timeentryId: element.timeentryId,
                                                            startTime: element.time.split(" ")[0] + " " + element.time.split(" ")[1],
                                                            endTime: element.time.split(" ")[3] + " " + element.time.split(" ")[4]
                                                        })
                                                        setSplitTime({
                                                            ...splitTime,
                                                            timeentryId: element.timeentryId,
                                                            startTime: element.time.split(" ")[0] + " " + element.time.split(" ")[1],
                                                            endTime: element.time.split(" ")[3] + " " + element.time.split(" ")[4]
                                                        })
                                                        setOfflineTime({
                                                            ...offlineTime,
                                                            timeentryId: element.timeentryId,
                                                            startTime: element.time.split(" ")[0] + " " + element.time.split(" ")[1],
                                                            endTime: element.time.split(" ")[3] + " " + element.time.split(" ")[4]
                                                        })
                                                        setStartTime(element.time.split(" ")[0] + " " + element.time.split(" ")[1])
                                                        setEndTime(element.time.split(" ")[3] + " " + element.time.split(" ")[4])
                                                    }} src={edit} alt="EditTimeZone.png" style={{ cursor: "pointer" }} />}
                                                </div>}
                                                <div style={{
                                                    display: "grid",
                                                    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                                                    gap: "20px",
                                                }}>
                                                    {element?.screenshots && (element?.screenshots?.map((elements, index) => {
                                                        console.log(elements);
                                                        return loading ? (
                                                            <Skeleton count={1} width="364px" height="248.44px" style={{ margin: "20px 0 12px 0" }} />
                                                        ) : (
                                                            <div className="projectAdd" onMouseOver={() => setShowDeleteButton(true)} onMouseOut={() => setShowDeleteButton(false)}>
                                                                <div className="timelineDiv">
                                                                    <div>
                                                                        <OverlayTrigger placement="top" overlay={<Tooltip>{elements?.description}</Tooltip>}>
                                                                            <p className="notes">
                                                                                <a className="websiteLink" href="#">{elements?.time} {elements?.description}</a>
                                                                            </p>
                                                                        </OverlayTrigger>
                                                                    </div>
                                                                    <div style={{ display: "flex" }}>
                                                                        <img width={25} src={brushIcon} alt=""
                                                                            onClick={() => {
                                                                                console.log(elements);
                                                                                if (elements?.screenshot?.blur === false) {
                                                                                    handleBlurSS(element.timeentryId, elements._id)
                                                                                }
                                                                            }}
                                                                        />
                                                                        <img src={deleteIcon} alt="" style={{ margin: "0 10px" }} onClick={() => handleOpenDeleteModal(element, elements)} />
                                                                        {elements?.visitedUrls?.length === 0 ?
                                                                            <OverlayTrigger placement="top" overlay={<Tooltip>0 %</Tooltip>}>
                                                                                <div className="circular-progress">
                                                                                    <CircularProgressBar activityPercentage={0} size={30} emptyUrl={0} />
                                                                                </div>
                                                                            </OverlayTrigger>
                                                                            :
                                                                            elements?.visitedUrls?.map((e) => {
                                                                                return e?.activityPercentage === 0 ? (
                                                                                    <OverlayTrigger placement="top" overlay={<Tooltip>0 %</Tooltip>}>
                                                                                        <div className="circular-progress">
                                                                                            <CircularProgressBar activityPercentage={0} size={30} emptyUrl={0} />
                                                                                        </div>
                                                                                    </OverlayTrigger>
                                                                                ) : (
                                                                                    <OverlayTrigger placement="top" overlay={<Tooltip>{Math.floor(e?.activityPercentage)} %</Tooltip>}>
                                                                                        <div className="circular-progress">
                                                                                            <CircularProgressBar activityPercentage={e?.activityPercentage} size={30} />
                                                                                        </div>
                                                                                    </OverlayTrigger>
                                                                                )
                                                                            })}
                                                                    </div>
                                                                </div>
                                                                <div className="screenShotImg">
                                                                    <img style={{ filter: elements?.blur === true ? "blur(5px)" : elements?.screenshot?.blur === true ? "blur(5px)" : "" }} className="screenshotiimage" onClick={() => openModal(element, elements?.key, index)} src={elements?.key} alt="ScreenShotImg.png" />
                                                                </div>
                                                            </div>
                                                        )
                                                    }))}
                                                    {selectedImage && (
                                                        <div className="fullscreen-screenshot-model">
                                                            <div style={{ margin: "20px 20px 0 20px", textAlign: "right" }}>
                                                                <ImCross size={20} color="white" onClick={closeModal} />
                                                            </div>
                                                            <div className="ss-image">
                                                                <div className="d-flex align-items-center gap-5">
                                                                    <div
                                                                        onClick={() => {
                                                                            goBackToPreviousImage(element.screenshots)
                                                                        }}>
                                                                        <img width={40} src={leftArrow} />
                                                                    </div>
                                                                    <div>
                                                                        <img style={{ filter: ssData?.screenshots.find((f, indd) => indd === selectedImageIndex)?.blur === true ? "blur(5px)" : ssData?.screenshots.find((f, indd) => indd === selectedImageIndex)?.screenshot?.blur === true ? "blur(5px)" : "" }} className="modalImage" src={selectedImage} alt="Pop-up Image" />
                                                                    </div>
                                                                    <div
                                                                        onClick={() => {
                                                                            goToNextImage(element.screenshots)
                                                                        }}>
                                                                        <img width={40} src={rightArrow} />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    }))}
                                </div>
                            ) : timeEntries?.map((element) => {
                                const findTimeEntryActivity = totalActivityByDay?.groupedScreenshots?.find(f => f.timeentryId === element.timeentryId)
                                return (
                                    <div>
                                        <div
                                            onClick={() => {
                                                setShowTrimActivity(true)
                                                setTrimActivity({
                                                    ...trimActivity,
                                                    timeentryId: element.timeentryId,
                                                    startTime: element.time.split(" ")[0] + " " + element.time.split(" ")[1],
                                                    endTime: element.time.split(" ")[3] + " " + element.time.split(" ")[4]
                                                })
                                                setSplitTime({
                                                    ...splitTime,
                                                    timeentryId: element.timeentryId,
                                                    startTime: element.time.split(" ")[0] + " " + element.time.split(" ")[1],
                                                    endTime: element.time.split(" ")[3] + " " + element.time.split(" ")[4]
                                                })
                                                setOfflineTime({
                                                    ...offlineTime,
                                                    timeentryId: element.timeentryId,
                                                    startTime: element.time.split(" ")[0] + " " + element.time.split(" ")[1],
                                                    endTime: element.time.split(" ")[3] + " " + element.time.split(" ")[4]
                                                })
                                                setStartTime(element.time.split(" ")[0] + " " + element.time.split(" ")[1])
                                                setEndTime(element.time.split(" ")[3] + " " + element.time.split(" ")[4])
                                            }}
                                            style={{ cursor: "pointer" }}
                                            className="timeZone" onMouseOver={() => setShowEditButton(true)} onMouseOut={() => setShowEditButton(false)}>
                                            <p className="timeDuration">{element.time}</p>
                                            <OverlayTrigger placement="top" overlay={<Tooltip>{Math.floor(findTimeEntryActivity?.totalactivity)} %</Tooltip>}>
                                                <div className="circular-progress" style={{ margin: "0 20px", cursor: "pointer" }}>
                                                    <CircularProgressBar activityPercentage={findTimeEntryActivity?.totalactivity} size={30} />
                                                </div>
                                            </OverlayTrigger>
                                            <p className="timeDuration">{element?.description}</p>
                                            {showEditButton && <img onClick={() => {
                                                console.log(element);
                                                setShowTrimActivity(true)
                                                setTrimActivity({
                                                    ...trimActivity,
                                                    timeentryId: element.timeentryId,
                                                    startTime: element.time.split(" ")[0] + " " + element.time.split(" ")[1],
                                                    endTime: element.time.split(" ")[3] + " " + element.time.split(" ")[4]
                                                })
                                                setSplitTime({
                                                    ...splitTime,
                                                    timeentryId: element.timeentryId,
                                                    startTime: element.time.split(" ")[0] + " " + element.time.split(" ")[1],
                                                    endTime: element.time.split(" ")[3] + " " + element.time.split(" ")[4]
                                                })
                                                setOfflineTime({
                                                    ...offlineTime,
                                                    timeentryId: element.timeentryId,
                                                    startTime: element.time.split(" ")[0] + " " + element.time.split(" ")[1],
                                                    endTime: element.time.split(" ")[3] + " " + element.time.split(" ")[4]
                                                })
                                                setStartTime(element.time.split(" ")[0] + " " + element.time.split(" ")[1])
                                                setEndTime(element.time.split(" ")[3] + " " + element.time.split(" ")[4])
                                            }} src={edit} alt="EditTimeZone.png" style={{ cursor: "pointer" }} />}
                                        </div>
                                        <div style={{
                                            display: "grid",
                                            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                                            gap: "20px",
                                        }}>
                                            {element?.screenshots && (element?.screenshots?.map((elements, index) => {
                                                return loading ? (
                                                    <Skeleton count={1} width="364px" height="248.44px" style={{ margin: "20px 0 12px 0" }} />
                                                ) : (
                                                    <div className="projectAdd" onMouseOver={() => setShowDeleteButton(true)} onMouseOut={() => setShowDeleteButton(false)}>
                                                        <div className="timelineDiv">
                                                            <div>
                                                                <OverlayTrigger placement="top" overlay={<Tooltip>{elements?.description}</Tooltip>}>
                                                                    <p className="notes">
                                                                        <a className="websiteLink" href="#">{elements?.time} {elements?.description}</a>
                                                                    </p>
                                                                </OverlayTrigger>
                                                            </div>
                                                            <div style={{ display: "flex" }}>
                                                                <img width={25} src={brushIcon} alt=""
                                                                    onClick={() => {
                                                                        if (elements?.screenshot?.blur === false) {
                                                                            console.log(elements);
                                                                            handleBlurSS(element.timeentryId, elements._id)
                                                                        }
                                                                    }}
                                                                />
                                                                <img src={deleteIcon} alt="" style={{ margin: "0 10px" }} onClick={() => handleOpenDeleteModal(element, elements)} />
                                                                {elements?.visitedUrls?.length === 0 ?
                                                                    <OverlayTrigger placement="top" overlay={<Tooltip>0 %</Tooltip>}>
                                                                        <div className="circular-progress">
                                                                            <CircularProgressBar activityPercentage={0} size={30} emptyUrl={0} />
                                                                        </div>
                                                                    </OverlayTrigger>
                                                                    :
                                                                    elements?.visitedUrls?.map((e) => {
                                                                        return e?.activityPercentage === 0 ? (
                                                                            <OverlayTrigger placement="top" overlay={<Tooltip>0 %</Tooltip>}>
                                                                                <div className="circular-progress">
                                                                                    <CircularProgressBar activityPercentage={0} size={30} emptyUrl={0} />
                                                                                </div>
                                                                            </OverlayTrigger>
                                                                        ) : (
                                                                            <OverlayTrigger placement="top" overlay={<Tooltip>{Math.floor(e?.activityPercentage)} %</Tooltip>}>
                                                                                <div className="circular-progress">
                                                                                    <CircularProgressBar activityPercentage={e?.activityPercentage} size={30} />
                                                                                </div>
                                                                            </OverlayTrigger>
                                                                        )
                                                                    })}
                                                            </div>
                                                        </div>
                                                        <div className="screenShotImg">
                                                            <img style={{ filter: elements?.blur === true ? "blur(5px)" : elements?.screenshot?.blur === true ? "blur(5px)" : "" }} className="screenshotiimage" onClick={() => openModal(element, elements?.key, index)} src={elements?.key} alt="ScreenShotImg.png" />
                                                        </div>
                                                    </div>
                                                )
                                            }))}
                                            {selectedImage && (
                                                <div className="fullscreen-screenshot-model">
                                                    <div style={{ margin: "20px 20px 0 20px", textAlign: "right" }}>
                                                        <ImCross size={20} color="white" onClick={closeModal} />
                                                    </div>
                                                    <div className="ss-image">
                                                        <div className="d-flex align-items-center gap-5">
                                                            <div
                                                                onClick={() => {
                                                                    goBackToPreviousImage(element.screenshots)
                                                                }}>
                                                                <img width={40} src={leftArrow} />
                                                            </div>
                                                            <div>
                                                                <img style={{ filter: ssData?.screenshots.find((f, indd) => indd === selectedImageIndex)?.blur === true ? "blur(5px)" : ssData?.screenshots.find((f, indd) => indd === selectedImageIndex)?.screenshot?.blur === true ? "blur(5px)" : "" }} className="modalImage" src={selectedImage} alt="Pop-up Image" />
                                                            </div>
                                                            <div
                                                                onClick={() => {
                                                                    goToNextImage(element.screenshots)
                                                                }}>
                                                                <img width={40} src={rightArrow} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
                <img className="userDetailLine" src={line} />
            </div>
        </div>
    )
}

export default UserDetails;