import React, { useState } from 'react';
import { useEffect } from 'react';
import Select from "react-select";
import { ScaleLoader } from 'react-spinners';
import { AxiosPost } from "../../../context/UserContext"
import { pushNotify } from "../../../services/NotifyService"

function DeleteCategory(props) {
    const intitalFormData = { parent_category: '' }
    const [formData, setFormData] = useState(intitalFormData)
    const [isLoading, setIsLoading] = useState(false);

    const addCategory = async (e) => {
        e.preventDefault()
        try {
            setIsLoading(true);
            const data = await AxiosPost('delete_category.php', formData);
            console.log(data)
            if (data.success) {
                pushNotify("success", "Success", "Category deleted successfully")
                await props.fetchOptions2()
                await props.fetchOptions()
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
        props.fetchOptions2()
    }, [])

    return (
        <div className="card" style={{"height":"fit-content"}}>
            <div className="card-header border-0 pb-0">
                <h4 className="card-title">Delete Category</h4>
            </div>
            <div className="card-body">
            {isLoading ? <div className="row mx-0" style={{ height: "100%" }}><ScaleLoader cssOverride={{ "display": "flex", "justifyContent": "center", "alignItems": "center" }} /></div> :
                    <form onSubmit={(e) => addCategory(e)}>
                    <label >Category Name : </label>
                    <Select
                        value={formData.parent_category}
                        onChange={(e) => { setFormData({ ...formData, "parent_category": e }) }}
                        options={props.parentCategoryOptions}
                    />
                    <button className='btn btn-primary' type='submit' style={{ "marginTop": "30px" }}>Delete Category</button>
                </form>}
            </div>
        </div>
    )
}

export default DeleteCategory