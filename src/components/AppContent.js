import * as React from 'react';
import WelcomeContent from './WelcomeContent';
import AuthContent from './AuthContent';
import LoginForm from './LoginForm';
import Buttons from './Buttons';
import { request, setAuthHeader } from '../axios_helper';
import LoginNull from './LoginNull';

export default class AppContent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      componentToShow: "welcome",
      popUpLoginStatus: "",
      isLoginNullVisible:false,
    };
  };

  login = () => {
    this.setState({ componentToShow: "login" });
  }

  logout = () => {
    this.setState({ componentToShow: "welcome" });
  }

  showLoginNullPopup = () => {
    this.setState({ isLoginNullVisible: true });
  };

  closeLoginNullPopup = () => {
    this.setState({ isLoginNullVisible: false });
  };

  onLogin = async (e, login, password) => {
    e.preventDefault();

    if (!login || !password) {
      this.showLoginNullPopup();
      this.setState({ popUpLoginStatus: "emptyInput" });
      return;
    }

    try {
      const response = await request("POST", "/auth/login", { login: login, password: password }, { cache: 'no-store' });
      console.log("Resposta do servidor:", response);

      if (response.data.token) {
        setAuthHeader(response.data.token);
        this.setState({ componentToShow: "messages" });
        console.log("Autenticado com sucesso");
      } else {
        console.log("com token", response.data.token);

        this.showLoginNullPopup();
        this.setState({ popUpLoginStatus: "invalidLogin" });
      }
    } catch (err) {
      console.log("Erro ao fazer login:", err.message);
      this.showLoginNullPopup();
      this.setState({ popUpLoginStatus: "invalidLogin" });
    }
  };

  onRegister = (event, login, password, role) => {
    event.preventDefault();

    if (role === "") {
      
      this.showLoginNullPopup();
      this.setState({ popUpLoginStatus: "adminError" });
      return;
    }
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
          this.setState({ componentToShow: "messages" });
        }).catch(
          (error) => {
            setAuthHeader(null);
            this.setState({ componentToShow: "welcome" });
          }
        );
  };

  render() {
    return (
      <div>
        <Buttons login={this.login} logout={this.logout} />
        {this.state.componentToShow === "welcome" && <WelcomeContent />}
        {this.state.componentToShow === "messages" && <AuthContent />}
        {this.state.componentToShow === "login" && <LoginForm onLogin={this.onLogin} onRegister={this.onRegister} />}
        {(this.state.isLoginNullVisible && (
          this.state.popUpLoginStatus === "invalidLogin" || 
          this.state.popUpLoginStatus === "adminError" || 
          this.state.popUpLoginStatus === "emptyInput")) && (
         <LoginNull onClose={this.closeLoginNullPopup} messageType={this.state.popUpLoginStatus} />)}
      </div>
    );
  };
}
