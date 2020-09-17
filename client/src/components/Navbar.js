/* eslint-disable */
import React,{useContext,useState} from 'react'
import {Link ,useHistory} from 'react-router-dom'
import {UserContext} from '../App'
import SearchIcon from '@material-ui/icons/Search';
import { IconButton } from "@material-ui/core";
import M from 'materialize-css'
import "./Navbar.css";
const NavBar = ()=>{
    
     const [search,setSearch] = useState("")
     const [userDetails,setUserDetails] = useState([])
     const {state,dispatch} = useContext(UserContext)
     const history = useHistory()
     
      const fetchUsers = (query) => {
        setSearch(query)
        fetch('/search-users', {
          method: "post",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            query
          })
        }).then(res => res.json())
          .then(results => {
            setUserDetails(results.user)
          })
      }

  

     const renderList = ()=>{
       if(state){
           return [
             <li className="nav-item active" key="8">
               <button
                 type="button"
                 className="btn btn-primary"
                 data-toggle="modal"
                 data-target="#exampleModal"
               >
                 <SearchIcon />
               </button>
             </li>,
             <div
               key="12"
               className="modal fade"
               id="exampleModal"
               tabIndex="-1"
               role="dialog"
               aria-labelledby="exampleModalLabel"
               aria-hidden="true"
             >
               <div className="modal-dialog" role="document">
                 <div className="modal-content">
                   <div className="modal-header">
                     <h5 className="modal-title" id="exampleModalLabel">
                       Modal title
                     </h5>
                     <button
                       type="button"
                       className="close"
                       data-dismiss="modal"
                       aria-label="Close"
                     >
                       <span aria-hidden="true">&times;</span>
                     </button>
                   </div>
                   <input
                     type="text"
                     placeholder="Search User"
                     value={search}
                     onChange={(e) => fetchUsers(e.target.value)}
                   />
                   <div className="modal-body">
                     <ul className="list-group">
                       {userDetails.map((item) => {
                         return (
                           <Link to={"/profile/" + item._id}>
                             <li key={item._id} className="list-group-item">
                               {item.name}
                             </li>
                           </Link>
                         );
                       })}
                     </ul>
                   </div>
                 </div>
               </div>
             </div>,
             <li className="nav-item active" key="2">
               <Link className="nav-link" to="/profile">
                 <img
                   src={state.pic}
                   alt=""
                   className="userProfilePic"
                 />{" "}
                 &nbsp; {state.name}
               </Link>
             </li>,

             <li className="nav-item active" key="5">
               <Link
                 to="/signin"
                 className="nav-link"
                 onClick={() => {
                   localStorage.clear();
                   dispatch({ type: "CLEAR" });
                 }}
               >
                 Logout
               </Link>
             </li>,
           ];
       }else{
         return [
           <li className="nav-item active" key="6">
             <Link className="nav-link" to="/signin">
               Signin
             </Link>
           </li>,
           <li className="nav-item active" key="7">
             <Link className="nav-link" to="/signup">
               Signup
             </Link>
           </li>,
         ];
       }
     }

    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <Link to={state ? "/" : "signin"} className="navbar-brand">
            NSEC Social{" "}
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarResponsive"
            aria-controls="navbarResponsive"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarResponsive">
            <ul className="navbar-nav ml-auto">{renderList()}</ul>
          </div>
        </div>
      </nav>
    );
}


export default NavBar