import React,{useContext,useRef,useEffect,useState} from 'react'
import {Link ,useHistory} from 'react-router-dom'
import {UserContext} from '../App'
import M from 'materialize-css'
const NavBar = ()=>{
    const  searchModal = useRef(null)
    const [search,setSearch] = useState('')
    const [userDetails,setUserDetails] = useState([])
     const {state,dispatch} = useContext(UserContext)
     const history = useHistory()
     useEffect(()=>{
         M.Modal.init(searchModal.current)
     },[])
     const renderList = ()=>{
       if(state){
           return [
             <li className="nav-item active" key="2">
               <Link className="nav-link" to="/profile">
                 {state.name}
               </Link>
             </li>,

             <li className="nav-item active" key="5">
               <Link
                 className="nav-link"
                 onClick={() => {
                   localStorage.clear();
                   dispatch({ type: "CLEAR" });
                   history.push("/signin");
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


     const fetchUsers = (query)=>{
        setSearch(query)
        fetch('/search-users',{
          method:"post",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({
            query
          })
        }).then(res=>res.json())
        .then(results=>{
          setUserDetails(results.user)
        })
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