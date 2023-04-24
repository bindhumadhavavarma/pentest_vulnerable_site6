import React, { useState } from 'react'
import { ScaleLoader } from 'react-spinners'
import { AxiosPost } from '../../../context/UserContext';
import { pushNotify } from '../../../services/NotifyService';
import CustomizedTreeView from './CustomizedTreeView'

function DepartmentReports() {

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

  return (
    <div className='row'>
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
    </div>
  )
}

export default DepartmentReports