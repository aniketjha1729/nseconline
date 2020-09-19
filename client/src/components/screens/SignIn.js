/* eslint-disable */
import React,{useState,useContext,} from 'react'
import {useHistory,Link} from 'react-router-dom'
import {UserContext} from '../../App'
import "./SignIn.css";
import M from 'materialize-css'
import useLoader from "../Loader/useLoader";
const SignIn  = ()=>{
    const {state,dispatch} = useContext(UserContext)
    const history = useHistory()
    const [password,setPasword] = useState("aniket")
    const [email,setEmail] = useState("aniket@gmail.com")
    const [loader, showLoader, hideLoader] = useLoader()
    const [errormsg, setErrormsg] = useState("")
    const PostData = ()=>{
        showLoader()
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            setErrormsg("Invalid Email")
            hideLoader();
            return
        }
        fetch("/signin",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                password,
                email
            })
        }).then(res=>res.json())
        .then(data=>{
            if(data.error===undefined){
               localStorage.setItem("jwt",data.token)
               localStorage.setItem("user",JSON.stringify(data.user))
               dispatch({type:"USER",payload:data.user})
               history.push('/')
            }else{
              setErrormsg(data.error)
              hideLoader()
            }
           
        }).catch(err=>{
            console.log(err)
        })
    }

    const gotoSignUp=()=>{
      history.push("/signup")
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
         <input
           type="text"
           placeholder="email"
           value={email}
           onChange={(e) => setEmail(e.target.value)}
         />
         <br />
         <input
           type="password"
           placeholder="password"
           value={password}
           onChange={(e) => setPasword(e.target.value)}
         />
         <br />
         <Link to="/reset">Forgot Password?</Link>
         <br />
         <button
           type="button"
           className="btn btn-primary"
           onClick={() => PostData()}
         >
           SignIn
         </button>
         <br />

         <button
           type="button"
           className="btn btn-success"
           onClick={() => gotoSignUp()}
         >
           Create an Account
         </button>
       </div>
       {loader}
     </div>
   );
}


export default SignIn