import React,{useState,useEffect} from 'react'
import {Link,useHistory} from 'react-router-dom'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import M from 'materialize-css'
import "./SignUp.css";

const SignIn  = ()=>{
    const history = useHistory()
    const [name,setName] = useState("")
    const [password,setPasword] = useState("")
    const [email,setEmail] = useState("")
    const [image,setImage] = useState("")
    const [dob,setDob] = useState("")
    const [loading, setLoading] = useState(false)
    const [url,setUrl] = useState(undefined)
    useEffect(()=>{
        if(url){
            uploadFields()
            document.addEventListener('DOMContentLoaded', function () {
                var elems = document.querySelectorAll('select');
                // var instances = M.FormSelect.init(elems, options);
            });
        }
    },[url])
    const uploadPic = ()=>{
        
        const data = new FormData()
        data.append("file",image)
        data.append("upload_preset","insta")
        data.append("cloud_name","aniketjha172")
        fetch("https://api.cloudinary.com/v1_1/aniketjha172/image/upload",{
            method:"post",
            body:data
        })
        .then(res=>res.json())
        .then(data=>{
           setUrl(data.url)
        })
        .catch(err=>{
            console.log(err)
        })
    }
    const uploadFields = ()=>{
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html: "invalid email",classes:"#c62828 red darken-3"})
            return
        }
        fetch("/signup",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name,
                password,
                email,
                pic:url,
                dob
            })
        }).then(res=>res.json())
        .then(data=>{
           if(data.error){
              M.toast({html: data.error,classes:"#c62828 red darken-3"})
           }
           else{
            //    M.toast({html:data.message,classes:"#43a047 green darken-1"})
                setLoading(false)
                history.push('/signin')
           }
        }).catch(err=>{
            console.log(err)
        })
    }
    const PostData = ()=>{
        setLoading(true)
        if(image){
            uploadPic()
        }else{
            uploadFields()
        }
       
    }

   return (
     <div className="signup">
       <div className="card signup_card">
           <h2>StackUnderFlow</h2>
           <br/>
           <input
             type="text"
             placeholder="name"
             value={name}
             onChange={(e) => setName(e.target.value)}
           />
           <br/>
           <input
             type="text"
             placeholder="email"
             value={email}
             onChange={(e) => setEmail(e.target.value)}
           />
           <br/>
           <input
             type="password"
             placeholder="password"
             value={password}
             onChange={(e) => setPasword(e.target.value)}
           />
           <br/>
           <DatePicker
             selected={dob}
             onChange={(date) => setDob(date)}
             placeholderText="DOB"
             isClearable
             showMonthDropdown
             showYearDropdown
           />
           <br/>
            <p>
            Already have an account? &nbsp;
            <Link to="/signin">SignIn</Link>
          </p>

           <button
             type="button" className="btn btn-primary"
             onClick={() => PostData()}
           >
            SignUp
           </button>
         </div>
       </div>
   );
}


export default SignIn