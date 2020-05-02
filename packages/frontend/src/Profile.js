import jwtDecode from 'jwt-decode';
import React from 'react';

export default class Profile extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      user: undefined,
      publicAddress: ''
    };
  }

  componentDidMount() {
    const { auth: { accessToken }} = this.props;
    const { id } = jwtDecode(accessToken);
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user?id=${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then(response => response.json())
      .then(user => this.setState({ publicAddress: user.publicAddress }))
      .catch(window.alert);
  }

  handleChange = ({
    target: { value }
  }) => {
    this.setState({ username: value });
  };

  render(){
    const {
      onLoggedOut
    } = this.props;

    const { publicAddress } = this.state;

    return(
      <div>
        <p>Public address: {publicAddress}</p>
        <button onClick={onLoggedOut}>Loggout</button>
      </div>
    );
  }

}