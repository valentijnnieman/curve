import * as React from "react";
import List from "../ui/List";
import ListItem from "../ui/ListItem";
import Dialog from "../ui/Dialog";
import "./Dropdown.css";
import { Link } from "react-router-dom";

interface SynthMenuProps {
  synths: Array<any>;
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
      <div onClick={this.handleOpen}>
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
      </div>
    );
  }
}
