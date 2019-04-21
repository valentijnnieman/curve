import * as React from "react";
import Drawer from "material-ui/Drawer";
import { FloatingActionButton, FlatButton } from "material-ui";
import MenuItem from "material-ui/MenuItem";
import ContentAdd from "material-ui/svg-icons/navigation/apps";
import { ShareMenu } from "./ShareMenu";
import "./Sidebar.css";
import { BlockDataOptions, BlockData } from "src/types/blockData";
import { genWACode } from "../../lib/helpers/Editor";
import { Code } from "./Code";
const CurveSVG = require("../../curve.svg");

interface SidebarProps {
  name: string;
  slug: string;
  blocks: Array<BlockData>;
  blocksWithoutInternals: Array<BlockData>;
  createBlock: (block: BlockData) => void;
  saveState: (blocks: Array<BlockDataOptions>, name: string) => void;
  error: string;
  success: string;
  user: any;
  logout: () => void;
}
interface SidebarState {
  open: boolean;
}

export default class Sidebar extends React.Component<
  SidebarProps,
  SidebarState
> {
  code: string;
  constructor(props: SidebarProps) {
    super(props);
    this.state = { open: false };
    // Build internal objects from blocks used with web audio
    this.code = genWACode(this.props.blocks);
  }
  componentWillReceiveProps(nextProps: SidebarProps) {
    this.code = genWACode(nextProps.blocks);
  }

  handleToggle = () => this.setState({ open: !this.state.open });

  render() {
    const { name } = this.props.user;
    let userMenu;
    let shareMenu = (
      <FlatButton disabled={true}>Login to save synth</FlatButton>
    );
    if (name) {
      userMenu = (
        <div className="sidebar-bottom">
          <MenuItem style={{ textAlign: "center" }}>My Synths</MenuItem>
          <div className="sidebar-bottom__lower">
            <MenuItem
              style={{ textAlign: "center" }}
              onClick={() => {
                window.console.log("clock out");
                this.props.logout();
              }}
            >
              Log Out
            </MenuItem>
          </div>
        </div>
      );
      shareMenu = (
        <ShareMenu
          blocksToSave={this.props.blocksWithoutInternals}
          saveState={this.props.saveState}
          error={this.props.error}
          success={this.props.success}
          name={this.props.name}
          slug={this.props.slug}
        />
      );
    }
    return (
      <div>
        <FloatingActionButton
          mini={true}
          className="sidebar-button"
          onClick={this.handleToggle}
        >
          <ContentAdd />
        </FloatingActionButton>
        <Drawer
          docked={false}
          open={this.state.open}
          onRequestChange={open => this.setState({ open })}
        >
          <div className="sidebar-header">
            <img src={CurveSVG} width={48} />
            <h1 style={{ textAlign: "center" }}>Curve</h1>
          </div>
          <p style={{ textAlign: "center" }}>
            <b>{name}</b>
          </p>
          <MenuItem style={{ textAlign: "center" }}>{shareMenu}</MenuItem>
          <MenuItem style={{ textAlign: "center" }}>
            <Code code={this.code} />
          </MenuItem>
          {userMenu}
        </Drawer>
      </div>
    );
  }
}
