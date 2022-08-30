import React, { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { login } from "../redux/actions/authAction" 
import { useSelector, useDispatch } from "react-redux"

const Login = () =>{
    const initialState = { email_id : "" , password : ""}
    const [userData, setUserData] = useState(initialState)
    const {email_id , password} = userData

    const [typePass, setTypePass] = useState(false)

    const { auth } = useSelector(state => state)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() =>{
        if(auth.token) navigate("/") 
    },[auth.token,navigate])

    const handleChangeInput = e => {
        const { name, value} = e.target
        setUserData({...userData, [name]:value})
    }

    const handleSubmit = e => {
        e.preventDefault()
        // console.log(userData)
        dispatch(login(userData))
    }

    return(
        <div className="authLogin">
            <form onSubmit={handleSubmit}>
                <h1 className="text-uppercase text-center mb-3" style={{background:"linear-gradient(to left,#405DE6,#5851D8,#833AB4,#C13584,#E1306C,#FD1D1D,#F56040,#F77737,#FCAF45,#FFDC80,#FFFFFF)", color:"transparent",WebkitBackgroundClip:"text", fontFamily:"Fira Sans sans-serif", fontWeight:"700", WebkitTextStroke:"0.1px black"}}>InstaChat</h1>
                <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" onChange={handleChangeInput} value={email_id} name="email_id"/>
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                    <div className="passShowHide">
                        <input type={ typePass ? "text" : "password" } className="form-control" id="exampleInputPassword1" autoComplete="off" onChange={handleChangeInput} value={password} name="password"/>
                        <p onClick={() => setTypePass(!typePass)}>{typePass ? "Hide" : "Show"}</p>
                    </div>
                </div>
                <button type="submit" className="btn btn-dark w-100" disabled={email_id && password ? false : true}>Login</button>
                <p className="my-3">
                    You don't have an account? <Link to="/register" className="text-danger text-decoration-none">Register Now</Link>
                </p>
                </form>
        </div>
    )
}

export default Login