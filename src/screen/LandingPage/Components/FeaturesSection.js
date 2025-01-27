import React from "react";
import tabletMockup from "../../../images/tablet.png"; // Replace with your image path

function FeaturesSection({ language }) {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: '90%',
                backgroundColor: "#FFFFFF",
                width: '100%',
                direction: language === 'ar' ? 'rtl' : 'ltr',
                textAlign: language === 'ar' ? 'right' : 'left'
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "3rem",
                }}
            >
                {/* Left Column */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        flex: "1",
                        position: "relative",
                    }}
                >
                    {/* Vertical Line */}
                    <div
                        style={{
                            position: "absolute",
                            left: language === 'ar' ? "auto" : "14%",
                            right: language === 'ar' ? "14%" : "auto",
                            top: "40px",
                            height: "calc(100% - 80px)",
                            width: "2px",
                            backgroundColor: "#E4E4E4",
                            zIndex: "0",
                        }}
                    ></div>

                    {[
                        {
                            number: "1",
                            titleEn: "Simple, Secure & Intuitive",
                            titleAr: "بسيط وآمن وبديهي",
                            descEn: "Effortlessly manage your team's productivity with a platform that is easy to use, secure, and designed with an intuitive interface to streamline your workday.",
                            descAr: "قم بإدارة إنتاجية فريقك بسهولة من خلال منصة سهلة الاستخدام وآمنة ومصممة بواجهة بديهية لتبسيط يوم عملك."
                        },
                        {
                            number: "2",
                            titleEn: "Web & App Tracking",
                            titleAr: "تتبع الويب والتطبيقات",
                            descEn: "Monitor your team's activity across websites and applications in real time, ensuring transparency and accountability for all tasks performed.",
                            descAr: "راقب نشاط فريقك عبر مواقع الويب والتطبيقات في الوقت الفعلي، مما يضمن الشفافية والمساءلة لجميع المهام المنجزة."
                        },
                        {
                            number: "3",
                            titleEn: "Work Reports",
                            titleAr: "تقارير العمل",
                            descEn: "Generate detailed work reports that provide insights into employee productivity and project performance, enabling better decision-making and planning.",
                            descAr: "قم بإنشاء تقارير عمل مفصلة توفر رؤى حول إنتاجية الموظفين وأداء المشاريع، مما يساعد في اتخاذ قرارات وخطط أفضل."
                        }
                        
                    ].map((feature, index) => (
                        <div
                            key={index}
                            style={{
                                display: "flex",
                                alignItems: "flex-start",
                                marginBottom: "1rem",
                                justifyContent: "center",
                            }}
                        >
                            <div
                                style={{
                                    width: "50px",
                                    height: "50px",
                                    backgroundColor: "#7ACB59",
                                    color: "#FFFFFF",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: "50%",
                                    fontSize: "18px",
                                    fontWeight: "700",
                                    marginRight: language === 'ar' ? "0" : "1rem",
                                    marginLeft: language === 'ar' ? "1rem" : "0",
                                    zIndex: "1",
                                }}
                            >
                                {feature.number}
                            </div>
                            <div style={{ width: '70%' }}>
                                <h3
                                    style={{
                                        fontSize: "30px",
                                        fontWeight: "700",
                                        color: "#3B3C4E",
                                        marginBottom: "5px",
                                        marginTop: '1%',
                                    }}
                                >
                                    {language === 'en' ? feature.titleEn : feature.titleAr}
                                </h3>
                                <p
                                    style={{
                                        fontSize: "16px",
                                        fontWeight: "400",
                                        padding: '10px',
                                        color: "#3B3C4E",
                                        lineHeight: "1.5",
                                    }}
                                >
                                    {language === 'en' ? feature.descEn : feature.descAr}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right Column */}
                <div style={{ flex: "1", display: 'flex' }}>
                    <img
                        src={tabletMockup}
                        alt="Tablet Mockup"
                        style={{
                            width: "100%",
                            borderRadius: "10px",
                            marginLeft: language === 'ar' ? '0' : '-10%',
                            marginRight: language === 'ar' ? '-10%' : '0',
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export default FeaturesSection;
