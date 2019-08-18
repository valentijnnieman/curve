import * as React from "react";
import Dialog from "./Menu/Dialog";
import TextField from "./Forms/TextField";
import { BlockDataOptions } from "../../types/blockData";
import { Link } from "react-router-dom";
import MenuItem from "./Menu/MenuItem";
import SubmitButton from "./Buttons/SubmitButton";

interface ShareMenuProps {
  saveState: (
    blocksToSave: Array<BlockDataOptions>,
    name: string,
    id: number
  ) => void;
  updateState: (
    blocksToSave: Array<BlockDataOptions>,
    name: string,
    id: number,
    userId: number
  ) => void;
  name: string;
  slug: string;
  blocksToSave: Array<BlockDataOptions>;
  error: string;
  success: string;
  user: any;
  synthId: number;
  disabled: boolean;
}
interface ShareMenuState {
  open: boolean;
  name: string;
}

export class ShareMenu extends React.Component<ShareMenuProps, ShareMenuState> {
  constructor(props: ShareMenuProps) {
    super(props);
    this.state = {
      open: false,
      name: this.props.name
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
  handleFormSubmit = (e: any) => {
    e.preventDefault();
    if (this.state.name === this.props.name) {
      this.props.updateState(
        this.props.blocksToSave,
        this.state.name,
        this.props.synthId,
        this.props.user.id
      );
    } else {
      this.props.saveState(
        this.props.blocksToSave,
        this.state.name,
        this.props.user.id
      );
    }
  };
  render() {
    let successElement;
    if (this.props.success) {
      successElement = (
        <div>
          <p className="success-text">{this.props.success}</p>
          <p>
            You can share your synth using this link:{" "}
            <Link to={"/synth/" + this.props.slug} onClick={this.handleClose}>
              {this.props.slug}
            </Link>
          </p>
        </div>
      );
    }
    return (
      <MenuItem onClick={this.handleOpen} disabled={this.props.disabled}>
        Save synth
        <Dialog
          title="Save & share synth"
          closable={true}
          open={this.state.open}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}
          className="code-dialog"
        >
          <p>You can save your synth and share it with others!</p>
          <form onSubmit={this.handleFormSubmit} className="share-form">
            <TextField
              id="name"
              value={this.state.name}
              onChange={this.handleNameChange}
              floatingLabelText="Name"
              className="input input--black"
              errorText={this.props.error}
              type="text"
            />
            <SubmitButton
              label="Save"
              style={{ marginTop: "32px", marginBottom: "32px" }}
            />
          </form>
          {successElement}
        </Dialog>
      </MenuItem>
    );
  }
}
