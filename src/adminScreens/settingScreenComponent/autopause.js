import React from "react";
import CompanyEmployess from "../../screen/component/companyEmployess";
import SaveChanges from "../../screen/component/button";

function AutoPause() {
    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div>
                    <p className="settingScreenshotHeading">Auto-pause tracking after</p>
                </div>
                <div>
                    <SaveChanges />
                </div>
            </div>
            <div className="settingScreenshotDiv">
                <p>Tracking will automatically pause after the specified period of inactivity and will automatically resume when user becomes active again.</p>

            </div>
            <div className="takeScreenShotDiv">
                <p>
                    <input type="radio" id="pause" name="radio-group" checked />
                    <label for="pause">Pause after</label>
                </p>
                <p>
                    <input className="number" type="number" placeholder="5" />
                    <label style={{
                        paddingLeft: "18px",
                        fontSize: "18px",
                        fontWeight: "500",
                        color: "#0E4772",
                    }}>minutes of user inactivity</label>
                </p>
                <p>
                    <input type="radio" id="notpause" name="radio-group" />
                    <label for="notpause">Do not pause</label>
                </p>
            </div>
            <div>
                <p className="settingScreenshotIndividual">Individual Settings</p>
                <p className="individualSettingFont">If enabled, the individual setting will be used instead of the team setting</p>
                <CompanyEmployess>
                    <div>
                        <p>
                            <input type="radio" id="pause" name="radio-group" checked />
                            <label for="pause">Pause after</label>
                        </p>
                    </div>
                    <div>
                        <p>
                            <input className="number" type="number" placeholder="5" />
                            <label style={{
                                paddingLeft: "18px",
                                fontSize: "18px",
                                fontWeight: "500",
                                color: "#0E4772",
                            }}>minutes of user inactivity</label>
                        </p>
                    </div>
                    <div>
                        <p>
                            <input type="radio" id="notpause" name="radio-group" />
                            <label for="notpause">Do not pause</label>
                        </p>
                    </div>
                </CompanyEmployess>
            </div>
        </div>
    )
}

export default AutoPause;