import {useState, useEffect} from 'react'
import './App.css';
import Home from "./components/Home";
import Login from "./components/Login";

function App() {

    const [isLogin, setLogin] = useState(false)
    useEffect(() =>{
        const jwt = localStorage.getItem("token");
        if (jwt) {
          setLogin(true)
        }

    },[isLogin])

    if (!isLogin) return <Login/>
    else return <Home/>
}

export default App;
