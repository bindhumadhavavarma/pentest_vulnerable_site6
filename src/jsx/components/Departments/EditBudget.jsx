import React, { useState } from 'react';
import { useEffect } from 'react';
import Select from "react-select";
import { ScaleLoader } from 'react-spinners';
import { AxiosPost } from "../../../context/UserContext"
import { pushNotify } from "../../../services/NotifyService"

function EditBudget(props) {
    const intitalFormData = { estimated_budget: '', category_name: { value: null, label: null } }
    const [formData, setFormData] = useState(intitalFormData)
    const [isLoading, setIsLoading] = useState(false);

    const editBudget = async (e) => {
        e.preventDefault()
        try {
            setIsLoading(true);
            const data = await AxiosPost('edit_budget.php', formData);
            console.log(data)
            if (data.success) {
                pushNotify("success", "Success", "Budget added successfully")
                await props.fetchCategories()
                setFormData(intitalFormData)
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
        props.fetchOptions()
    }, [])

    return (
        <div className="card" style={{ "height": "fit-content" }}>
            <div className="card-header border-0 pb-0">
                <h4 className="card-title">Edit Budget</h4>
            </div>
            <div className="card-body">
                {isLoading ? <div className="row mx-0" style={{ height: "100%" }}><ScaleLoader cssOverride={{ "display": "flex", "justifyContent": "center", "alignItems": "center" }} /></div> :
                    <form onSubmit={(e) => editBudget(e)}>
                        <label >Category Name : </label>
                        <Select
                            value={formData.category_name}
                            onChange={(e) => { setFormData({ ...formData, "category_name": e }) }}
                            options={props.parentCategoryOptions}
                        />
                        <label>Estimated Budget:</label>
                        <input className='form-control' type="int" min={0} name="estimated_budget" value={formData.estimated_budget} onChange={(e) => setFormData({ ...formData, "estimated_budget": e.target.value })} />
                        <button className='btn btn-primary' type='submit' style={{ "marginTop": "30px" }}>Edit Budget</button>
                    </form>
                }
            </div>
        </div>
    )
}

export default EditBudget