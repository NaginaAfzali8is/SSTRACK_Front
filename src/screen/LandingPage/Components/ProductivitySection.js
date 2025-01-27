import React from "react";
import productivityImage from "../../../images/break.svg"; // Replace with your image path
import { useNavigate } from "react-router-dom";

function ProductivitySection({ language }) {
    const navigate = useNavigate();
    return (
        <div
            style={{
                display: "flex",
                flexDirection: language === "ar" ? "row-reverse" : "row",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "3rem",
                backgroundColor: "#F9FAFB",
            }}
        >
            {/* Left Column */}
            <div style={{ flex: "1", paddingRight: "2rem",  }}>
                {/* Subtitle */}
                <p
                    style={{
                        fontSize: "13.9px",
                        fontWeight: "400",
                        color: "#3B3C4E",
                        marginBottom: "10px",
                    }}
                >
                    {language === "en"
                        ? "Productivity Focused"
                        : "يركز على الإنتاجية"}
                </p>

                {/* Title */}
                <h1
                    style={{
                        fontSize: "42.19px",
                        fontWeight: "700",
                        color: "#3B3C4E",
                        lineHeight: "1.2",
                        marginBottom: "20px",
                    }}
                >
                    {language === "en"
                        ? "Achieve more Productivity"
                        : "حقق المزيد من الإنتاجية"}{" "}
                    <br /> {language === "en" ? "with" : "مع"}{" "}
                    <span
                        style={{
                            color: "#7ACB59",
                            fontSize: "44px",
                            fontWeight: "700",
                        }}
                    >
                        SS Track.io
                    </span>
                </h1>

                {/* Description */}
                <p
                    style={{
                        fontSize: "12.9px",
                        fontWeight: "400",
                        color: "#555555",
                        marginBottom: "30px",
                    }}
                >
                    {language === "en"
                        ? "Start your journey toward optimized productivity today!"
                        : "ابدأ رحلتك نحو تحسين الإنتاجية اليوم!"}
                </p>

                {/* Features List */}
                <ul
                    style={{
                        listStyleType: "disc",
                        paddingLeft: "20px",
                        marginBottom: "30px",
                        width: '80%',
                        color: "#555555",
                    }}
                >
                    <li
                        style={{
                            marginBottom: "25px",
                            fontSize: "16px",
                            fontWeight: "400",

                        }}
                    >
                        <strong
                            style={{
                                fontSize: "16px",
                                fontWeight: "700",
                                color: "black",
                            }}
                        >
                            {language === "en"
                                ? "Timesheet Reports:"
                                : "تقارير الجداول الزمنية:"}
                        </strong>{" "}
                        {language === "en"
                            ? "Easily track and analyze employee work hours for streamlined payroll and project cost management."
                            : "تتبع وحلل ساعات عمل الموظفين بسهولة لإدارة الرواتب وتكاليف المشاريع بسلاسة."}
                    </li>
                    <li
                        style={{
                            marginBottom: "25px",
                            fontSize: "16px",
                            fontWeight: "400",
                        }}
                    >
                        <strong
                            style={{
                                fontSize: "16px",
                                fontWeight: "700",
                                color: "black",
                            }}
                        >
                            {language === "en"
                                ? "Real-Time Reports:"
                                : "تقارير الوقت الفعلي:"}
                        </strong>{" "}
                        {language === "en"
                            ? "Access live data and updates on ongoing tasks to ensure your team stays aligned and focused."
                            : "الوصول إلى البيانات الحية والتحديثات حول المهام الجارية لضمان بقاء فريقك متوافقًا ومركّزًا."}
                    </li>
                    <li
                        style={{
                            fontSize: "16px",
                            fontWeight: "400",
                        }}
                    >
                        <strong
                            style={{
                                fontSize: "16px",
                                fontWeight: "700",
                                color: "black",
                            }}
                        >
                            {language === "en"
                                ? "Productivity Reports:"
                                : "تقارير الإنتاجية:"}
                        </strong>{" "}
                        {language === "en"
                            ? "Understand key productivity trends and identify areas for improvement with advanced reporting tools."
                            : "فهم اتجاهات الإنتاجية الرئيسية وتحديد مجالات التحسين باستخدام أدوات تقارير متقدمة."}

                    </li>
                </ul>

                {/* CTA Button */}
                <button
                    style={{
                        backgroundColor: "#7ACB59",
                        color: "#FFFFFF",
                        fontSize: "16px",
                        fontWeight: "500",
                        padding: "10px 20px",
                        borderRadius: "8px",
                        border: "none",
                        cursor: "pointer",
                    }}
                    onClick={() => navigate("/signup")}
                >
                    {language === "en" ? "Get Started →" : "ابدأ الآن →"}
                </button>
            </div>

            {/* Right Column */}
            <div style={{ flex: "1", textAlign: "center" }}>
                <img
                    src={productivityImage}
                    alt="Productivity Illustration"
                    style={{
                        width: "100%",
                        marginLeft: language === "en"?'-20%':'-05%',
                        borderRadius: "10px",
                    }}
                />
            </div>
        </div>
    );
}

export default ProductivitySection;
