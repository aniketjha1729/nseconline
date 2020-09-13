import React,{useEffect,useState,useContext} from 'react'
import {UserContext} from '../../App'
import "./Profile.css"

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
           console.log(result)
           setPics(result.mypost)
       })
    },[])

    useEffect(()=>{
       if(image){
        const data = new FormData()
        data.append("file",image)
        data.append("upload_preset","insta-clone")
        data.append("cloud_name","cnq")
        fetch("https://api.cloudinary.com/v1_1/cnq/image/upload",{
            method:"post",
            body:data
        })
        .then(res=>res.json())
        .then(data=>{
           fetch('/updatepic',{
               method:"put",
               headers:{
                   "Content-Type":"application/json",
                   "Authorization":"Bearer "+localStorage.getItem("jwt")
               },
               body:JSON.stringify({
                   pic:data.url
               })
           }).then(res=>res.json())
           .then(result=>{
               console.log(result)
               localStorage.setItem("user",JSON.stringify({...state,pic:result.pic}))
               dispatch({type:"UPDATEPIC",payload:result.pic})
               //window.location.reload()
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
             <img
               className="profile_image"
               alt="profilepic"
               src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80"
             />
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