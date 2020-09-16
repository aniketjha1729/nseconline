/* eslint-disable */
import React,{useEffect,useState,useContext} from 'react'
import {UserContext} from '../../App'
import "./Profile.css"
import { json } from 'body-parser'

const Profile  = ()=>{
    const [mypics,setPics] = useState([])
    const {state,dispatch} = useContext(UserContext)
    const [image,setImage] = useState("")
    useEffect(()=>{
       fetch('/mypost',{
           headers:{
               "Authorization":"Bearer "+localStorage.getItem("jwt")
           }
       }).then(res=>res.json())
       .then(result=>{
          //  console.log(result)
           setPics(result.mypost)
       })
    },[])

    useEffect(()=>{
       if(image){
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
          // console.log(data)
          localStorage.setItem("user",JSON.stringify({...state,pic:data.url}))
          dispatch({ type:"UPDATEPIC",payload:data.url})
          fetch("/updatepic",{
            method:"put",
            headers:{
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("jwt")
            },body:JSON.stringify({
              pic:data.url
            })
          }).then(res=>res.json())
          .then(result=>{
            console.log(result)
            localStorage.setItem("user",JSON.stringify({...state,pic:result.pic}))
            dispatch({ type:"UPDATEPIC",payload:result.pic})
          })
        })
        .catch(err=>{
            console.log(err)
        })
       }
    },[image])

    const updatePhoto = (file)=>{
        setImage(file)
    }

   return (
     <div className="container profile">
       <div className="profile_details">
         <div className="row">
           <div className="col-4">
            <div className="row">
              <div className="col">
                 <img
                   className="profile_image"
                   alt="profilepic"
                   src={state ? state.pic : ""}
                 />
              </div>
            </div>
            <div className="row">
               <div className="col">
                 <input
                   type="file"
                   className="form-control-file"
                   id="exampleFormControlFile1"
                   onChange={(e) => updatePhoto(e.target.files[0])}
                 />
                </div>
            </div>
             
              
           </div>
           <div className="col-8">
             <div className="row">
               <div className="col">
                 <h4>{state ? state.name : "loading"}</h4>
               </div>
             </div>
             <div className="row">
               <div className="col-4">Posts:{mypics.length}</div>
               <div className="col-4">
                 Followers:{state ? state.followers.length : "0"}
               </div>
               <div className="col-4">
                 Following:{state ? state.following.length : "0"}
               </div>
             </div>
             <div className="row profile_aboutPc">
               <div className="col">
                 Lorem ipsum dolor sit amet, consectetur adipisicing elit.ficiis
                 earum at sunt, soluta aliquid voluptas deleniti corrupti.
               </div>
             </div>
           </div>
         </div>

         <div className="row profile_aboutMobile">
           <div className="col">
             Lorem ipsum dolor sit amet, consectetur adipisicing elit.ficiis
             earum at sunt, soluta aliquid voluptas deleniti corrupti.
           </div>
         </div>
       </div>

       <div className="profile_gallery">
         <div className="row">
           {mypics.map((item) => {
             return (
               <div key={item._id} className="col-4">
                 <img
                   className="profile_galleryimage"
                   src={item.photo}
                   alt={item.title}
                 />
               </div>
             );
           })}
         </div>
       </div>
     </div>
   );
}


export default Profile