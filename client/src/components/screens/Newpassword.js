/* eslint-disable */
import React,{useState,useContext,} from 'react'
import {Link,useHistory,useParams} from 'react-router-dom'
import M from 'materialize-css'
import "./SignIn.css"
const NewPassword  = ()=>{
    const history = useHistory()
    const [password,setPasword] = useState("")
    const {token} = useParams()
    //console.log(token)
    const PostData = ()=>{
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
              M.toast({html: data.error,classes:"#c62828 red darken-3"})
           }
           else{

               M.toast({html:data.message,classes:"#43a047 green darken-1"})
               history.push('/signin')
           }
        }).catch(err=>{
            console.log(err)
        })
    }
   return (
     <div className="signin">
       <div className="card signin_card">
         <h2>NSEC Social</h2>
         <br/>
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