import * as React from "react";
import { RaisedButton, Dialog } from "material-ui";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/styles/hljs";
import "./Code.css";

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
        <RaisedButton
          className="code-dialog-button"
          label="Generate code"
          onClick={this.handleOpen}
        />
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
