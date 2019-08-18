import * as React from "react";
import TextField from "../components/ui/Forms/TextField";
import RaisedButton from "../components/ui/Buttons/RaisedButton";
import { login } from "src/actions/user";
import { connect } from "react-redux";
import { StoreState } from "src/types/storeState";
import { Redirect } from "react-router";

export class Login extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      name: "",
      password: ""
    };
  }
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
      <form onSubmit={this.handleFormSubmit} className="login-form">
        <TextField
          id="name"
          value={this.state.name}
          onChange={this.handleNameChange}
          floatingLabelText="Name"
          className="input input--black"
          errorText={this.props.error}
          type="text"
        />
        <TextField
          id="password"
          value={this.state.password}
          onChange={this.handlePasswordChange}
          floatingLabelText="Password"
          className="input input--black"
          errorText={this.props.error}
          type="password"
        />
        <RaisedButton
          primary={true}
          label="Log in"
          style={{ marginTop: "32px", marginBottom: "32px" }}
          type="submit"
        />
      </form>
    );
  }
}

const mapStateToProps = ({ error, user }: StoreState) => {
  return {
    error,
    user
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    login: (name: string, password: string) => {
      dispatch(login(name, password));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
