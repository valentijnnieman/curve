import * as React from "react";
import {
  Dialog,
  FloatingActionButton,
  TextField,
  RaisedButton
} from "material-ui";
import "./Dropdown.css";
import ContentAdd from "material-ui/svg-icons/social/share";
import { BlockDataOptions } from "../../types/blockData";
import { Link } from "react-router-dom";

interface ShareMenuProps {
  saveState: (blocksToSave: Array<BlockDataOptions>, name: string) => void;
  name: string;
  slug: string;
  blocksToSave: Array<BlockDataOptions>;
  error: string;
  success: string;
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
    this.props.saveState(this.props.blocksToSave, this.state.name);
  };
  render() {
    let successElement;
    if (this.props.success) {
      successElement = (
        <div>
          <p className="success-text">{this.props.success}</p>
          <p>
            You can share your synth using this link:{" "}
            <Link to={"/" + this.props.slug} onClick={this.handleClose}>
              {this.props.slug}
            </Link>
          </p>
        </div>
      );
    }
    return (
      <div>
        <FloatingActionButton
          mini={true}
          className="share-menu-button"
          onClick={this.handleOpen}
        >
          <ContentAdd />
        </FloatingActionButton>
        <Dialog
          title="Share synth"
          modal={false}
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
              className="input"
              errorText={this.props.error}
              type="text"
            />
            <RaisedButton
              primary={true}
              label="Save"
              style={{ marginTop: "32px", marginBottom: "32px" }}
              type="submit"
            />
          </form>
          {successElement}
        </Dialog>
      </div>
    );
  }
}