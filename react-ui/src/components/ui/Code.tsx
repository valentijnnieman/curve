import * as React from "react";
import { RaisedButton, Dialog, FloatingActionButton } from "material-ui";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/styles/hljs";
import "./Dropdown.css";
import ContentAdd from "material-ui/svg-icons/action/code";

interface CodeProps {
  code: string;
}
interface CodeState {
  open: boolean;
}

export class Code extends React.Component<CodeProps, CodeState> {
  constructor(props: CodeProps) {
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
  copyToClipboard = () => {
    const code = this.props.code;
    function listener(e: any) {
      e.clipboardData.setData("text/plain", code);
      e.preventDefault();
    }
    document.addEventListener("copy", listener);
    document.execCommand("copy");
    document.removeEventListener("copy", listener);
  };
  render() {
    return (
      <div>
        <FloatingActionButton
          mini={true}
          className="code-dialog-button"
          onClick={this.handleOpen}
        >
          <ContentAdd />
        </FloatingActionButton>
        <Dialog
          title="Generated Web Audio code (experimental)"
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}
          className="code-dialog"
        >
          <p>
            This is the Web Audio code generated from Curve - might not be
            optimized!{" "}
          </p>
          <RaisedButton
            label="Copy to Clipboard"
            onClick={this.copyToClipboard}
          />
          <SyntaxHighlighter language="javascript" style={docco}>
            {this.props.code}
          </SyntaxHighlighter>
        </Dialog>
      </div>
    );
  }
}
