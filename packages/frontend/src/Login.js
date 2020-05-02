import React from 'react';
import Web3 from 'web3';

let web3; // Will hold the web3 instance

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false // Loading button state
    };
  }

  handleAuthenticate = ({
    publicAddress,
    signature
  }) =>
  {
    return fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth`, {
      body: JSON.stringify({ publicAddress, signature }),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    })
    .then(response => response.json()) 
  }
  
  handleClick = async () => {
    const { onLoggedIn } = this.props;

    // Check if MetaMask is installed
    if (!window.ethereum) {
      window.alert('MetaMaskをインストールして下さい');
      return;
    }
  
    if (!web3) {
      try {
        // Request account access if needed
        await window.ethereum.enable();

        // We don't know window.web3 version, so we use our own instance of Web3
        // with the injected provider given by MetaMask
        web3 = new Web3(window.ethereum);
      } catch {
        window.alert('MetaMaskを認可して下さい');
        return;
      }
    }
  
    const coinbase = await web3.eth.getCoinbase();
    if (!coinbase) {
      window.alert('MetaMaskをアクティベートして下さい')
      return;
    }

    const publicAddress = coinbase.toLowerCase();
    this.setState({ loading: true });

    // Look if user with current publicAddress is already present on backend
    fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/users?publicAddress=${publicAddress}`,{
        mode: 'cors'
      }
    )
      .then(response => response.json())
      // If yes, resrieve it. if no, create it.
      .then((user) => {
        console.log(`user: ${JSON.stringify(user.user)}`)
        return user.user ? user.user : this.handleSignup(publicAddress)
      })
      // Popup MetaMask confirmation modal to sign message
      .then(this.handleSignMessage)
      // Send signature to backend on the /auth route
      .then(this.handleAuthenticate)
      // Pass accessToken back to parent component (to save it in localStorage)
      .then(onLoggedIn)
      .catch(err => {
        window.alert(err);
        this.setState({ loading: false});
      });
  };

  handleSignMessage = async ({
    publicAddress,
    nonce
  }) => {
    try {
      const signature = await web3.eth.personal.sign(
        `MetaMask Login Sample (One-time token: ${nonce})`,
        publicAddress,
        '' // Metamask will ignore the password argument here
      );
      return { publicAddress, signature };
    } catch (err) {
      throw new Error('You need to sign the message to be able to log in.');
    }
  };

  handleSignup = (publicAddress) => {
    return fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users`, {
      body: JSON.stringify({ publicAddress }),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    }).then(response => response.json());
  };

  render() {
    return (
      <button onClick={this.handleClick}>
        <strong>Login</strong>
      </button>
    );
  }
}