import * as React from "react";
import RaisedButton from "../ui/Buttons/RaisedButton";
import Dialog from "./Menu/Dialog";
import TextField from "./Forms/TextField";
import { Redirect } from "react-router";
import SubmitButton from "./Buttons/SubmitButton";

interface LoginProps {
  login: (name: string, password: string) => void;
  register: (name: string, email: string, password: string) => void;
  error: string;
  user: any;
}

export class Login extends React.Component<LoginProps, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      open: false,
      name: "",
      password: ""
    };
  }
  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };
  handleNameChange = (e: any) => {
    const name = e.target.value;
    this.setState({
      name
    });
  };
  handlePasswordChange = (e: any) => {
    const password = e.target.value;
    this.setState({
      password
    });
  };
  handleFormSubmit = (e: any) => {
    window.console.log("SUBMITTING");
    e.preventDefault();
    this.props.login(this.state.name, this.state.password);
  };
  render() {
    if (this.props.user && this.props.user.name) {
      return <Redirect to="/" />;
    }
    return (
      <RaisedButton onClick={this.handleOpen}>
        Log in
        <Dialog
          title="Log in"
          modal={false}
          open={this.state.open}
          closable={true}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}
          className="code-dialog"
        >
          <form onSubmit={this.handleFormSubmit} className="share-form">
            <TextField
              id="name"
              value={this.state.name}
              onChange={this.handleNameChange}
              floatingLabelText="Username"
              className="input input--black"
              errorText={this.props.error}
              errorStyle={{ color: "red" }}
              underlined={true}
              type="text"
            />
            <TextField
              id="password"
              value={this.state.password}
              onChange={this.handlePasswordChange}
              floatingLabelText="Password"
              className="input input--black"
              errorText={this.props.error}
              errorStyle={{ color: "red" }}
              type="password"
              underlined={true}
            />
            <SubmitButton primary={true} label="Log in" type="submit" />
          </form>
        </Dialog>
      </RaisedButton>
    );
  }
}

export default Login;
