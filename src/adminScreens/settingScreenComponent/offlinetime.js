import React from "react";
import CompanyEmployess from "../../screen/component/companyEmployess";
import SaveChanges from "../../screen/component/button";


function OfflineTime() {
    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div>
                    <p className="settingScreenshotHeading">Allow adding Offline Time</p>
                </div>
                <div>
                    <SaveChanges />
                </div>
            </div>
            <div className="settingActivityDiv">
                <p>Allow user to add time not tracked by the program to their timeline manually. It is often used to account for work away from a computer.</p>
            </div>
            <div className="activityLevelDiv">
                <p>
                    <input type="radio" id="allow" name="radio-group" checked />
                    <label for="allow">Allow</label>
                </p>
                <p>
                    <input type="radio" id="donotallow" name="radio-group" />
                    <label for="donotallow">Do not Allow</label>
                </p>
            </div>
            <div className="activityLevelIndividual">
                <p className="settingScreenshotIndividual">Individual Settings</p>
                <p className="individualSettingFont">If enabled, the individual setting will be used instead of the team setting</p>
                <CompanyEmployess>
                    <div>
                        <p>
                            <input type="radio" id="allow" name="radio-group" checked />
                            <label for="allow">Allow</label>
                        </p>
                    </div>
                    <div>
                        <p>
                            <input type="radio" id="donotallow" name="radio-group" />
                            <label for="donotallow">Do not Allow</label>
                        </p>
                    </div>
                </CompanyEmployess>
            </div>
        </div>
    )
}
export default OfflineTime;