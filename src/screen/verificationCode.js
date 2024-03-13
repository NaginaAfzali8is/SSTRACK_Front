import React, { useEffect, useRef, useState } from "react";
import Header from "./component/header";
import email from '../images/email.webp';
import Footer from "./component/footer";
import line from '../images/line.webp'
import optVerifcation from '../images/opt-verifcation.svg'
import axios from "axios";
import { FerrisWheelSpinner } from "react-spinner-overlay";
import Timer from "./component/timer";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

function VerificationCode() {

    const navigate = useNavigate()
    const apiUrl = "http://54.158.251.164:9093/api/v1";
    const [code, setCode] = useState("")
    const [inputIndex, setIndex] = useState(0)
    const [loading, setLoading] = useState(false)
    const [digits, setDigits] = useState([])
    const [inputs, setInputs] = useState([
        useRef(),
        useRef(),
        useRef(),
        useRef(),
        useRef(),
        useRef(),
    ])

    async function handleSendLink() {
        console.log({ code: digits.join("") });
        setLoading(true)
        try {
            const response = await axios.post(`${apiUrl}/superAdmin/verifycode`, {
                email: "mabdullah@i8is.com",
                verification: digits.join("")
            })
            if (response.status) {
                console.log("OTP code", response);
                setLoading(false)
                enqueueSnackbar(response.data.message, {
                    variant: "success",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right"
                    }
                })
                setTimeout(() => {
                    navigate(`/update-password/${digits.join("")}`)
                }, 2000);
            }
        }
        catch (error) {
            console.log("catch error", error);
            enqueueSnackbar(error.response.data.message, {
                variant: "error",
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "right"
                }
            })
            setLoading(false)
        }
    }

    const handleChange = (e, i) => {
        setCode(e);
        setDigits(() => {
            return [...digits, e]
        })
        console.log("runnning...");
    }

    useEffect(() => {
        if (digits && digits.length > 0) {
            if (digits.join("").length < inputs.length) {
                inputs[inputIndex + 1]?.current?.focus();
                setIndex(inputIndex + 1);
            }
            else if (digits.join("").length === 6 && digits.join("").length === inputs.length) {
                handleSendLink()
            }
        }
    }, [digits])

    return (
        <>
            <SnackbarProvider />
            <div className="maininputdivs">
                <div className="mainInputDiv" style={{
                    textAlign: "center"
                }}>
                    <Timer />
                    <img style={{
                        width: "100%",
                        height: "300px",
                        marginBottom: 30
                    }} src={optVerifcation} alt="" />
                    <p className="verification-code">Verification Code</p>
                    <p className="verification-code-sent">We have sent a verification code to your email address</p>
                    <div id="inputs" class="inputs">
                        {inputs.map((inputRef, index) => (
                            <input
                                ref={inputRef}
                                onChange={(e) => {
                                    handleChange(e.target.value, index)
                                }}
                                className="input"
                                type="text"
                                maxLength="1"
                                key={index}
                            />
                        ))}
                    </div>
                    <button style={{ marginTop: 30 }} disabled={loading} className={loading ? "disabledAccountButton" : "accountButton"}>
                        {loading ? <FerrisWheelSpinner loading={loading} size={28} color="#6DBB48" /> : "Verify"}
                    </button>
                </div>
            </div>
        </>
    )
}

export default VerificationCode;