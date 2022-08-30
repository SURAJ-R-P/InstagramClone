import React,{ useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { checkImage } from '../../utils/imageUpload'
import { GLOBALTYPES } from '../../redux/actions/globalTypes'
import { updateProfileUser } from '../../redux/actions/profileAction' 

const EditProfile = ({setOnEdit}) => {
    const initState = {
        full_name: '' , user_name: '', email_id: '', mobile_no: '', address: '', website: '', story: '', gender: ''
    }
    const [ userData, setUserData] = useState(initState)
    const { full_name, user_name, email_id, mobile_no, address, website, story, gender } = userData

    const [ avatar, setAvatar ] = useState('')

    const { auth, theme } = useSelector(state => state)
    const dispatch = useDispatch()

    useEffect(() => {
        setUserData(auth.user)
    },[auth.user])

    const changeAvatar = (e) => {
        const file = e.target.files[0]
        const err = checkImage(file)
        // console.log(err)
        if (err) return dispatch({type: GLOBALTYPES.ALERT, payload: {error: err}})
        setAvatar(file)
    }

    const handleInput = e => {
        const { name, value } = e.target
        setUserData({...userData, [name]:value })
    }

    const handleSubmit = e => {
        e.preventDefault()
        dispatch(updateProfileUser({userData, avatar, auth}))
    }

    return (
        <div className='edit_profile'>
            <button className='btn btn-danger btn_close' onClick={() => setOnEdit(false)}>
                Close
            </button>

            <form onSubmit={handleSubmit}>
                <div className='info_avatar'>
                    <img src={avatar ? URL.createObjectURL(avatar) : auth.user.avatar } 
                    alt="avatar" style={{filter: theme ? 'invert(1)' : 'invert(0)'}}/>
                    <span>
                        <i className='fas fa-camera' />
                        <p>Change</p>
                        <input type="file" name='file' id='file_up' accept='image/*' onChange={changeAvatar} />
                    </span>
                </div>

                <div className='form-group'>
                    <label htmlFor='full_name'>Full Name</label>
                    <div className='position-relative'>
                        <input type="text" className='form-control' id='full_name' name='full_name' value={full_name} onChange={handleInput}/>
                        <small className='text-danger position-absolute' style={{top:"50%", right: "5px", transform: "translateY(-50%)"}}>{full_name.length}/25</small>
                    </div>
                </div>
                <div className='form_group'>
                    <label htmlFor='user_name'>User Name</label>
                    <input type="text" className='form-control' id='user_name' name='user_name' value={user_name} onChange={handleInput}/>
                </div>
                <div className='form_group'>
                    <label htmlFor='email_id'>Email Id</label>
                    <input type="email" className='form-control' id='email_id' name='email_id' value={email_id} onChange={handleInput}/>
                </div>
                <div className='form_group'>
                    <label htmlFor='mobile_no'>Mobile No.</label>
                    <input type="text" className='form-control' id='mobile_no' name='mobile_no' value={mobile_no} onChange={handleInput}/>
                </div>
                <div className='form_group'>
                    <label htmlFor='address'>Address</label>
                    <input type="text" className='form-control' id='address' name='address' value={address} onChange={handleInput}/>
                </div>
                <div className='form_group'>
                    <label htmlFor='website'>Website</label>
                    <input type="text" className='form-control' id='website' name='website' value={website} onChange={handleInput}/>
                </div>
                <div className='form_group'>
                    <label htmlFor='story'>Story</label>
                        <textarea cols="30" rows="4" className='form-control' id='story' name='story' value={story} onChange={handleInput}/>
                        <small className='text-danger' style={{display:"block", textAlign:"right"}}>{story.length}/250</small>
                </div>
                <label htmlFor='gender'>Gender</label>
                <div className='input-group-prepend px-0' style={{marginBottom:"4px"}}>
                    <select name='gender' id='gender' value={gender} className='custom-select text-capitalize' onChange={handleInput}>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <button className='btn btn-info w-100' type='submit'>Save</button>
            </form>
        </div>
    )
}

export default EditProfile;