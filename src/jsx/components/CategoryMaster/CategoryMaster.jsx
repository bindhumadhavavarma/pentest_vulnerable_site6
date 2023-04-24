import React, { Component } from "react";
import { useEffect } from "react";
import { useState } from "react";
import Nestable from "react-nestable";
import { AxiosPost } from "../../../context/UserContext";
import { pushNotify } from "../../../services/NotifyService";
import AddCategory from "./AddCategory";
import "./style.css"
import DeleteCategory from "./DeleteCategory";
import TreeView from "./CustomizedTreeView";

const items = [
    { id: 0, text: "Item 11" },
    {
        id: 1,
        text: "Item 2",
        children: [
            { id: 2, text: "Item 3" },
            { id: 3, text: "Item 4" },
            {
                id: 4,
                text: "Item 5",
                children: [
                    { id: 5, text: "Item 6" },
                    { id: 6, text: "Item 7" },
                    { id: 7, text: "Item 8" },
                ],
            },
            { id: 8, text: "Item 9" },
            { id: 9, text: "Item 10" },
        ],
    },
];

const CategoryMaster = () => {
    const [defaultCollapsed, setDefaultCollapsed] = useState(true);
    const [isLoading, setIsLoading] = useState(false)
    const [treeItems, setTreeItems] = useState([]);
    const [parentCategoryOptions, setparentCategoryOptions] = useState([{ value: "-1", label: "Fetching Please wait..." }]);
    const [categoryOptions, setCategoryOptions] = useState(null);

    const renderItem = ({ item, collapseIcon, handler }) => {
        return (
            <div>
                {handler}
                {collapseIcon}
                {item.text}
            </div>
        );
    };

    const fetchOptions = async () => {
        try {
            setIsLoading(true);
            const data = await AxiosPost('fetch_parent_category_options.php');
            console.log(data)
            if (data.success) {
                setparentCategoryOptions(data.options)
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

    const fetchOptions2 = async () => {
        try {
            setIsLoading(true);
            const data = await AxiosPost('fetch_category_options.php');
            if (data.success) {
                setCategoryOptions(data.options)
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

    const fetchCategories = async () => {
        try {
            setIsLoading(true);
            const data = await AxiosPost('fetch_categories.php');
            console.log(data)
            if (data.success) {
                setTreeItems(data.category)
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
        fetchCategories()
    }, [])

    return (
        <div className="row">
            <div className="col-md-8">
                <div className="card" style={{"height":"fit-content"}}>
                    <div className="card-header border-0 pb-0">
                        <h4 className="card-title">Categories</h4>
                    </div>
                    <div className="card-body">
                       
                    <div className="card-body">
                        <TreeView></TreeView>
                        {treeItems!=null?<Nestable
                            items={Object.values(treeItems)}
                            collapsed={true}
                            renderItem={renderItem}
                            maxDepth={30}
                        />:null}
                    </div>
                    </div>
                </div>
            </div>
            <div className="col-md-4">
                <AddCategory fetchOptions={fetchOptions} parentCategoryOptions={parentCategoryOptions} fetchCategories={fetchCategories}></AddCategory>
                <DeleteCategory fetchOptions={fetchOptions2} categoryOptions={categoryOptions}  fetchCategories={fetchCategories}></DeleteCategory>
            </div>
        </div>
    );
}

export default CategoryMaster;
