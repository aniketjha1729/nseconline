import React,{useState,useEffect,useContext} from 'react'
import {UserContext} from '../../App'
import {Link} from 'react-router-dom'
import "./Home.css"
import M from 'materialize-css'
import { useHistory } from 'react-router-dom'
const Home  = ()=>{
    const [data,setData] = useState([])
    const [loading, setLoading] = useState(false)
    const {state,dispatch} = useContext(UserContext)
    const history = useHistory()
    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [image, setImage] = useState("")
    const [url, setUrl] = useState("")
    useEffect(()=>{
        
       fetch('/allpost',{
           headers:{
               "Authorization":"Bearer "+localStorage.getItem("jwt")
           }
       }).then(res=>res.json())
       .then(result=>{
        //    console.log(localStorage.getItem("user").name);
            // console.log(result.name)
           setData(result.posts)
           
       })
    },[url])

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
                if(item._id==result._id){
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
                if(item._id==result._id){
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
                if(item._id==result._id){
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
                    title,
                    body,
                    pic: url
                })
            }).then(res => res.json())
                .then(data => {

                    if (data.error) {
                        M.toast({ html: data.error, classes: "#c62828 red darken-3" })
                    }
                    else {
                        setLoading(false)
                        setTitle("")
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
                                setData(result.posts)

                            })
                    }
                }).catch(err => {
                    console.log(err)
                })
        }
    }, [url])

    const postDetails = () => {
        setLoading(true)
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
             placeholder="title"
             value={title}
             onChange={(e) => setTitle(e.target.value)}
           />
           <br />
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
             <h5 className="card-title">
               <Link
                 to={
                   item.postedBy._id !== state._id
                     ? "/profile/" + item.postedBy._id
                     : "/profile"
                 }
               >
                 {item.postedBy.name}
               </Link>

               {item.postedBy._id == state._id && (
                 <i
                   className="fas fa-trash"
                   style={{
                     float: "right",
                   }}
                   onClick={() => deletePost(item._id)}
                 ></i>
               )}
             </h5>
             <p className="card-text">
               <h6>{item.title}</h6>
               {item.body}
             </p>
             <img className="card-img-top" src={item.photo} alt="uploaded" />
             <div className="card-body">
               {item.likes.includes(state._id) ? (
                 <i
                   className="far fa-thumbs-down"
                   onClick={() => {
                     unlikePost(item._id);
                   }}
                 ></i>
               ) : (
                 <i
                   className="far fa-thumbs-up"
                   onClick={() => {
                     likePost(item._id);
                   }}
                 ></i>
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
     </div>
   )
}

export default Home