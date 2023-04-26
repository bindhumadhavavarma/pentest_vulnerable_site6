import React, { Component } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { AxiosPost } from "../../../context/UserContext";
import { pushNotify } from "../../../services/NotifyService";
import "./style.css"
import CustomizedTreeView from "./CustomizedTreeView";
import { ScaleLoader } from "react-spinners";
import Select from "react-select";

const Departments = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [treeItems, setTreeItems] = useState([]);
    const [departments, setDepartments] = useState([])
    const [companies, setCompanies] = useState([])
    const [raisedAmounts, setRaisedAmounts] = useState([])
    const [paidAmounts, setPaidAmounts] = useState([])
    const [departmentName, setDepartmentName] = useState('')
    const [deptOptions, setDeptOptions] = useState([])
    const [isLoading2, setIsLoading2] = useState(false)
    const [formData, setFormData] = useState({ department: '', new_name: '' })
    const [delDept, setDelDept] = useState('')

    const fetchDepartments = async () => {
        try {
            setIsLoading(true);
            const data = await AxiosPost('fetch_departments.php');
            console.log(data)
            if (data.success) {
                setDepartments(data.departments)
                setCompanies(data.companies)
                setRaisedAmounts(data.raised_amounts)
                setPaidAmounts(data.paid_amounts)
            }
            else {
                pushNotify("error", "Error", data.error)
            }
        } catch {
            pushNotify("error", "Error", "Server Error!")
        } finally {
            setIsLoading(false)
        }
    }

    const addCategory = async (e) => {
        e.preventDefault()
        try {
            setIsLoading(true);
            const data = await AxiosPost('add_department.php', { department_name: departmentName });
            console.log(data)
            if (data.success) {
                await fetchDepartments()
                await fetchDeptOptions()
                pushNotify("success", "Success", "Department added successfully")
            }
            else {
                pushNotify("error", "Error", data.error)
            }
        } catch {
            pushNotify("error", "Error", "Server Error!")
        } finally {
            setIsLoading(false)
        }
    }

    const fetchDeptOptions = async () => {
        try {
            setIsLoading(true);
            const data = await AxiosPost('fetch_department_options.php');
            console.log(data)
            if (data.success) {
                setDeptOptions(data.options)
            }
            else {
                pushNotify("error", "Error", data.error)
            }
        } catch {
            pushNotify("error", "Error", "Server Error!")
        } finally {
            setIsLoading(false)
        }
    }

    const editDepartment = async () => {
        try {
            setIsLoading(true);
            const data = await AxiosPost('edit_department.php', formData);
            console.log(data)
            if (data.success) {
                await fetchDepartments()
                await fetchDeptOptions()
                setFormData({ department: '', new_name: '' })
                pushNotify("success", "Success", "Department name edited succesfully")
            }
            else {
                pushNotify("error", "Error", data.error)
            }
        } catch {
            pushNotify("error", "Error", "Server Error!")
        } finally {
            setIsLoading(false)
        }
    }

    const deleteDepartment = async () => {
        try {
            setIsLoading(true);
            const data = await AxiosPost('delete_department.php', delDept);
            console.log(data)
            if (data.success) {
                await fetchDepartments()
                await fetchDeptOptions()
                setDelDept('')
                pushNotify("success", "Success", "Department deleted succesfully")
            }
            else {
                pushNotify("error", "Error", data.error)
            }
        } catch {
            pushNotify("error", "Error", "Server Error!")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchDepartments()
        fetchDeptOptions()
    }, [])

    return (
        <div className="row">
            <div className="col-md-12">
                <div className="card" style={{ "height": "fit-content" }}>
                    <div className="card-header border-0 pb-0">
                        <h4 className="card-title">Departments</h4>
                    </div>
                    <div className="card-body">
                        {isLoading ?
                            <div className="row mx-0" style={{ height: "100%" }}><ScaleLoader cssOverride={{ "display": "flex", "justifyContent": "center", "alignItems": "center" }} /></div> :
                            <CustomizedTreeView paidAmounts={paidAmounts} raisedAmounts={raisedAmounts} departments={departments} companies={companies}></CustomizedTreeView>
                        }
                    </div>
                </div>
            </div>
            <div className="col-md-4">
                <div className="card" style={{ "height": "fit-content" }}>
                    <div className="card-header border-0 pb-0">
                        <h4 className="card-title">Add Department</h4>
                    </div>
                    <div className="card-body">
                        {isLoading ?
                            <div className="row mx-0" style={{ height: "100%" }}><ScaleLoader cssOverride={{ "display": "flex", "justifyContent": "center", "alignItems": "center" }} /></div> :
                            <form className="basic-form" onSubmit={addCategory}>
                                <label className="mt-0">Department Name</label>
                                <input type="text" name="department_name" className="form-control" onChange={(e) => { setDepartmentName(e.target.value) }} required />
                                <button className="btn btn-primary mt-3" type="submit">Add Department</button>
                            </form>
                        }
                    </div>
                </div>
            </div>
            <div className="col-md-4">
                <div className="card" style={{ "height": "fit-content" }}>
                    <div className="card-header border-0 pb-0">
                        <h4 className="card-title">Edit Department</h4>
                    </div>
                    <div className="card-body">
                        {isLoading ?
                            <div className="row mx-0" style={{ height: "100%" }}><ScaleLoader cssOverride={{ "display": "flex", "justifyContent": "center", "alignItems": "center" }} /></div> :
                            <form className="basic-form" onSubmit={editDepartment}>
                                <label className="mt-0">Select Department</label>
                                <Select
                                    isLoading={isLoading2}
                                    isDisabled={isLoading2}
                                    value={formData.department}
                                    onChange={(e) => { setFormData({ ...formData, "department": e }) }}
                                    options={deptOptions}
                                />
                                <label className="mt-0">New Name</label>
                                <input type="text" name="department_name" className="form-control" onChange={(e) => { setFormData({ ...formData, new_name: e.target.value }) }} required />
                                <button className="btn btn-primary mt-3" type="submit">Edit Department</button>
                            </form>
                        }
                    </div>
                </div>
            </div>
            <div className="col-md-4">
                <div className="card" style={{ "height": "fit-content" }}>
                    <div className="card-header border-0 pb-0">
                        <h4 className="card-title">Delete Department</h4>
                    </div>
                    <div className="card-body">
                        {isLoading ?
                            <div className="row mx-0" style={{ height: "100%" }}><ScaleLoader cssOverride={{ "display": "flex", "justifyContent": "center", "alignItems": "center" }} /></div> :
                            <form className="basic-form" onSubmit={deleteDepartment}>
                                <label className="mt-0">Select Department</label>
                                <Select
                                    isLoading={isLoading2}
                                    isDisabled={isLoading2}
                                    value={delDept}
                                    onChange={(e) => { setDelDept(e) }}
                                    options={deptOptions}
                                />
                                <button className="btn btn-primary mt-3" type="submit">Delete Department</button>
                            </form>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Departments;
