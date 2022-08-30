import React, { useState, useEffect } from "react"
import { useSelector, useDispatch} from "react-redux"
import { useNavigate, Link } from "react-router-dom"
import { register } from "../redux/actions/authAction"

const Register = () =>{
    const { auth, alert } = useSelector(state => state)
    const dispatch = useDispatch()

    const navigate = useNavigate()

    const initialState = { full_name:"", user_name:"", email_id : "" , password : "", cf_password:"", gender:"male"}
    const [userData, setUserData] = useState(initialState)
    const {full_name, user_name, email_id, password, cf_password, gender} = userData

    const [typePass, setTypePass] = useState(false)
    const [typeCfPass, setTypeCfPass] = useState(false)
    
    useEffect(() =>{
        if(auth.token) navigate("/") 
    },[auth.token,navigate])

    const handleChangeInput = e => {
        const { name, value } = e.target
        setUserData({...userData, [name]:value})
    }

    const handleSubmit = e => {
        e.preventDefault()
        dispatch(register(userData))
    }

    return(
        <div className="authLogin">
            <form onSubmit={handleSubmit}>
                <h1 className="text-uppercase text-center mb-3" style={{background:"linear-gradient(to left,#405DE6,#5851D8,#833AB4,#C13584,#E1306C,#FD1D1D,#F56040,#F77737,#FCAF45,#FFDC80,#FFFFFF)", color:"transparent",WebkitBackgroundClip:"text", fontFamily:"Fira Sans sans-serif", fontWeight:"700", WebkitTextStroke:"0.1px black"}}>InstaChat</h1>
                <div className="mb-2">
                    <label htmlFor="exampleInputFullName1" className="form-label">Full Name</label>
                    <input type="text" className="form-control" id="exampleInputFullName1" aria-describedby="FullNamelHelp" onChange={handleChangeInput} value={full_name} name="full_name" style={{background: `${alert.full_name ? '#fd2d6a14' : ''}`}}/>
                    <div id="FullNamelHelp" className="form-text text-danger">{alert.full_name ? alert.full_name: ''}</div>
                </div>
                <div className="mb-2">
                    <label htmlFor="exampleInputUserName1" className="form-label">User Name</label>
                    <input type="text" className="form-control" id="exampleInputUserName1" aria-describedby="UserNamelHelp" onChange={handleChangeInput} value={user_name.toLowerCase().replace(/ /g, '')} name="user_name" style={{background: `${alert.user_name ? '#fd2d6a14' : ''}`}}/>
                    <div id="UserNamelHelp" className="form-text text-danger">{alert.user_name ? alert.user_name: ''}</div>
                </div>
                <div className="mb-2">
                    <label htmlFor="exampleInputEmail1" className="form-label">Email Id</label>
                    <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" onChange={handleChangeInput} value={email_id} name="email_id" style={{background: `${alert.email_id ? '#fd2d6a14' : ''}`}}/>
                    <div id="emailHelp" className="form-text text-danger">{alert.email_id ? alert.email_id: ''}</div>
                </div>
                <div className="mb-2">
                    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                    <div className="passShowHide">
                        <input type={ typePass ? "text" : "password" } className="form-control" id="exampleInputPassword1" autoComplete="off" aria-describedby="PasswordHelp" onChange={handleChangeInput} value={password} name="password" style={{background: `${alert.password ? '#fd2d6a14' : ''}`}}/>
                        <div id="PasswordHelp" className="form-text text-danger">{alert.password ? alert.password: ''}</div>
                        <p onClick={() => setTypePass(!typePass)}>{typePass ? "Hide" : "Show"}</p>
                    </div>
                </div>
                <div className="mb-2">
                    <label htmlFor="exampleInputConfirmPassword1" className="form-label">Confirm Password</label>
                    <div className="passShowHide">
                        <input type= { typeCfPass ? "text" : "password" } className="form-control" id="exampleInputConfirmPassword1" autoComplete="off" aria-describedby="ConfirmPasswordHelp" onChange={handleChangeInput} value={cf_password} name="cf_password" style={{background: `${alert.cf_password ? '#fd2d6a14' : ''}`}}/>
                        <div id="ConfirmPasswordHelp" className="form-text text-danger">{alert.cf_password ? alert.cf_password: ''}</div>
                        <p onClick={() => setTypeCfPass(!typeCfPass)}>{typeCfPass ? "Hide" : "Show"}</p> 
                    </div>
                </div>
                <div className="mb-2">
                    <label htmlFor="exampleInputGender1" className="form-label">Gender</label>
                    <select className="form-select" id="exampleInputGender1" onChange={handleChangeInput} value={gender} name="gender">
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-dark w-100">Register</button>
                <p className="my-3">
                    Already have an account? <Link to="/" className="text-danger text-decoration-none">Login Now</Link>
                </p>
                </form>
        </div>
    )
}

export default Register;