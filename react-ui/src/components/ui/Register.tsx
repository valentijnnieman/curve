import * as React from "react";
import { TextField, RaisedButton, Dialog, FlatButton } from "material-ui";

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
      <FlatButton onClick={this.handleOpen}>
        SIGN UP
        <Dialog
          title="Sign up"
          modal={false}
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
              type="password"
            />
            <RaisedButton
              primary={true}
              label="Sign up"
              style={{ marginTop: "32px", marginBottom: "32px" }}
              type="submit"
            />
          </form>
        </Dialog>
      </FlatButton>
    );
  }
}

export default Register;
