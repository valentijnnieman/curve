import * as React from "react";
import { TextField, RaisedButton, Dialog } from "material-ui";
import { Redirect } from "react-router";
import Register from "./Register";

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
    e.preventDefault();
    this.props.login(this.state.name, this.state.password);
  };
  render() {
    if (this.props.user && this.props.user.name) {
      return <Redirect to="/" />;
    }
    return (
      <RaisedButton primary={true} onClick={this.handleOpen}>
        Login
        <Dialog
          title="Login"
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
              floatingLabelText="Name"
              className="input input--black"
              errorText={this.props.error}
              errorStyle={{ color: "red" }}
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
            />
            <RaisedButton
              primary={true}
              label="Log in"
              style={{ marginTop: "32px", marginBottom: "32px" }}
              type="submit"
            />
            <Register
              register={this.props.register}
              error={this.props.error}
              closeLogin={this.handleClose}
            />
          </form>
        </Dialog>
      </RaisedButton>
    );
  }
}

export default Login;
