import React from "react";
import CompanyEmployess from "../../screen/component/companyEmployess";
import SaveChanges from "../../screen/component/button";

function UrlTracking() {
    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div>
                    <p className="settingScreenshotHeading">App & URL tracking</p>
                </div>
                <div>
                    <SaveChanges />
                </div>
            </div>
            <div className="settingActivityDiv">
                <p>Track what applications your team members use and what websites they visit.</p>
            </div>
            <div className="activityLevelDiv">
                <p>
                    <input type="radio" id="urltrack" name="radio-group" checked />
                    <label for="urltrack">Track</label>
                </p>
                <p>
                    <input type="radio" id="urldonottrack" name="radio-group" />
                    <label for="urldonottrack">Do not Track</label>
                </p>
            </div>
            <div className="activityLevelIndividual">
                <p className="settingScreenshotIndividual">Individual Settings</p>
                <p className="individualSettingFont">If enabled, the individual setting will be used instead of the team setting</p>
                <CompanyEmployess>
                    <div>
                        <p>
                            <input type="radio" id="urltrack" name="radio-group" checked />
                            <label for="urltrack">Track</label>
                        </p>
                    </div>
                    <div>
                        <p>
                            <input type="radio" id="urldonottrack" name="radio-group" />
                            <label for="urldonottrack">Do not Track</label>
                        </p>
                    </div>
                </CompanyEmployess>
            </div>
        </div>
    )
}

export default UrlTracking;