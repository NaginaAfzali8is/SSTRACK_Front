import React, { useEffect, useState } from "react";
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
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import logo from '../../src/public/tracking.png';
import paidStamp from '../images/paid.png';
import { Link } from 'react-router-dom'


function Account() {

    const [show, setShow] = useState(false);
    const [deleteAccount, setDeleteAccount] = useState(false);
    const [updatePassword, setUpdatePassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPassword2, setNewPassword2] = useState("");
    const [verify, setVerify] = useState(false);
    const [invoices, setInvoices] = useState([]);
    const [showWarning, setShowWarning] = useState(false);
    let token = localStorage.getItem('token');
    const navigate = useNavigate('');
    const apiUrl = "https://myuniversallanguages.com:9093/api/v1";
    const items = JSON.parse(localStorage.getItem('items'));
    let headers = {
        Authorization: 'Bearer ' + token,
    }
    console.log('usercompany==============', items);
    const storedPlanId = JSON.parse(localStorage.getItem('planId'));

    const fetchInvoices = async () => {
        try {
            const res = await fetch(`${apiUrl}/owner/getInvoice`, {
                headers,
            });
            const data = await res.json();
            console.log('============================', data);

            // Transform the API data to the desired structure
            const transformedInvoices = data.data.map((invoice) => {
                // Log the status of each invoice
                console.log('Invoice status:', invoice.status);

                return {
                    id: invoice.invoiceNumber,
                    date: new Date(invoice.invoiceDate).toLocaleDateString(),
                    description: `For ${new Date(invoice.employee[0].periodStart).toLocaleDateString()}–${new Date(
                        invoice.employee[0].periodEnd
                    ).toLocaleDateString()}`,
                    amount: parseFloat(invoice.subTotal).toFixed(2),
                    balance: parseFloat(invoice.balance).toFixed(2),
                    status: (invoice.status),
                    details: invoice.employee.map(emp => ({
                        name: emp.name,
                        periodStart: new Date(emp.periodStart).toLocaleDateString(),
                        periodEnd: new Date(emp.periodEnd).toLocaleDateString(),
                        amount: emp.amount,
                    })),
                };
            });

            setInvoices(transformedInvoices);
            // Check if there is any unpaid invoice
            const hasUnpaidInvoice = transformedInvoices.some(invoice => invoice.status === 'unpaid');
            setShowWarning(hasUnpaidInvoice);
        } catch (error) {
            console.error('Error fetching invoices:!!!!!!!!!!!!!!!!', error);
        }
    };


    useEffect(() => {
        fetchInvoices();
    }, []);


    const getBase64Image = (imgUrl, callback) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const dataURL = canvas.toDataURL('image/png');
            callback(dataURL, img.width, img.height);
        };
        img.src = imgUrl;
    };

    const costPerUser = storedPlanId?.costPerUser || 0;  // Use storedPlanId's costPerUser or 0 as a fallback

    // Create the plandetail string
    const plandetail = `${costPerUser}/employee/mo`;

    //pdf generation
    const generatePDF = (invoice) => {
        getBase64Image(logo, (logoBase64, logoWidth, logoHeight) => {
            getBase64Image(paidStamp, (paidStampBase64, paidStampWidth, paidStampHeight) => {
                const doc = new jsPDF('p', 'pt', 'a4');
                const width = doc.internal.pageSize.getWidth();
                const pageHeight = doc.internal.pageSize.getHeight();
                const margin = 40;


                // Helper function to add a new page
                const addNewPage = () => {
                    doc.addPage();
                    y = margin; // Reset Y position for new page
                };

                // Define helper function to check if content exceeds the page height
                const checkContentOverflow = (currentY) => {
                    if (currentY > pageHeight - margin) {
                        console.log('Content exceeding page height. Adding new page...');
                        addNewPage();
                        return true;
                    }
                    return false;
                };
                // Define the maximum width and height for the logo image
                const maxLogoWidth = 100;
                const maxLogoHeight = 50;

                // Calculate the new width and height while maintaining the aspect ratio
                if (logoWidth > maxLogoWidth || logoHeight > maxLogoHeight) {
                    const aspectRatio = logoWidth / logoHeight;
                    if (logoWidth > maxLogoWidth) {
                        logoWidth = maxLogoWidth;
                        logoHeight = maxLogoWidth / aspectRatio;
                    }
                    if (logoHeight > maxLogoHeight) {
                        logoHeight = maxLogoHeight;
                        logoWidth = maxLogoHeight * aspectRatio;
                    }
                }

                // Define the header height and draw the header with line
                const headerHeight = 60;
                const headerY = 20;
                const logoX = 40;
                const companyDetailsX = logoX + logoWidth + 20; // Position company details to the right of the logo
                const rightMargin = 40; // Margin from the right

                // Add the header line (adjusted to move up)
                doc.setLineWidth(5);
                doc.setDrawColor(211, 211, 211);
                const headerLineY = headerY + headerHeight; // Adjust this value to move the line up
                doc.line(40, headerLineY, width - 40, headerLineY);

                // Add the logo
                doc.addImage(logoBase64, 'PNG', logoX, headerY, logoWidth, logoHeight);

                // Add company details to the right of the logo
                doc.setFontSize(12);
                doc.setFont('helvetica', 'bold');
                doc.text('I8IS', companyDetailsX, headerY + 5); // Align with top of logo
                doc.setFontSize(10);
                doc.setFont('helvetica', 'normal');
                doc.text('SSTRACK', companyDetailsX, headerY + 20); // Align with top of logo
                doc.text('4370 Steeles Avenue West', companyDetailsX, headerY + 35); // New address line 1
                doc.text('Unit 204 Vaughan ON L4L 4Y4', companyDetailsX, headerY + 50); // New address line 2


                // Move up and add margin from the right for invoice details
                const invoiceDetailsY = headerY + 90; // Move up as needed
                const invoiceDetailsX = width - rightMargin - 200; // Adjust for right margin

                // Hardcoded plan variable for testing
                let plan = 'professional'; // Options: 'professional', 'standard', 'free'
                // Determine the plan details based on the hardcoded plan
                // let plandetail = ''
                // let planText = ''; // Initialize plan text
                // if (plan === 'professional') {
                //     planText = 'Professional Plan:';
                //     plandetail = '$6.99/employee/mo';
                // } else if (plan === 'standard') {
                //     planText = 'Standard Plan:';
                //     plandetail = '$3.99/employee/mo';
                // }


                doc.setFontSize(9);
                doc.setFont('helvetica', 'bold');
                doc.text('Invoice no.:', invoiceDetailsX, invoiceDetailsY);
                doc.text('Invoice date:', invoiceDetailsX, invoiceDetailsY + 15);
                doc.text('Balance:', invoiceDetailsX, invoiceDetailsY + 30);
                doc.text('Billing period:', invoiceDetailsX, invoiceDetailsY + 45);
                doc.text(storedPlanId?.planType, invoiceDetailsX, invoiceDetailsY + 60);

                doc.setFont('helvetica', 'normal');
                doc.text(invoice.id, width - rightMargin - 100, invoiceDetailsY);
                doc.text(invoice.date, width - rightMargin - 100, invoiceDetailsY + 15);
                doc.text('$' + invoice.balance, width - rightMargin - 100, invoiceDetailsY + 30);
                doc.text(invoice.description.split(' ')[1], width - rightMargin - 100, invoiceDetailsY + 45);
                doc.text(plandetail, width - rightMargin - 100, invoiceDetailsY + 60);













                // Add customer details on the left side
                const customerDetailsY = invoiceDetailsY; // Use the same top margin as invoice details
                const customerDetailsX = 40; // Left margin

                doc.setFontSize(12);
                doc.setFont('helvetica', 'bold');
                doc.text('Customer:', customerDetailsX, customerDetailsY);
                doc.setFontSize(10);
                doc.setFont('helvetica', 'normal');
                doc.text(items.company, customerDetailsX, customerDetailsY + 15);
                doc.text(items.name, customerDetailsX, customerDetailsY + 30);
                doc.text(items.email, customerDetailsX, customerDetailsY + 45);
                doc.text('Canada', customerDetailsX, customerDetailsY + 60);

                // Add PAID stamp if paid
                if (invoice.status === 'paid') {
                    // Define the maximum width and height for the PAID stamp image
                    const maxPaidStampWidth = 250;  // Maximum width
                    const maxPaidStampHeight = 125;  // Maximum height

                    // Calculate the aspect ratio for the PAID stamp
                    const paidStampAspectRatio = paidStampWidth / paidStampHeight;

                    // Adjust the width and height while maintaining the aspect ratio
                    if (paidStampWidth > maxPaidStampWidth || paidStampHeight > maxPaidStampHeight) {
                        if (paidStampWidth > maxPaidStampWidth) {
                            paidStampWidth = maxPaidStampWidth;
                            paidStampHeight = maxPaidStampWidth / paidStampAspectRatio;
                        }
                        if (paidStampHeight > maxPaidStampHeight) {
                            paidStampHeight = maxPaidStampHeight;
                            paidStampWidth = maxPaidStampHeight * paidStampAspectRatio;
                        }
                    }

                    const paidStampX = width / 2.5 - paidStampWidth / 2.5; // Center the PAID stamp
                    const paidStampY = 140 - paidStampHeight / 2;      // Adjust Y position
                    doc.addImage(paidStampBase64, 'PNG', paidStampX, paidStampY, paidStampWidth, paidStampHeight);
                }

                // Add Invoice Details
                doc.setFontSize(12);
                doc.setFont('helvetica', 'bold');
                doc.text('Invoice #' + invoice.id, 40, 210);

                doc.setFontSize(10);
                doc.setFont('helvetica', 'normal');

                doc.setFont('helvetica', 'bold');
                doc.text('Item', 40, 230);
                doc.text('Service', 120, 230);
                doc.text('Amount', width - 100, 230);

                let y = 237; // Starting Y position for the table

                invoice.details.forEach((item, index) => {
                    y += 5; // Move down to the next row

                    // Check if content exceeds page
                    if (checkContentOverflow(y)) return;

                    // Draw the top border
                    doc.setLineWidth(0.5);

                    y += 7; // Move down to draw the text
                    doc.setFont('helvetica', 'normal');
                    doc.text(String(index + 1), 40, y);
                    doc.setFont('helvetica', 'normal');
                    doc.text(item.name, 120, y);
                    doc.setFont('helvetica', 'normal');
                    doc.setTextColor(128, 128, 128);
                    doc.text(' ' + item.periodStart + ' - ' + item.periodEnd, 120 + doc.getTextWidth(item.name) + 5, y); // Adjust position based on bold text width
                    // Reset text color back to black after the gray text
                    doc.setTextColor(0, 0, 0);
                    const amount = Number(item.amount); // Ensure item.amount is a number
                    doc.text('$' + amount.toFixed(2), width - 100, y);

                    y += 7; // Move down to draw the bottom border

                    // Check if content exceeds page before drawing bottom border
                    if (checkContentOverflow(y)) return;
                    doc.line(40, y, width - 40, y); // Draw the bottom border
                });

                // Add total amount row
                const subTotal = Number(invoice.balance);
                const salesTax = 0;
                const totalAmount = subTotal + salesTax;

                // Add SubTotal
                y += 20;
                if (!checkContentOverflow(y)) {
                    doc.setFont('helvetica', 'bold');
                    doc.text('SubTotal', 120, y);
                    doc.setFont('helvetica', 'normal');
                    doc.text('$' + ' ' + subTotal.toFixed(2), width - 100, y);
                }

                // Add Sales Tax (VAT)
                y += 20;
                if (!checkContentOverflow(y)) {
                    doc.setFont('helvetica', 'bold');
                    doc.text('Sales Tax (VAT)', 120, y);
                    doc.setFont('helvetica', 'normal');
                    doc.text('$' + ' ' + salesTax.toFixed(2), width - 100, y);
                }

                // Add total amount row with upper and lower border
                y += 20;
                if (!checkContentOverflow(y)) {
                    doc.setFont('helvetica', 'bold');
                    doc.text('Total Amount', 120, y);
                    doc.setFont('helvetica', 'normal');
                    doc.text('$' + ' ' + totalAmount.toFixed(2), width - 100, y);

                    // Draw upper border
                    doc.setLineWidth(0.5);
                    doc.setDrawColor(0, 0, 0);
                    doc.line(40, y - 11, width - 40, y - 11); // Upper border

                    // Draw lower border
                    doc.line(40, y + 5, width - 40, y + 5); // Lower border
                }
                // Download the PDF
                doc.save(`Invoice_${invoice.id}.pdf`);
            });
        });
    };


    const [plans, setPlans] = useState('')





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




    const BillingComponent = () => {
        // Retrieve and parse the stored data
        // const storedPlanId = JSON.parse(localStorage.getItem('planId'));
        const billing = JSON.parse(localStorage.getItem('billdetail'));
        const Cardetail = JSON.parse(localStorage.getItem('carddetail'));
        console.log('Stored Plan ID::::::::::::::::::::::', Cardetail);
        return (
            <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.6' }}>
                {!(items?.userType === 'user' || items?.userType === 'manager') && (
                    <div style={{ marginBottom: '20px' }}>
                        <h2 style={{ color: '#0E4772', fontSize: '20px', fontWeight: '600', marginTop: '50px' }}>  {storedPlanId?.planType?.[0].toUpperCase() + storedPlanId?.planType?.slice(1)}
                        &nbsp; Plan</h2>
                        <p style={{ margin: '5px 0' }}>
                            Price: <strong>${storedPlanId?.costPerUser}/employee/mo</strong>
                        </p>
                        <Link to="/payment" style={{ color: '#007bff', textDecoration: 'none' }}>Change plan</Link>
                        <div>
                            <Link to='/team' style={{ color: '#007bff', textDecoration: 'none', marginTop: '10px', display: 'inline-block' }}>
                                <span role="img" aria-label="employee icon">👥</span> Add or remove employees
                            </Link>
                        </div>
                    </div>
                )}

                {!(items?.userType === 'user' || items?.userType === 'manager') && (
                    <div style={{ paddingTop: '10px' }}>
                        <h2 style={{ color: '#0E4772', fontSize: '20px', fontWeight: '600', marginTop: '50px' }}>Billing</h2>
                        <p style={{ margin: '5px 0' }}>
                            {/* Your balance: <span style={{ color: 'green', fontWeight: 'bold' }}>${billing.toFixed(2)}</span> */}
                            {/* Your balance: <span style={{ color: 'green', fontWeight: 'bold' }}>${billing}</span> */}
                            {/* Your balance: <span style={{ color: 'green', fontWeight: 'bold' }}>${parseFloat(billing).toFixed(2)}</span> */}
                            {/* Your balance: <span style={{ color: 'green', fontWeight: 'bold' }}>${formatNumber(billing, 2)}</span> */}
                            {/* Your balance: <span style={{ color: 'green', fontWeight: 'bold' }}>${billing.slice(0, -8)}</span> */}
                            {/* Your balance: <span style={{ color: 'green', fontWeight: 'bold' }}>${billing.toString().slice(0, -8)}</span> */}
                            {/* Your balance: <span style={{ color: 'green', fontWeight: 'bold' }}>${(Math.round(billing * 100) / 100).toString()}</span> */}
                            Your balance: <span style={{ color: 'green', fontWeight: 'bold' }}>${Math.floor(billing * 100) / 100}</span>
                        </p>
                        {/* <p style={{ margin: '5px 0' }}>
                        Next payment due: 09/24/2024 (for 08/25/2024 – 09/24/2024)
                    </p> */}
                        <p style={{ margin: '5px 0' }}>
                            Billing method: <span style={{ marginRight: '5px' }}>💳•••• {Cardetail}</span>
                            {/* <a href="#edit-billing" style={{ color: '#007bff', textDecoration: 'none' }}>Edit</a> */}
                        </p>
                    </div>
                )}
            </div>
        );
    };




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
                        {showWarning && (
                            <div style={{
                                padding: '10px',
                                backgroundColor: '#ffdddd',
                                border: '1px solid #ffcccc',
                                color: '#d8000c',
                                marginBottom: '20px',
                                borderRadius: '5px',
                                textAlign: "center",
                            }}>
                                <strong>Warning:</strong> You have unpaid invoices and payment is past due.
                            </div>
                        )}
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
                        <BillingComponent />
                        <p className="companyPlan">Company plan</p>
                        <p className="userEmail">If you track your time for other companies - you do not need a plan and do not have to pay - your company pays for you.</p>
                        {!(items?.userType === 'user' || items?.userType === 'manager') && (
                            <div style={{ width: '80%', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
                                <div style={{ display: 'flex', borderBottom: '2px solid #ddd', marginBottom: '10px' }}>
                                    <span style={{ padding: '10px 20px', fontWeight: 'bold', borderBottom: '3px solid #28659C', color: 'black' }}>
                                        Invoices
                                    </span>
                                    {/* <span style={{ padding: '10px 20px', cursor: 'pointer', color: 'grey' }}>Payments</span> */}
                                </div>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr>
                                            <th style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd', padding: '10px', textAlign: 'left' }}>
                                                Invoice #
                                            </th>
                                            <th style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd', padding: '10px', textAlign: 'left' }}>
                                                Date
                                            </th>
                                            <th style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd', padding: '10px', textAlign: 'left' }}>
                                                Description
                                            </th>
                                            <th style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd', padding: '10px', textAlign: 'left' }}>
                                                Amount
                                            </th>
                                            {/* <th style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd', padding: '10px', textAlign: 'left' }}>
                                            Balance
                                        </th> */}
                                            <th style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd', padding: '10px', textAlign: 'left' }}></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {invoices.map((invoice) => (
                                            <tr key={invoice.id}>
                                                <td style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                                                    {invoice.status === 'unpaid' ? (
                                                        <span style={{ color: 'orange', marginRight: '5px' }}>&#9888;</span>
                                                    ) : (
                                                        <span style={{ color: 'green', marginRight: '5px' }}>&#10003;</span>
                                                    )}
                                                    {invoice.id} <br />
                                                    {/* {console.log('chllllllllllllllllllllll', invoice.status)} */}
                                                    {invoice.status === 'unpaid' && (
                                                        <a
                                                            href=""
                                                            style={{
                                                                color: '#28659C',
                                                                textDecoration: 'none',
                                                                fontWeight: 'bold',
                                                                cursor: 'pointer',
                                                            }}
                                                            onMouseEnter={(e) => (e.target.style.textDecoration = 'underline')}
                                                            onMouseLeave={(e) => (e.target.style.textDecoration = 'none')}
                                                        >
                                                            Pay
                                                        </a>
                                                    )}
                                                </td>
                                                <td style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>{invoice.date}</td>
                                                <td style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>{invoice.description}</td>
                                                <td style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>${invoice.amount}</td>
                                                {/* <td style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>${invoice.balance}</td> */}
                                                <td style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                                                    <a
                                                        href="#"
                                                        style={{
                                                            color: '#28659C',
                                                            textDecoration: 'none',
                                                            fontWeight: 'bold',
                                                            cursor: 'pointer',
                                                        }}
                                                        onMouseEnter={(e) => (e.target.style.textDecoration = 'underline')}
                                                        onMouseLeave={(e) => (e.target.style.textDecoration = 'none')}
                                                        onClick={() => generatePDF(invoice)} // Generate PDF on click
                                                    >
                                                        PDF
                                                    </a>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {/* <a
                                href="#"
                                style={{
                                    display: 'inline-block',
                                    marginTop: '10px',
                                    fontWeight: 'bold',
                                    textDecoration: 'none',
                                    color: '#28659C',
                                    cursor: 'pointer',
                                }}
                                onMouseEnter={(e) => (e.target.style.textDecoration = 'underline')}
                                onMouseLeave={(e) => (e.target.style.textDecoration = 'none')}
                            >
                                Download
                            </a> */}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <img className="accountLine" src={line} />
        </div>
    )

}

export default Account;