import * as React from "react";
import List from "./Menu/List";
import ListItem from "./Menu/ListItem";
import Dialog from "./Menu/Dialog";
import { Link } from "react-router-dom";
import MenuItem from "./Menu/MenuItem";

interface SynthMenuProps {
  synths: Array<any>;
  disabled: boolean;
}
interface SynthMenuState {
  open: boolean;
}

export class SynthMenu extends React.Component<SynthMenuProps, SynthMenuState> {
  constructor(props: SynthMenuProps) {
    super(props);
    this.state = {
      open: false
    };
  }
  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };
  render() {
    const synths = this.props.synths.length > 0 ? this.props.synths : [];
    const synthList = synths.map((synth, index) => {
      return (
        <Link
          key={index}
          to={"/synth/" + synth.slug}
          onClick={this.handleClose}
        >
          <ListItem>{synth.name}</ListItem>
        </Link>
      );
    });
    return (
      <MenuItem onClick={this.handleOpen} disabled={this.props.disabled}>
        My Synths
        <Dialog
          title="My Synths"
          modal={false}
          closable={true}
          open={this.state.open}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}
          className="code-dialog"
        >
          <List>{synthList}</List>
        </Dialog>
      </MenuItem>
    );
  }
}
