import * as React from "react";
import { Dialog, List, ListItem } from "material-ui";
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
    const synthList = this.props.synths.map((synth, index) => {
      return (
        <Link
          key={index}
          to={"/synth/" + synth.slug}
          onClick={this.handleClose}
        >
          <ListItem primaryText={synth.name} />
        </Link>
      );
    });
    return (
      <div onClick={this.handleOpen}>
        My Synths
        <Dialog
          title="My Synths"
          modal={false}
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
