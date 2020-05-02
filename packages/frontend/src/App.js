import React from 'react';
import './App.css';
import Profile from './Profile';
import Login from './Login';
import { card as cardStyle, hr as hrStyle } from './utils/styles'


const LS_KEY = 'login-with-metamask:auth';

export class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        auth: undefined
    };
  }

  componentDidMount() {
    // Access token is stored in localstorage
    const ls = window.localStorage.getItem(LS_KEY);
    const auth = ls && JSON.parse(ls);
    this.setState({
      auth
    });
  }

  handleLoggedIn = (auth) => {
    if (!auth.error){
      localStorage.setItem(LS_KEY, JSON.stringify(auth))
      this.setState({ auth });
    } else {
      window.alert("署名の検証に失敗しました")
    }
  }

  handleLoggedOut = () => {
    localStorage.removeItem(LS_KEY);
    this.setState({ auth: undefined });
  }

  render() {

    const { auth } = this.state;

    return (
      <div style={{ ...cardStyle, padding: '1.5rem 2rem', textAlign: 'center' }}>
        <strong>MetaMask Login Sample</strong>

        <hr style={hrStyle} />
        <div >
          { auth ? (
            <Profile auth={auth} onLoggedOut={this.handleLoggedOut} />
          ) : (
            <Login onLoggedIn={this.handleLoggedIn} />
          )}
        </div>
      </div>
    );
  }
}

export default App;