import { GLOBALTYPES } from "./globalTypes"
import { postDataAPI } from "../../utils/fetchData"
import valid from "../../utils/valid"

export const login = (data) => async (dispatch) => {
    try {
    //    console.log(data)
         dispatch({ 
            type : GLOBALTYPES.ALERT, 
            payload : {
                loading : true
            } 
        })
        const response = await postDataAPI("login", data)
        // console.log(response)
        dispatch({ 
            type : GLOBALTYPES.AUTH, 
            payload : {
                token : response.data.access_token,
                user : response.data.user
            } 
        })
        localStorage.setItem("firstLogin",true)

        dispatch({ 
            type : GLOBALTYPES.ALERT,  
            payload : {
                success : response.data.msg
            } 
        })
   }
   catch (err)
   {
    dispatch({ 
        type : "NOTIFY", 
        payload : {
            error : err.response.data.msg
        } 
    })
   }
}

export const refreshToken = () => async (dispatch) => {
    const firstLogin = localStorage.getItem("firstLogin")
    if(firstLogin)
    {
        dispatch({ type:  GLOBALTYPES.ALERT, payload: {loading: true} })

        try 
        {
            const response = await postDataAPI("refresh_token")
            dispatch({ 
                type: GLOBALTYPES.AUTH, 
                payload : {
                    token : response.data.access_token,
                    user : response.data.user
                } 
            })
            dispatch({ type:  GLOBALTYPES.ALERT, payload: {} })

        }
        catch (err) 
        {
            dispatch({ 
                type :  GLOBALTYPES.ALERT, 
                payload : {
                    error : err.response.data.msg
                } 
            })
        }
    }
}

export const register = (data) => async (dispatch) =>{
    const check = valid(data)
    // console.log(check)
    if(check.errLength > 0)
    return dispatch({type: GLOBALTYPES.ALERT, payload: check.errMsg})
    
    try 
    {
        dispatch({type: GLOBALTYPES.ALERT, payload: {loading: true}})

        const response = await postDataAPI("register", data)
        // console.log(response)
        dispatch({ 
            type : GLOBALTYPES.AUTH, 
            payload : {
                token : response.data.access_token,
                user : response.data.user
            } 
        })
        localStorage.setItem("firstLogin",true)

        dispatch({ 
            type : GLOBALTYPES.ALERT, 
            payload : {
                success : response.data.msg
            } 
        })
    }
    catch (err)
    {
        dispatch({ 
            type : GLOBALTYPES.ALERT, 
            payload : {
                error : err.response.data.msg
            } 
        })
    }
}

export const logout = () => async (dispatch) => {
    try{
        localStorage.removeItem("firstLogin")
        await postDataAPI("logout")
        window.location.href = "/"
    }
    catch (err)
    {
        dispatch({ 
            type : GLOBALTYPES.ALERT, 
            payload : {
                error : err.response.data.msg
            } 
        }) 
    }
}