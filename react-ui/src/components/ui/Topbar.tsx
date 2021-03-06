import * as React from "react";
import "./Topbar.css";

// import Joyride, { Step } from "react-joyride";
// import { joyrideSteps } from "../../lib/joyrideSteps";

import { connect } from "react-redux";

import { BlockData, BlockDataOptions } from "../../types/blockData";
import { createBlock } from "../../actions/block";

import { StoreState } from "../../types/storeState";
import { CreateBlock } from "./CreateBlock";
import { saveState, fetchSynths, updateState } from "../../actions/state";
import Sidebar from "./Menu/Sidebar";
import { login, register } from "../../actions/user";
import { logout } from "../../actions/user";

const CurveSVG = require("../../curve.svg");

interface TopbarState {
  joyrideIsRunning: boolean;
}

interface TopbarProps {
  audioCtx: AudioContext;
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
  synthId: number;
  error: string;
  success: string;
  user: any;
  login: (name: string, password: string) => void;
  register: (name: string, email: string, password: string) => void;
  logout: () => void;
  fetchSynths: (id: number) => void;
  synths: Array<any>;
  zoom: number;
}

class Topbar extends React.Component<TopbarProps, TopbarState> {
  // joyride: Joyride;
  constructor(props: TopbarProps) {
    super(props);
    this.state = {
      joyrideIsRunning: false
    };
  }
  render() {
    return (
      <div className="topbar-container">
        <div className="topbar">
          <div className="topbar-title-container">
            <img alt="Curve" src={CurveSVG} width={48} className="logo" />
            <h2 className="topbar-title thin">
              <i>{this.props.name}</i>
            </h2>
          </div>
          {/* <div className="topbar-buttons">
            {userButton}
            {registerButton}
          </div> */}
          {/* <FlatButton
            label="Tour"
            onClick={() => this.setState({ joyrideIsRunning: true })}
          /> */}
        </div>
        {/* <Joyride
          ref={c => (this.joyride = c as Joyride)}
          run={this.state.joyrideIsRunning} // or some other boolean for when you want to start it
          debug={false}
          steps={joyrideSteps as Step[]}
          type="continuous"
          autoStart={true}
        /> */}
        {/* <ShareMenu
          blocksToSave={this.props.blocksWithoutInternals}
          saveState={this.props.saveState}
          error={this.props.error}
          success={this.props.success}
          name={this.props.name}
          slug={this.props.slug}
        />
        <Code code={this.code} /> */}
        <Sidebar {...this.props} />
        <CreateBlock
          audioCtx={this.props.audioCtx}
          createBlock={this.props.createBlock}
          zoom={this.props.zoom}
        />
      </div>
    );
  }
}
const mapStateToProps = ({
  user,
  name,
  synthId,
  slug,
  blocks,
  audioCtx,
  error,
  success,
  synths
}: StoreState) => {
  const copiedBlocks = blocks.map(block => {
    return { ...block };
  });
  const blocksWithoutInternals = copiedBlocks.map(block => {
    delete block.internal;
    // To prevent autoplaying audio on loading, i.e. for Chrome's autoplay policy:
    block.running = false;
    return block;
  });
  return {
    blocksWithoutInternals,
    name,
    synthId,
    slug,
    blocks,
    audioCtx,
    error,
    success,
    user,
    synths
  };
};
const mapDispatchToProps = (dispatch: any) => {
  return {
    createBlock: (block: BlockData) => dispatch(createBlock(block)),
    saveState: (blocks: Array<BlockDataOptions>, name: string, id: number) =>
      dispatch(saveState(blocks, name, id)),
    updateState: (
      blocks: Array<BlockDataOptions>,
      name: string,
      synthId: number,
      userId: number
    ) => dispatch(updateState(blocks, name, synthId, userId)),
    logout: () => dispatch(logout()),
    login: (name: string, password: string) => {
      dispatch(login(name, password));
    },
    register: (name: string, email: string, password: string) => {
      dispatch(register(name, email, password));
    },
    fetchSynths: (id: number) => {
      dispatch(fetchSynths(id));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Topbar);
