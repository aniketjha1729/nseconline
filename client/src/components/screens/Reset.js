/* eslint-disable */
import React, { useState} from "react";
import { useHistory } from "react-router-dom";
import useLoader from "../Loader/useLoader";
import "./SignIn.css";
import M from "materialize-css";

const Reset = () => {
  
  const history = useHistory();
   const [loader, showLoader, hideLoader] = useLoader();
  const [email, setEmail] = useState("")
  const [errormsg, setErrormsg] = useState("")
  const [successmsg, setSuccessmsg] = useState("")
  
  const PostData = () => {
    showLoader()
    if (
      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      setErrormsg("Invalid Email");
      hideLoader();
      return;
    }
    fetch("/reset-password", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data)
        if (data.error) {
          setErrormsg(data.error)
          setSuccessmsg("")
          hideLoader()
        } else {
          setSuccessmsg(data.message)
          hideLoader()
          setEmail("")
          setErrormsg("")
          // history.push("/signin")
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const gotoSignUp = () => {
    history.push("/signup");
  };

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

        {successmsg ? (
          <div
            class="alert alert-success alert-dismissible fade show"
            role="alert"
          >
            {successmsg}
            <button
              type="button"
              class="close"
              data-dismiss="alert"
              aria-label="Close"
              onClick={() => setSuccessmsg("")}
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
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => PostData()}
        >
          Reset Password
        </button>
        <br />
      </div>
      {loader}
    </div>
  );
};

export default Reset;
