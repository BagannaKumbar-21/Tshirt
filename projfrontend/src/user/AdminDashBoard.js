import React from "react";
import Base from "../core/Base"
import { isAuthenticated } from "../auth/helper";
import { Link } from "react-router-dom";
import "../styles.css"
const  AdminDashBoard=()=> {
    const {
        user:{name, email}
    } = isAuthenticated()
    const adminLeftSide= ()=>{
        return (
            <div className="card">
                <h4 className="card-header bg-dark text-white"> Admin Navigation </h4>
                <ul className="list-group ">
                    <li className="list-group-item">
                        <Link to="/admin/create/category" className="nav-link link-info text-success">Create Categories</Link>
                    </li>
                    <li className="list-group-item">
                        <Link to="/admin/categories" className="nav-link link-info text-success">Manage Categories</Link>
                    </li>
                    <li className="list-group-item">
                        <Link to="/admin/create/product" className="nav-link link-info text-success">Create Product</Link>
                    </li>
                    <li className="list-group-item">
                        <Link to="/admin/products" className="nav-link link-info text-success">Manage Products</Link>
                    </li>
                    <li className="list-group-item">
                        <Link to="/admin/orders" className="nav-link link-info text-success">Manage Orders</Link>
                    </li>
                </ul>
            </div>
        )
    }
    // const adminRightSide = ()=>{
    //     return (
    //         <div className=" card mb-4">
    //             <h4 className="card-header">Admin Information</h4>
    //             <ul className="list-group">
    //                 <li className="list-group-item">
    //                     <span className="badge text-bg-success m-2">Name :</span>{name}
    //                 </li>
    //                 <li className="list-group-item">
    //                     <span className="badge text-bg-success  m-2">Email :</span>{email}
    //                 </li>
    //                 <li className="list-group-item">
    //                 <span className="badge text-bg-danger  m-2">Admin area</span>
    //                 </li>
    //             </ul>
    //         </div>
    //     )
    // }
    return ( 
        <Base className=" container adminPan col-6 p-4 mb-3">
            <div className="row ">
                <div className="col-12 ">{adminLeftSide()}</div>
                {/* <div className="col-9"> {adminRightSide()}</div> */}
            </div>
        </Base>
     );
}

export default AdminDashBoard ;