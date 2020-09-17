/* eslint-disable */
import React,{useState,useEffect,useContext} from 'react'
import {UserContext} from '../../App'
import {Link} from 'react-router-dom'
import "./Home.css"
import M from 'materialize-css'
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import {IconButton } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import useLoader from "../Loader/useLoader";
const Home  = ()=>{
    const [data,setData] = useState([])
    const {state,dispatch} = useContext(UserContext)
    const [body, setBody] = useState("")
    const [image, setImage] = useState("")
    const [url, setUrl] = useState("")
    const [loader, showLoader, hideLoader] = useLoader();
    useEffect(()=>{
        
       fetch('/allpost',{
           headers:{
               "Authorization":"Bearer "+localStorage.getItem("jwt")
           }
       }).then(res=>res.json())
       .then(result=>{
        //    console.log(localStorage.getItem("user").name);
            // console.log(result)
           setData(result.posts)
           
       })
    },[url,data])

    const likePost = (id)=>{
          fetch('/like',{
              method:"put",
              headers:{
                  "Content-Type":"application/json",
                  "Authorization":"Bearer "+localStorage.getItem("jwt")
              },
              body:JSON.stringify({
                  postId:id
              })
          }).then(res=>res.json())
          .then(result=>{
                   //   console.log(result)
            const newData = data.map(item=>{
                if(item._id===result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newData)
          }).catch(err=>{
              console.log(err)
          })
    }

    const unlikePost = (id)=>{
          fetch('/unlike',{
              method:"put",
              headers:{
                  "Content-Type":"application/json",
                  "Authorization":"Bearer "+localStorage.getItem("jwt")
              },
              body:JSON.stringify({
                  postId:id
              })
          }).then(res=>res.json())
          .then(result=>{
            //   console.log(result)
            const newData = data.map(item=>{
                if(item._id===result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newData)
          }).catch(err=>{
            console.log(err)
        })
    }

    const makeComment = (text,postId)=>{
          fetch('/comment',{
              method:"put",
              headers:{
                  "Content-Type":"application/json",
                  "Authorization":"Bearer "+localStorage.getItem("jwt")
              },
              body:JSON.stringify({
                  postId,
                  text
              })
          }).then(res=>res.json())
          .then(result=>{
            //   console.log(result)
              const newData = data.map(item=>{
                if(item._id===result._id){
                    return result
                }else{
                    return item
                }
             })
            setData(newData)
          }).catch(err=>{
              console.log(err)
          })
    }

    const deletePost = (postid)=>{
        fetch(`/deletepost/${postid}`,{
            method:"delete",
            headers:{
                Authorization:"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            // console.log(result)
            const newData = data.filter(item=>{
                return item._id !== result._id
            })
            setData(newData)
        })
    }

    useEffect(() => {
        if (url) {
            fetch("/createpost", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    body,
                    pic: url
                })
            }).then(res => res.json())
                .then(data => {

                    if (data.error) {
                        M.toast({ html: data.error, classes: "#c62828 red darken-3" })
                    }
                    else {
                        setBody("")
                        setImage("")
                        setUrl("")
                        M.toast({ html: "Created post Successfully", classes: "#43a047 green darken-1" })
                        fetch('/allpost', {
                            headers: {
                                "Authorization": "Bearer " + localStorage.getItem("jwt")
                            }
                        }).then(res => res.json())
                            .then(result => {
                                // console.log(result)
                                hideLoader()
                                setData(result.posts)

                            })
                    }
                }).catch(err => {
                    console.log(err)
                })
        }
    }, [url])

    const postDetails = () => {
        showLoader()
        const data = new FormData()
        data.append("file", image)
        data.append("upload_preset", "insta")
        data.append("cloud_name", "aniketjha172")
        fetch("https://api.cloudinary.com/v1_1/aniketjha172/image/upload", {
            method: "post",
            body: data
        })
            .then(res => res.json())
            .then(data => {
                setUrl(data.url)
            })
            .catch(err => {
                console.log(err)
            })
    }

   return (
     <div className="home">

       <div className="createpost">
         <div className="card createpost_card">
           <input
             type="text"
             placeholder="body"
             value={body}
             onChange={(e) => setBody(e.target.value)}
           />
           <br />
           <input
             type="file"
             className="form-control-file"
             id="exampleFormControlFile1"
             onChange={(e) => setImage(e.target.files[0])}
           />
           <br />

           <button
             type="button"
             className="btn btn-primary"
             onClick={() => postDetails()}
           >
             Post
           </button>
         </div>
       </div>
       
       {data.map((item) => {
         return (
           <div className="card home_card" key={item._id}>
             <h5 className="card-title postUser">
              <img src={item.postedBy.pic} alt="" className="userProfilePic"/> &nbsp;
               <Link
                 to={
                   item.postedBy._id !== state._id
                     ? "/profile/" + item.postedBy._id
                     : "/profile"
                 }
               >
                 {item.postedBy.name}
               </Link>

               {item.postedBy._id === state._id && (
                 
                 <IconButton onClick={() => deletePost(item._id)} style={{float:"right"}}>
                   <DeleteIcon/>
                 </IconButton>
               )}
             </h5>
             <p className="card-text postTitle">
               <i>{item.body}</i>
             </p>
             <img className="card-img-top" src={item.photo} alt="uploaded" />
             <div className="card-body">
               {item.likes.includes(state._id) ? (
                 <IconButton onClick={() => {
                     unlikePost(item._id);
                   }}>
                   <ThumbDownIcon/>
                 </IconButton>
               ) : (
                 <IconButton onClick={() => {
                     likePost(item._id);
                   }}>
                   <ThumbUpIcon/>
                 </IconButton>
               )}

               <h6>{item.likes.length} likes</h6>

               <p className="card-text">
                 {item.comments.map((record) => {
                   return (
                     <h6 key={record._id}>
                       <span style={{ fontWeight: "500" }}>
                         {record.postedBy.name}
                       </span>
                       {record.text}
                     </h6>
                   );
                 })}
               </p>
             </div>

             <ul className="list-group list-group-flush">
               <li className="list-group-item">
                 <form
                   onSubmit={(e) => {
                     e.preventDefault();
                     makeComment(e.target[0].value, item._id);
                   }}
                  >
                  <input
                     className="home_comments"
                     type="text"
                     placeholder="comments"
                  />
                 </form>
               </li>
             </ul>
           </div>
         )
        })}
        {loader}
     </div>
   )
}

export default Home