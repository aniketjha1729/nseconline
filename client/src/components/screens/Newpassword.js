/* eslint-disable */
import React,{useState,useContext,} from 'react'
import {Link,useHistory,useParams} from 'react-router-dom'
import M from 'materialize-css'
import "./SignIn.css"
import useLoader from "../Loader/useLoader";
const NewPassword  = ()=>{
    const history = useHistory()
    const [password,setPasword] = useState("")
    const {token} = useParams()
    const [errormsg, setErrormsg] = useState("");
    const [successmsg, setSuccessmsg] = useState("")
    const [loader, showLoader, hideLoader] = useLoader();
    const PostData = ()=>{
        showLoader()
        fetch("/new-password",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                password,
                token
            })
        }).then(res=>res.json())
        .then(data=>{
            console.log(data)
           if(data.error){
              setErrormsg(data.error)
              hideLoader()
           }
           else{
              setSuccessmsg("Password successfully changed kindy login with new password.")
              hideLoader()
              setPasword("")
           }
        }).catch(err=>{
            console.log(err)
        })
    }
   return (
     <div className="signin">
       <div className="card signin_card">
         <h2>NSEC Social</h2>
         <br />
         {errormsg ? (
           <div
             class="alert alert-danger alert-dismissible fade show"
             role="alert"
           >
             {errormsg}
             <button
               type="button"
               class="close"
               data-dismiss="alert"
               aria-label="Close"
               onClick={() => setErrormsg("")}
             >
               <span aria-hidden="true">&times;</span>
             </button>
           </div>
         ) : (
           ""
         )}

         {successmsg ? (
           <div
             class="alert alert-success alert-dismissible fade show"
             role="alert"
           >
             {successmsg}
             <button
               type="button"
               class="close"
               data-dismiss="alert"
               aria-label="Close"
               onClick={() => setSuccessmsg("")}
             >
               <span aria-hidden="true">&times;</span>
             </button>
           </div>
         ) : (
           ""
         )}

         <input
           type="password"
           placeholder="password"
           value={password}
           onChange={(e) => setPasword(e.target.value)}
         />
         <br />
         <button
           type="button"
           className="btn btn-primary"
           onClick={() => PostData()}
         >
           Upadte
         </button>
         <br />
       </div>
     </div>
   );
}


export default NewPassword;