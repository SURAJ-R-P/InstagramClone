import { useEffect } from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom"
import Login from "./pages/login";
import Register  from "./pages/register";
import PageRender from "./customRouter/PageRender";
import PrivateRouter from "./customRouter/PrivateRouter";
import Home from "./pages/home";
import Header from "./components/header/Header";
import Alert from "./components/alert/Alert";
import StatusModel from "./components/StatusModel";
import { getPosts } from "./redux/actions/postAction"
import { getSuggestions } from './redux/actions/suggestionsAction'
import io from 'socket.io-client'
import SocketClient from "./SocketClient";
import { GLOBALTYPES } from "./redux/actions/globalTypes";
import { getNotifies } from "./redux/actions/notifyAction";
import { useSelector, useDispatch } from "react-redux";
import { refreshToken } from "./redux/actions/authAction";
import CallModel from "./components/message/CallModel";
import Peer from 'peerjs'

function App() {
  const { auth, status, model, call } = useSelector(state => state)
  const dispatch = useDispatch()

  useEffect(()=> {
    dispatch(refreshToken())
    const socket = io()
    dispatch({type: GLOBALTYPES.SOCKET, payload: socket})
    return () => socket.close()
  },[dispatch])

  useEffect(()=>{
    if(auth.token){
      dispatch(getPosts(auth.token))
      dispatch(getSuggestions(auth.token))
      dispatch(getNotifies(auth.token))
    }
  },[dispatch, auth.token])

  useEffect(() => {
    const newPeer = new Peer(undefined, {
      path: '/', secure: true
    })
    
    dispatch({ type: GLOBALTYPES.PEER, payload: newPeer })
  },[dispatch])

  useEffect(() => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
        }
      });  
    }
  },[])

  return (
  <Router>
      <Alert/>
      <input type="checkbox" id="theme" />
      <div className={`App ${(status || model) && 'mode'}`}>
        <div className="main">
          {auth.token && <Header/>}
          {status && <StatusModel />}
          {auth.token && <SocketClient />}
          {call && <CallModel />}
          <Routes>
            <Route exact path="/" element={auth.token ? <Home/> : < Login/>} />
            <Route exact path="/register" element={<Register/>}/>
              <Route element={<PrivateRouter />}>
                <Route exact path="/:page" element={<PageRender/>}/>
                <Route exact path="/:page/:id" element={<PageRender/>} />
              </Route>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
