import * as React from "react";
import RaisedButton from "../ui/Buttons/RaisedButton";
import Dialog from "../ui/Dialog";
import TextField from "../ui/TextField";
import SubmitButton from "./Buttons/SubmitButton";

interface RegisterProps {
  register: (name: string, email: string, password: string) => void;
  error: string;
  closeLogin: () => void;
}

export class Register extends React.Component<RegisterProps, any> {
  constructor(props: RegisterProps) {
    super(props);
    this.state = {
      open: false,
      name: "",
      email: "",
      password: "",
      passwordAgain: "",
      passwordError: ""
    };
  }
  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    // close parent login modal too
    // this.props.closeLogin();
    this.setState({ open: false });
  };
  handleNameChange = (e: any) => {
    const name = e.target.value;
    this.setState({
      name
    });
  };
  handleEmailChange = (e: any) => {
    const email = e.target.value;
    this.setState({
      email
    });
  };
  handlePasswordChange = (e: any) => {
    const password = e.target.value;
    this.setState({
      password
    });
    if (password.length < 8) {
      this.setState({
        passwordError: "Password is too short."
      });
    } else {
      this.setState({
        passwordError: ""
      });
    }
  };
  handlePasswordAgainChange = (e: any) => {
    const passwordAgain = e.target.value;
    this.setState({
      passwordAgain
    });
    if (this.state.password !== passwordAgain) {
      this.setState({
        passwordError: "Passwords do not match."
      });
    } else {
      this.setState({
        passwordError: ""
      });
    }
  };
  handleFormSubmit = (e: any) => {
    e.preventDefault();
    if (this.state.password.length < 8) {
      this.setState({
        passwordError: "Password is too short."
      });
    } else if (this.state.password !== this.state.passwordAgain) {
      this.setState({
        passwordError: "Passwords do not match."
      });
    } else {
      this.props.register(
        this.state.name,
        this.state.email,
        this.state.password
      );
    }
  };
  render() {
    return (
      <RaisedButton className="register-button" onClick={this.handleOpen}>
        Register
        <Dialog
          title="Register"
          modal={false}
          closable={true}
          open={this.state.open}
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
              id="email"
              value={this.state.email}
              onChange={this.handleEmailChange}
              floatingLabelText="Email"
              className="input input--black"
              errorText={this.props.error}
              errorStyle={{ color: "red" }}
              underlined={true}
              type="email"
            />
            <TextField
              id="password"
              value={this.state.password}
              onChange={this.handlePasswordChange}
              floatingLabelText="Password"
              className="input input--black"
              errorText={this.props.error || this.state.passwordError}
              errorStyle={{ color: "red" }}
              underlined={true}
              type="password"
            />
            <TextField
              id="password-again"
              value={this.state.passwordAgain}
              onChange={this.handlePasswordAgainChange}
              floatingLabelText="Enter password again"
              className="input input--black"
              errorText={this.props.error || this.state.passwordError}
              errorStyle={{ color: "red" }}
              underlined={true}
              type="password"
            />
            <SubmitButton
              label="Register"
              className="submit-button--register"
            />
          </form>
        </Dialog>
      </RaisedButton>
    );
  }
}

export default Register;
