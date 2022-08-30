import React, { useState, useEffect } from 'react'
import Avatar from '../Avatar'
import EditProfile from './EditProfile'
import FollowBtn from '../FollowBtn'
import Followers from './Followers'
import Following from './Following'
import { GLOBALTYPES } from '../../redux/actions/globalTypes'

const Info = ({id, auth, profile, dispatch}) => {
    // console.log(useParams())
    const [ userData, setUserData ] = useState([])
    const [ onEdit, setOnEdit ] = useState(false)

    const [ showFollowers, setShowFollowers ] = useState(false)
    const [ showFollowing, setShowFollowing ] = useState(false)

    useEffect(() => {
        if(id === auth.user._id){
            setUserData([auth.user])
        }else{
            const newData = profile.users.filter(user => user._id === id)
            setUserData(newData)
        }
    }, [id, auth, dispatch, profile.users])

    useEffect(() =>{
        if(showFollowers || showFollowing || onEdit){
            dispatch({ type: GLOBALTYPES.MODEL, payload: true})
        }else{
            dispatch({ type: GLOBALTYPES.MODEL, payload: false})
        }
    },[showFollowers, showFollowing, onEdit, dispatch ])

    return (
        <div className='info'>
            {
                userData.map(user => (
                    <div className='info_container' key={user._id}>
                        <Avatar src={user.avatar} size="verybig-avatar" />

                        <div className='info_content'>
                            <div className='info_content_title'>
                                <h2>{user.user_name}</h2>
                                {
                                    user._id === auth.user._id
                                    ? <button className='btn btn-outline-info btn-sm' onClick={() => setOnEdit(true)}>
                                        Edit Profile
                                    </button>
                                    : 
                                    <FollowBtn user={user} />
                                }
                            </div>

                            <div className='follow_btn'>
                                <span style={{marginRight:"10px"}} onClick={() => setShowFollowers(true)}>
                                    {user.followers.length} Followers
                                </span>
                                <span style={{marginLeft:"10px"}} onClick={() => setShowFollowing(true)}>
                                    {user.following.length} Following
                                </span >
                            </div>

                            <h6>{user.full_name} <span className='text-info'>{user.mobile_no}</span></h6>
                            <p className='m-0'>{user.address}</p>
                            <h6 className='m-0'>{user.email_id}</h6>
                            <a href={user.website} target="_blank" rel="noreferrer">{user.website}</a>
                            <p>{user.story}</p>
                        </div>

                        {
                            onEdit && <EditProfile setOnEdit={setOnEdit}/>
                        }
                        {
                            showFollowers && 
                            <Followers 
                            users={user.followers} 
                            setShowFollowers={setShowFollowers} 
                            />
                        }
                        {
                            showFollowing && 
                            <Following 
                            users={user.following} 
                            setShowFollowing={setShowFollowing} 
                            />
                        }
                    </div>
                ))
            }
        </div>
    )
}

export default Info