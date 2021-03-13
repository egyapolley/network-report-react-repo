import React, {Component} from 'react';
import Login from "./components/Login";
import Home from "./components/Home";

class App extends Component {

    state = {
        isLogin: false
    }

    async componentDidMount() {
        const jwt = localStorage.getItem("token");
        if (jwt) {
            this.setState({isLogin: true})
        }
    }


    render() {
        if (!this.state.isLogin) return <Login/>
        else return <Home/>

    }
}

export default App;