import React, {useState} from 'react';
import {LOGIN_URL} from '../config.json';
import httpService from "../services/httpService";
import './Login.css'

function Login(props) {

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("");
    const [showProgress, setShowProgress] = useState(false);
    const [message, setMessage] = useState("")

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        await doSubmit()

    }

    const doSubmit = async () => {
        try {
            const body = {username, password}
            setShowProgress(true)
            const {data: jwt} = await httpService.post(LOGIN_URL, body);
            localStorage.setItem("token", jwt);
            window.location = "/"

        } catch (ex) {
            if (ex.response && ex.response.data) {
                setMessage(ex.response.data)
            } else {
                setMessage(ex.message)
            }
        } finally {
            setShowProgress(false)
        }
    }


    return (
        <div className="login-body-container">
            <div className="header">
                <h1>Network Report</h1>
            </div>
            <div className="login-main-container">
                <div className="login-container">
                    <div className="form">
                        {message &&
                        <small className="login-error"><i className="fas fa-exclamation-triangle"/>{message}</small>}
                        <form onSubmit={handleFormSubmit}>
                            <div className="login-form-control textbox">
                                <i className="fas fa-user"/>
                                <input type="text" name="username" placeholder="Username" value={username}
                                       onChange={event => setUsername(event.target.value)} required/>
                            </div>
                            <div className="login-form-control textbox">
                                <i className="fas fa-lock"/>
                                <input type="password" name="password" placeholder="Password" value={password}
                                       onChange={event => setPassword(event.target.value)} required/>
                            </div>
                            {showProgress && <div className="progressIndicator">
                                <img src="/images/ajax-loader.gif" alt="Processing"/>
                            </div>}

                            <div className="login-form-control">
                                <input type="submit" className="login-btn" value="Login"/>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Login;