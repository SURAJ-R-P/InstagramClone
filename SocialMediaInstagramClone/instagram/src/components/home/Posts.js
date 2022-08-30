import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import PostCard from '../PostCard'
import LoadIcon from '../../images/loading.gif'
import LoadMoreBtn from '../LoadMoreBtn'
import { getDataAPI } from '../../utils/fetchData'
import { POST_TYPES } from '../../redux/actions/postAction'

const Posts = () => {
    const { homePosts, auth, theme } = useSelector(state => state)
    const [load, setLoad] = useState(false)
    const dispatch = useDispatch()

    const handleLoadMore = async () => {
        setLoad(true)
        const res = await getDataAPI(`posts?limit=${homePosts.page * 9}`, auth.token)
        // console.log(res)
        dispatch({
            type: POST_TYPES.GET_POSTS, 
            payload: {...res.data, page: homePosts.page + 1}
        })
        setLoad(false)
    }

    return (
        <div className='posts'>            
            {
                homePosts.posts.map(post => (
                    <PostCard key={post._id} post={post} theme={theme} />
                ))
            }
            {
                load && <img src={LoadIcon} alt="loading" className="d-block mx-auto" style={{borderRadius:"100%",width:"50px",height:"50px"}} />
            }
            <LoadMoreBtn result={homePosts.result} page={homePosts.page}
            load={load} handleLoadMore={handleLoadMore} />    
        </div>
    )
}

export default Posts