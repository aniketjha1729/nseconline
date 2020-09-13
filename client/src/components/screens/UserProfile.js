import React,{useEffect,useState,useContext} from 'react'
import {UserContext} from '../../App'
import {useParams} from 'react-router-dom'
import "./Profile.css"


const Profile  = ()=>{
    const [userProfile,setProfile] = useState(null)
    
    const {state,dispatch} = useContext(UserContext)
    const {userid} = useParams()
    const [showfollow,setShowFollow] = useState(state?!state.following.includes(userid):true)
    useEffect(()=>{
       fetch(`/user/${userid}`,{
           headers:{
               "Authorization":"Bearer "+localStorage.getItem("jwt")
           }
       }).then(res=>res.json())
       .then(result=>{
           //console.log(result)
         
            setProfile(result)
       })
    },[])


    const followUser = ()=>{
        fetch('/follow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                followId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
        
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
             localStorage.setItem("user",JSON.stringify(data))
             setProfile((prevState)=>{
                 return {
                     ...prevState,
                     user:{
                         ...prevState.user,
                         followers:[...prevState.user.followers,data._id]
                        }
                 }
             })
             setShowFollow(false)
        })
    }
    const unfollowUser = ()=>{
        fetch('/unfollow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                unfollowId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
            
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
             localStorage.setItem("user",JSON.stringify(data))
            
             setProfile((prevState)=>{
                const newFollower = prevState.user.followers.filter(item=>item != data._id )
                 return {
                     ...prevState,
                     user:{
                         ...prevState.user,
                         followers:newFollower
                        }
                 }
             })
             setShowFollow(true)
             
        })
    }
   return (
     <div>
       {userProfile ? (
         <div className="container profile">
           <div className="profile_details">
             <div className="row">
               <div className="col-4">
                 <img
                   src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80"
                   alt=""
                   className="profile_image"
                 />
               </div>
               <div className="col-8">
                 <div className="row">
                   <div className="col">
                     <h4>{userProfile.user.name}</h4>
                     <h5>{userProfile.user.email}</h5>
                   </div>
                 </div>
                 <div className="row">
                   <div className="col-4">
                     <h6>{userProfile.posts.length} posts</h6>
                   </div>
                   <div className="col-4">
                     <h6>{userProfile.user.followers.length} followers</h6>
                   </div>
                   <div className="col-4">
                     <h6>{userProfile.user.following.length} following</h6>
                   </div>
                 </div>
                 <div className="row profile_aboutPc">
                   <div className="col">
                     Lorem ipsum dolor sit amet, consectetur adipisicing
                     elit.ficiis earum at sunt, soluta aliquid voluptas deleniti
                     corrupti.
                   </div>
                   <div className="col">
                     {showfollow ? (
                       <button
                         type="button"
                         className="btn btn-primary"
                         onClick={() => followUser()}
                       >
                         Follow
                       </button>
                     ) : (
                       <button
                         type="button"
                         className="btn btn-primary"
                         onClick={() => unfollowUser()}
                       >
                         UnFollow
                       </button>
                     )}
                   </div>
                 </div>
               </div>
               <div className="row profile_aboutMobile">
                 <div className="col">
                   Lorem ipsum dolor sit amet, consectetur adipisicing
                   elit.ficiis earum at sunt, soluta aliquid voluptas deleniti
                   corrupti.
                 </div>
                 <div className="col">
                   {showfollow ? (
                     <button
                       type="button"
                       className="btn btn-primary"
                       onClick={() => followUser()}
                     >
                       Follow
                     </button>
                   ) : (
                     <button
                       type="button"
                       className="btn btn-primary"
                       onClick={() => unfollowUser()}
                     >
                       UnFollow
                     </button>
                   )}
                 </div>
               </div>
             </div>
           </div>

           <div className="profile_gallery">
             <div className="row">
             {userProfile.posts.map((item=>{
                return (
                  <div key={item._id} className="col-4">
                    <img
                      className="profile_galleryimage"
                      src={item.photo}
                      alt={item.title}
                    />
                  </div>
                )
             }))}
             </div>
           </div>
         </div>
       ) : (
         <h2>loading...!</h2>
       )}
     </div>
   );
}


export default Profile