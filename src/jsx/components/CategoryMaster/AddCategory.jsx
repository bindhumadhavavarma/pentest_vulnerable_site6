import React, { useState } from 'react';
import { useEffect } from 'react';
import Select from "react-select";
import { ScaleLoader } from 'react-spinners';
import { AxiosPost } from "../../../context/UserContext"
import { pushNotify } from "../../../services/NotifyService"

function AddCategory(props) {
    const intitalFormData = { category_name: '', parent_category: { value: null, label: null },estimated_budget:'' }
    const [formData, setFormData] = useState(intitalFormData)
    const [isLoading, setIsLoading] = useState(false);

    const addCategory = async (e) => {
        e.preventDefault()
        try {
            setIsLoading(true);
            const data = await AxiosPost('add_category.php', formData);
            console.log(data)
            if (data.success) {
                pushNotify("success", "Success", "Category added successfully")
                await props.fetchOptions()
                await props.fetchOptions2()
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
                <h4 className="card-title">Add Category</h4>
            </div>
            <div className="card-body">
                {isLoading ? <div className="row mx-0" style={{ height: "100%" }}><ScaleLoader cssOverride={{ "display": "flex", "justifyContent": "center", "alignItems": "center" }} /></div> :
                    <form onSubmit={(e) => addCategory(e)}>
                        <label >Parent Category : </label>
                        <Select
                            value={formData.parent_category}
                            onChange={(e) => { setFormData({ ...formData, "parent_category": e }) }}
                            options={props.parentCategoryOptions}
                        />
                        <label >Category Name : </label>
                        <input type="text" className='form-control' name='category_name' value={formData.category_name} onChange={(e) => { setFormData({ ...formData, "category_name": e.target.value }) }} />
                        <label >Estimated Budget : </label>
                        <input type="number" min={0} className='form-control' name='estimated_budget' value={formData.estimated_budget} onChange={(e) => { setFormData({ ...formData, "estimated_budget": e.target.value }) }} />

                        <button className='btn btn-primary' type='submit' style={{ "marginTop": "30px" }}>Add Category</button>
                    </form>}

            </div>
        </div>
    )
}

export default AddCategory