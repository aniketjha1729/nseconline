/* eslint-disable */
import React,{useState,useEffect} from 'react'
import {Link,useHistory} from 'react-router-dom'
import M from 'materialize-css'
import "./SignUp.css";
import useLoader from '../Loader/useLoader';

const SignIn  = ()=>{
    const history = useHistory()
    const [name,setName] = useState("")
    const [password,setPasword] = useState("")
    const [email,setEmail] = useState("")
    const [image,setImage] = useState("")
    const [dob,setDob] = useState("")
    const [gender,setGender] = useState("")
    const [url,setUrl] = useState(undefined)
    const [role,setRole]=useState("")
    const [department,setDepartment]=useState("")

    const [loader,showLoader,hideLoader]=useLoader()
    
    useEffect(()=>{
        if(url){
            uploadFields()
            document.addEventListener('DOMContentLoaded', function () {
                //var elems = document.querySelectorAll('select');
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
        fetch("/signup", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            password,
            email,
            pic: url,
            gender,
            role,
            department
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.error) {
              M.toast({ html: data.error, classes: "#c62828 red darken-3" });
            } else {
              //    M.toast({html:data.message,classes:"#43a047 green darken-1"})
              hideLoader();
              history.push("/signin");
            }
          })
          .catch((err) => {
            console.log(err);
          });
    }


    const PostData = ()=>{
        showLoader()
        if(image){
            uploadPic()
        }else{
            uploadFields()
        }
       
    }

   return (
     <div className="signup">
       <div className="card signup_card">
         <h2>NSEC Social</h2>
         <br />
         <input
           type="text"
           placeholder="name"
           value={name}
           onChange={(e) => setName(e.target.value)}
         />
         <br />
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
         <div className="row" onChange={(e) => setGender(e.target.value)}>
           <div className="col">
             <div className="form-check">
               <input
                 className="form-check-input"
                 type="radio"
                 name="gender"
                 id="exampleRadios1"
                 value="male"
               />
               Male
             </div>
           </div>
           <div className="col">
             <div className="form-check">
               <input
                 className="form-check-input"
                 type="radio"
                 name="gender"
                 id="exampleRadios2"
                 value="female"
               />
               Female
             </div>
           </div>
         </div>
         <br />
         <div className="row">
           <div className="col">
             <select
               className="form-control"
               id="exampleFormControlSelect1"
               onChange={(e) => setRole(e.target.value)}
             >
               <option defaultValue="Role">Role</option>
               <option value="faculty">Faculty</option>
               <option value="Student">Student</option>
             </select>
           </div>
           <div className="col">
             <select
               className="form-control"
               id="exampleFormControlSelect1"
               onChange={(e) => setDepartment(e.target.value)}
             >
               <option defaultValue="Department">Department</option>
               <option value="cse">CSE</option>
               <option value="it">IT</option>
               <option value="ee">EE</option>
               <option value="ece">ECE</option>
               <option value="civil">CIVIL</option>
               <option value="mech">Mech</option>
             </select>
           </div>
         </div>
         <br />
         {/* <input
           type="file"
           className="form-control-file"
           id="exampleFormControlFile1"
           onChange={(e) => setImage(e.target.files[0])}
         />
         <br /> */}
         <p>
           Already have an account? &nbsp;
           <Link to="/signin">SignIn</Link>
         </p>

         <button
           type="button"
           className="btn btn-primary"
           onClick={() => PostData()}
         >
           SignUp
         </button>
       </div>
       {loader}
     </div>
   );
}


export default SignIn