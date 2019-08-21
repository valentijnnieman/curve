import * as React from "react";
import Drawer from "./Drawer";
import MenuItem from "./MenuItem";
// import ContentAdd from "../ui/Icons/add.svg";
import { ShareMenu } from "../ShareMenu";
import "./Sidebar.css";
import { BlockDataOptions, BlockData } from "src/types/blockData";
import { genWACode } from "../../../lib/helpers/Editor";
import { Code } from "../Code";
import { SynthMenu } from "../SynthMenu";
import SidebarButton from "../Buttons/SidebarButton";
import Menu from "./Menu";
import { Login } from "../Login";
import Register from "../Register";
const CurveSVG = require("../../../curve.svg");

interface SidebarProps {
  name: string;
  slug: string;
  blocks: Array<BlockData>;
  blocksWithoutInternals: Array<BlockData>;
  createBlock: (block: BlockData) => void;
  saveState: (
    blocks: Array<BlockDataOptions>,
    name: string,
    id: number
  ) => void;
  updateState: (
    blocksToSave: Array<BlockDataOptions>,
    name: string,
    synthId: number,
    userId: number
  ) => void;
  error: string;
  success: string;
  user: any;
  synths: Array<any>;
  synthId: number;
  login: (name: string, password: string) => void;
  register: (name: string, email: string, password: string) => void;
  logout: () => void;
  fetchSynths: (id: number) => void;
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

  handleToggle = () =>
    this.setState({ open: !this.state.open }, () => {
      this.props.fetchSynths(this.props.user.id);
    });

  render() {
    const { name } = this.props.user;
    let userMenu;
    let userButton = (
      <Login
        login={this.props.login}
        register={this.props.register}
        error={this.props.error}
        user={this.props.user}
      />
    );
    let registerButton = (
      <Register
        register={this.props.register}
        error={this.props.error}
        closeLogin={() => {
          window.console.log("closing login");
        }}
      />
    );
    let shareMenu = (
      <>
        Log in to save synth <br /> <br />
      </>
    );
    userMenu = (
      <div className="sidebar-bottom">
        {/* <MenuItem style={{ textAlign: "center" }}>My Synths</MenuItem> */}
        <SynthMenu synths={this.props.synths} disabled={name ? false : true} />
        <div className="sidebar-bottom__lower">
          <MenuItem
            style={{ textAlign: "center" }}
            onClick={() => {
              this.props.logout();
            }}
            disabled={name ? false : true}
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
        updateState={this.props.updateState}
        error={this.props.error}
        success={this.props.success}
        name={this.props.name}
        slug={this.props.slug}
        user={this.props.user}
        synthId={this.props.synthId}
        disabled={name ? false : true}
      />
    );
    return (
      <div>
        <SidebarButton
          className="main-menu-button"
          onClick={this.handleToggle}
        />
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
            <b>
              {name
                ? `Welcome, ${name}!`
                : "Please log in to have access to all features."}
            </b>
            {name ? "" : userButton}
            {name ? "" : registerButton}
          </p>
          <Menu>
            {shareMenu}
            <Code code={this.code} />
            {userMenu}
          </Menu>
        </Drawer>
      </div>
    );
  }
}
