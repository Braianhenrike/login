import * as React from 'react';
import WelcomeContent from './WelcomeContent';
import AuthContent from './AuthContent';
import LoginForm from './LoginForm';
import Buttons from './Buttons';
import { request, setAuthHeader } from '../axios_helper';

export default class AppContent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      componentToShow: "welcome"
    };
  };

  login = () => {
    this.setState({ componentToShow: "login" });
  }

  logout = () => {
    this.setState({ componentToShow: "welcome" });
  }

  onLogin = (e, login, password) => {
    e.preventDefault();
    request("POST ", "/auth/login", { login: login, password: password }
    ).then((response) => {
      this.setState({ componentToShow: "menssagem" })
    }).catch((err) => {
      this.setState({ componentToShow: "welcome" });
    });
  }

  onRegister = (event, login, password, role) => {
    event.preventDefault();
    request(
        "POST",
        "/auth/register",
        {
            login: login,
            password: password,
            role: role
        }).then(
        (response) => {
            setAuthHeader(response.data.token);
            this.setState({componentToShow: "messages"});
        }).catch(
        (error) => {
            setAuthHeader(null);
            console.log("saiu")
            this.setState({componentToShow: "welcome"})
        }
    );
};


  render() {
    return (
      <div>
        <Buttons login={this.login} logout={this.logout}/>
        {this.state.componentToShow === "welcome"  && <WelcomeContent />}
        {this.state.componentToShow === "messages"  && <AuthContent />}
        {this.state.componentToShow === "login"  && <LoginForm onLogin={this.login} onRegister={this.onRegister} />}
      </div>
    );

  };

}
