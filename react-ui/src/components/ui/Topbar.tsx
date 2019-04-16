import * as React from "react";
import "./Topbar.css";

// import Joyride, { Step } from "react-joyride";
// import { joyrideSteps } from "../../lib/joyrideSteps";

import { connect } from "react-redux";

import { BlockData, BlockDataOptions } from "../../types/blockData";
import { createBlock } from "../../actions/block";

// import FlatButton from "material-ui/FlatButton";
import { StoreState } from "../../types/storeState";
import { CreateBlock } from "./CreateBlock";
import { Code } from "./Code";
import { genWACode } from "../../lib/helpers/Editor";
import { ShareMenu } from "./ShareMenu";
import { saveState } from "../../actions/state";

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
  saveState: (blocks: Array<BlockDataOptions>, name: string) => void;
  error: string;
  success: string;
}

class Topbar extends React.Component<TopbarProps, TopbarState> {
  // joyride: Joyride;
  code: string;
  constructor(props: TopbarProps) {
    super(props);
    this.state = {
      joyrideIsRunning: false
    };
    // Build internal objects from blocks used with web audio
    this.code = genWACode(this.props.blocks);
  }
  componentWillReceiveProps(nextProps: TopbarProps) {
    this.code = genWACode(nextProps.blocks);
  }
  render() {
    return (
      <div className="topbar-container">
        <div className="topbar">
          <div className="topbar-title-container">
            <img src={CurveSVG} width={48} className="logo" />
            <h2 className="topbar-title thin">
              <i>{this.props.name}</i>
            </h2>
          </div>
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
        <ShareMenu
          blocksToSave={this.props.blocksWithoutInternals}
          saveState={this.props.saveState}
          error={this.props.error}
          success={this.props.success}
          name={this.props.name}
          slug={this.props.slug}
        />
        <Code code={this.code} />
        <CreateBlock
          audioCtx={this.props.audioCtx}
          createBlock={this.props.createBlock}
        />
      </div>
    );
  }
}
const mapStateToProps = ({
  name,
  slug,
  blocks,
  audioCtx,
  error,
  success
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
    slug,
    blocks,
    audioCtx,
    error,
    success
  };
};
const mapDispatchToProps = (dispatch: any) => {
  return {
    createBlock: (block: BlockData) => dispatch(createBlock(block)),
    saveState: (blocks: Array<BlockDataOptions>, name: string) =>
      dispatch(saveState(blocks, name))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Topbar);
