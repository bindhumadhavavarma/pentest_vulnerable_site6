import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import { ScaleLoader } from 'react-spinners';
import { AxiosPost } from '../../../context/UserContext';
import { pushNotify } from '../../../services/NotifyService';
import { Modal } from "react-bootstrap";
import Select from "react-select";
import ReactDataGrid from '@inovua/reactdatagrid-community'
import '@inovua/reactdatagrid-community/index.css'
import SelectFilter from '@inovua/reactdatagrid-community/SelectFilter'
import Button from '@inovua/reactdatagrid-community/packages/Button'

function Companies(props) {
    const [isLoading, setIsLoading] = useState(false)
    const [companies, setcompanies] = useState();
    const [compFilter, setCompFilter] = useState("")
    const [showAddModal, setShowAddModal] = useState(false)
    const initialFormData = {
        company_name: "", department: '', url: '', email: '', phone: '', address: '',
        address2: '', address3: '', address4: '', address5: '', subject_address: ''
    }
    const [formData, setFormData] = useState(initialFormData)
    const [deleteModal, setDeleteCompany] = useState({ show: false, id: null })
    const [editModal, setEditModal] = useState({ show: false, id: null })
    const [isLoading2, setIsLoading2] = useState(false)
    const [deptOptions, setDeptOptions] = useState([])
    const [gridRef, setGridRef] = useState(null)

    const gridStyle = { height: "calc(100vh - 17rem)", marginTop: 10 };

    const filterValue = [
        { name: 'sl', operator: 'gte', type: 'number', value: '' },
        { name: 'company_name', operator: 'startsWith', type: 'string', value: '' },
        { name: 'url', operator: 'startsWith', type: 'string', value: '' },
        { name: 'email', operator: 'startsWith', type: 'string', value: '' },
        { name: 'phone', operator: 'startsWith', type: 'string', value: '' },
    ]

    const columns = [
        { name: 'sl', header: 'ID', defaultFlex: 1, minWidth: 70 },
        { name: 'company_name', header: 'Company Name', defaultFlex: 2, minWidth: 100 },
        { name: 'url', header: 'URL', defaultFlex: 2, minWidth: 100 },
        { name: 'email', header: 'Email', defaultFlex: 2, minWidth: 100 },
        { name: 'phone', header: 'Phone', defaultFlex: 2, minWidth: 100 },
        {
            name: "sl", header: "Actions", defaultFlex: 1, minWidth: 100,
            render: ({ value }) => <>
                <button className="btn btn-danger tp-btn sharp" onClick={() => { setDeleteCompany({ show: true, id: value }) }} ><i className="fas fa-trash-alt"></i></button>
                <button className="btn btn-primary tp-btn sharp" onClick={() => { showEditModal(value) }} ><i className="fas fa-edit"></i></button>
            </>
        },
    ];

    const showEditModal = async (sl) => {
        try {
            setIsLoading(true);
            const data = await AxiosPost('fetch_company_info.php', { sl: sl });
            console.log(data)
            if (data.success) {
                let company = data.company
                setFormData({
                    sl: company.sl, company_name: company.company_name,
                    department: { value: company.department_id, label: company.department_name },
                    url: company.url, email: company.email, phone: company.phone, address: company.address,
                    address2: company.address2, address3: company.address3, address4: company.address4,
                    address5: company.address5, subject_address: company.subject_address
                });
                setEditModal({ show: true, id: sl });
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

    const exportCSV = async () => {
        const columns = gridRef.current.visibleColumns;

        const header = columns.map((c) => c.name).join(',');
        const rows = gridRef.current.data.map((data) => columns.map((c) => data[c.id]).join(','));

        const contents = [header].concat(rows).join('\n');
        const blob = new Blob([contents], { type: 'text/csv;charset=utf-8;' });

        downloadBlob(blob);

    };

    const downloadBlob = (blob, fileName = 'grid-data.csv') => {
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', fileName);
        link.style.position = 'absolute';
        link.style.visibility = 'hidden';

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);
    };

    const onChangeHandler = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const filterCompanies = (company) => {
        if (company.company_name.includes(compFilter)) return true
        else return false
    }

    const addCompany = async (e) => {
        e.preventDefault()
        try {
            if (formData.department == '') {
                pushNotify("error", "Error", "Department is required to add the company")
                return
            }
            setIsLoading(true);
            const data = await AxiosPost('add_company.php', formData);
            console.log(data)
            if (data.success) {
                pushNotify("success", "Success", "Company added successfully")
                await fetchcompanies()
                setFormData(initialFormData)
                setShowAddModal(false)
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

    const fetchcompanies = async () => {
        try {
            setIsLoading(true);
            const data = await AxiosPost('fetch_companies.php');
            console.log(data)
            if (data.success) {
                setcompanies(data.companies)
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

    const deleteCompany = async () => {
        try {
            setIsLoading(true);
            const data = await AxiosPost('delete_company.php', { sl: deleteModal.id });
            console.log(data)
            if (data.success) {
                pushNotify("success", "Success", "Company deleted successfully");
                await fetchcompanies()
                setDeleteCompany({ show: false, id: null })
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

    const editCompany = async (e) => {
        e.preventDefault()
        try {
            setIsLoading(true);
            const data = await AxiosPost('edit_company.php', formData);
            console.log(data)
            if (data.success) {
                pushNotify("success", "Success", "Company Edited successfully");
                await fetchcompanies()
                setEditModal({ show: false, id: null })
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
            setIsLoading2(true);
            const data = await AxiosPost('fetch_department_options.php', formData);
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
            setIsLoading2(false)
        }
    }

    useEffect(() => {
        fetchcompanies()
        fetchDeptOptions()
    }, [])

    return (
        <>
            <div className="col-xl-12 col-lg-12 col-xxl-12 col-sm-12">
                {isLoading || companies == null ?
                    <>
                        <Button
                            onClick={props.fetchTransactions}
                        >
                            Sync Data
                        </Button>
                        <ReactDataGrid
                            idProperty="id"
                            style={gridStyle}
                            columns={columns}
                            pagination='local'
                            dataSource={[]}
                            defaultLimit={25}
                            defaultFilterValue={filterValue}
                            loading={true}
                        />
                    </> :
                    <>
                        <Button onClick={() => { setShowAddModal(true) }} >Add Company</Button>
                        <Button style={{ marginLeft: 10 }} onClick={fetchcompanies}>Sync Data</Button>
                        <Button style={{ marginLeft: 10 }} onClick={exportCSV}>Export CSV</Button>
                        <ReactDataGrid
                            idProperty="id"
                            style={gridStyle}
                            columns={columns}
                            pagination='local'
                            dataSource={companies}
                            defaultLimit={25}
                            defaultFilterValue={filterValue}
                            handle={setGridRef}
                        />
                    </>
                }
            </div>

            <Modal className="fade" size="lg" show={showAddModal} centered>
                <Modal.Header>
                    <Modal.Title>Add Company</Modal.Title>
                    <button
                        onClick={() => { setShowAddModal(false) }}
                        className="btn btn-close"
                    >

                    </button>
                </Modal.Header>
                <form className="basic-form" onSubmit={addCompany}>
                    <Modal.Body>
                        {!isLoading ?
                            <div className="basic-form row">
                                <div className="col-md-6">
                                    <label >Company Name : <span className="text-red">*</span></label>
                                    <input required className="form-control" type="text" name="company_name" value={formData.company_name} onChange={onChangeHandler} />
                                </div>
                                <div className="col-md-6">
                                    <label >Department : <span className="text-red">*</span></label>
                                    <Select
                                        isLoading={isLoading2}
                                        isDisabled={isLoading2}
                                        value={formData.department}
                                        onChange={(e) => { setFormData({ ...formData, "department": e }) }}
                                        options={deptOptions}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label >URL : </label>
                                    <input className="form-control" type="text" name="url" value={formData.url} onChange={onChangeHandler} />
                                </div>
                                <div className="col-md-6">
                                    <label >Email : </label>
                                    <input className="form-control" type="email" name="email" value={formData.email} onChange={onChangeHandler} />
                                </div>
                                <div className="col-md-6">
                                    <label >Phone : </label>
                                    <input type="number" className='form-control' name='phone' value={formData.phone} onChange={onChangeHandler} />
                                </div>
                                <div className="col-md-6">
                                    <label >Address Line 1 (Designation) :</label>
                                    <input className="form-control" type="text" name="address" value={formData.address} onChange={onChangeHandler} ></input>
                                </div>
                                <div className="col-md-6">
                                    <label >Address Line 2 :</label>
                                    <input className="form-control" type="text" name="address2" value={formData.address2} onChange={onChangeHandler} ></input>
                                </div>
                                <div className="col-md-6">
                                    <label >Address Line 3 :</label>
                                    <input className="form-control" type="text" name="address3" value={formData.address3} onChange={onChangeHandler} ></input>
                                </div>
                                <div className="col-md-6">
                                    <label >Address Line 4 :</label>
                                    <input className="form-control" type="text" name="address4" value={formData.address4} onChange={onChangeHandler} ></input>
                                </div>
                                <div className="col-md-6">
                                    <label >Address Line 5 :</label>
                                    <input className="form-control" type="text" name="address5" value={formData.address5} onChange={onChangeHandler} ></input>
                                </div>
                                <div className="col-md-6">
                                    <label >Subject Address :</label>
                                    <input className="form-control" type="text" name="subject_address" value={formData.subject_address} onChange={onChangeHandler} ></input>
                                </div>
                            </div> :
                            <div className="row mx-0" style={{ height: "100%" }}><ScaleLoader cssOverride={{ "display": "flex", "justifyContent": "center", "alignItems": "center" }} /></div>
                        }
                    </Modal.Body>
                    <Modal.Footer>
                        <button
                            className="btn btn-success"
                            type="submit"
                        >
                            Add Company
                        </button>
                        <button className="btn btn-primary" onClick={() => { setShowAddModal(false) }}>Cancel</button>
                    </Modal.Footer>
                </form>

            </Modal>

            <Modal className="fade" show={deleteModal.show} centered>
                <Modal.Header>
                    <Modal.Title>Delete Company</Modal.Title>
                    <button
                        onClick={() => { setDeleteCompany({ show: false, id: null }) }}
                        className="btn btn-close"
                    >

                    </button>
                </Modal.Header>
                <Modal.Body>
                    {!isLoading ?
                        <>
                            Are you sure you want to delete the Company?
                        </> :
                        <div className="row mx-0" style={{ height: "100%" }}><ScaleLoader cssOverride={{ "display": "flex", "justifyContent": "center", "alignItems": "center" }} /></div>
                    }
                </Modal.Body>
                <Modal.Footer>
                    <button
                        className="btn btn-danger"
                        type="submit"
                        onClick={deleteCompany}
                    >
                        Delete Company
                    </button>
                    <button className="btn btn-primary" onClick={() => { setDeleteCompany({ show: false, id: null }) }}>Cancel</button>
                </Modal.Footer>

            </Modal>

            <Modal className="fade" size="lg" show={editModal.show} centered>
                <Modal.Header>
                    <Modal.Title>Edit Company</Modal.Title>
                    <button
                        onClick={() => { setEditModal({ show: false, id: null }) }}
                        className="btn btn-close"
                    >

                    </button>
                </Modal.Header>
                <form className="basic-form" onSubmit={editCompany}>
                    <Modal.Body>
                        {!isLoading ?
                            <div className="basic-form row">
                                <div className="col-md-6">
                                    <label >Company Name : <span className="text-red">*</span></label>
                                    <input required className="form-control" type="text" name="company_name" value={formData.company_name} onChange={onChangeHandler} />
                                </div>
                                <div className="col-md-6">
                                    <label >URL : </label>
                                    <input className="form-control" type="text" name="url" value={formData.url} onChange={onChangeHandler} />
                                </div>
                                <div className="col-md-6">
                                    <label >Department : <span className="text-red">*</span></label>
                                    <Select
                                        isLoading={isLoading2}
                                        isDisabled={isLoading2}
                                        value={formData.department}
                                        onChange={(e) => { setFormData({ ...formData, "department": e }) }}
                                        options={deptOptions}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label >Email : </label>
                                    <input className="form-control" type="email" name="email" value={formData.email} onChange={onChangeHandler} />
                                </div>
                                <div className="col-md-6">
                                    <label >Phone : </label>
                                    <input type="number" className='form-control' name='phone' value={formData.phone} onChange={onChangeHandler} />
                                </div>
                                <div className="col-md-6">
                                    <label >Address Line 1 (Designation):</label>
                                    <input className="form-control" type="text" name="address" value={formData.address} onChange={onChangeHandler} ></input>
                                </div>
                                <div className="col-md-6">
                                    <label >Address Line 2 :</label>
                                    <input className="form-control" type="text" name="address2" value={formData.address2} onChange={onChangeHandler} ></input>
                                </div>
                                <div className="col-md-6">
                                    <label >Address Line 3 :</label>
                                    <input className="form-control" type="text" name="address3" value={formData.address3} onChange={onChangeHandler} ></input>
                                </div>
                                <div className="col-md-6">
                                    <label >Address Line 4 :</label>
                                    <input className="form-control" type="text" name="address4" value={formData.address4} onChange={onChangeHandler} ></input>
                                </div>
                                <div className="col-md-6">
                                    <label >Address Line 5 :</label>
                                    <input className="form-control" type="text" name="address5" value={formData.address5} onChange={onChangeHandler} ></input>
                                </div>
                                <div className="col-md-6">
                                    <label >Subject Address :</label>
                                    <input className="form-control" type="text" name="subject_address" value={formData.subject_address} onChange={onChangeHandler} ></input>
                                </div>
                            </div> :
                            <div className="row mx-0" style={{ height: "100%" }}><ScaleLoader cssOverride={{ "display": "flex", "justifyContent": "center", "alignItems": "center" }} /></div>
                        }
                    </Modal.Body>
                    <Modal.Footer>
                        <button
                            className="btn btn-success"
                            type="submit"
                        >
                            Edit Company
                        </button>
                        <button className="btn btn-primary" onClick={() => { setEditModal({ show: false, id: null }) }}>Cancel</button>
                    </Modal.Footer>
                </form>

            </Modal>
        </>
    )

}

export default Companies