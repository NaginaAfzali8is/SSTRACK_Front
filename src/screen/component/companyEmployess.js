import React, { useEffect, useState } from "react";
import Switch from "../../screen/component/switch";
import userIcon from '../../images/groupImg.svg'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const CompanyEmployess = (props) => {

    const [setting, setSetting] = useState([])
    const { Setting, loading, loading2, employees, setEmployess } = props

    function handleSelectEmployee(id, e) {
        setEmployess((prevEmployee) => {
            const selectedEmployee = prevEmployee.map((emp) => {
                if (emp._id === id) {
                    return {
                        ...emp,
                        isSelected: e
                    }
                }
                else {
                    return emp
                }
            })
            return selectedEmployee
        })
    }

    useEffect(() => {
        setSetting((prevSetting) => {
            return employees?.filter((emp) => emp.isSelected)?.map((data) => {
                const existingSetting = setting.find((setting) => setting.id === data._id);
                return {
                    id: data._id,
                    settings: {
                        screenshots: {
                            frequency: existingSetting?.settings?.screenshots?.frequency === undefined ? null : existingSetting?.settings?.screenshots?.frequency,
                            enabled: existingSetting?.settings?.screenshots?.enabled === undefined ? null : existingSetting?.settings?.screenshots?.enabled
                        }
                    }
                };
            })
        });
    }, [employees]);

    console.log(employees);
    console.log(setting);

    return (
        <div style={{
            height: 400,
            overflowY: "scroll",
        }}>
            {loading2 ? (
                <Skeleton count={1} height="400px" style={{ margin: "10px 0 0 0" }} />
            ) : employees && employees.length > 0 ? employees?.map((employee, index) => {
                return (
                    loading ? (
                        <Skeleton count={1} height="56px" style={{ margin: "10px 0 0 0" }} />
                    ) : (
                        <div className="newDiv">
                            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <img width={35} src={userIcon} alt="" />
                                    <p style={{ marginLeft: 10 }}>{employee.name}</p>
                                </div>
                                <div style={{ marginRight: 10 }}>
                                    <label class="switch">
                                        <input type="checkbox" onChange={(e) => handleSelectEmployee(employee._id, e.target.checked)} />
                                        <span class="slider round"></span>
                                    </label>
                                </div>
                            </div>
                            {employee?.isSelected ? (
                                <div className="employee-individual-setting">
                                    <Setting setting={setting} setSetting={setSetting} employee={employee} />
                                </div>
                            ) : ""}
                        </div>
                    )
                )
            }) : null}
        </div>
    );
}

export default CompanyEmployess;