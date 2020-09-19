/* eslint-disable */
import React,{useState,useEffect} from 'react'
import {Link,useHistory} from 'react-router-dom'
import "./SignUp.css";
import useLoader from '../Loader/useLoader';

const SignIn  = ()=>{
    const history = useHistory()
    const [name,setName] = useState("")
    const [password,setPasword] = useState("")
    const [email,setEmail] = useState("")
    const [gender,setGender] = useState("")
    const [role,setRole]=useState("")
    const [department,setDepartment]=useState("")
    const [errormsg, setErrormsg] = useState("");
    const [loader,showLoader,hideLoader]=useLoader()
    
    // useEffect(()=>{
    //     if(url){
    //         uploadFields()
    //         document.addEventListener('DOMContentLoaded', function () {
    //             //var elems = document.querySelectorAll('select');
    //             // var instances = M.FormSelect.init(elems, options);
    //         });
    //     }
    // },[url])


    // const uploadPic = ()=>{
    //     const data = new FormData()
    //     data.append("file",image)
    //     data.append("upload_preset","insta")
    //     data.append("cloud_name","aniketjha172")
    //     fetch("https://api.cloudinary.com/v1_1/aniketjha172/image/upload",{
    //         method:"post",
    //         body:data
    //     })
    //     .then(res=>res.json())
    //     .then(data=>{
    //        setUrl(data.url)
    //     })
    //     .catch(err=>{
    //         console.log(err)
    //     })
    // }

    const PostData = () => {
      showLoader()
      if (
        !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          email
        )
      ) {
        setErrormsg("Invalid Email")
        hideLoader()
        return;
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
          gender,
          role,
          department
        })
      }).then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data.error) {
            setErrormsg(data.error)
            hideLoader()
          } else {
            hideLoader()
            history.push("/signin");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };


    

   return (
     <div className="signup">
       <div className="card signup_card">
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
               onClick={()=>setErrormsg("")}
             >
               <span aria-hidden="true">&times;</span>
             </button>
           </div>
         ) : (
           ""
         )}
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