/*
Copyright 2018 chrometaphore.com

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

const reactShim = require("./react-shim");
const style = require("./styles.css");
const React = require("react");
const ReactDOM = require("react-dom");
const exportAssets = require("./exportAssets");

class UI extends React.Component {
    constructor(props) {
        super(props);

        //reference to the select node
        //so we can force a value into
        //it once the component is mounted..
        this.mySelect = React.createRef();

        this.state = { scale: props.scale || "1x",
                       format: props.format || "png",
                       notScalableFormat: false, //this controls UI input on/off
        };

        this.onInputScaleChange = (e) => {
            this.setState({ scale: e.target.value })
        }

        this.onSelectFormatChange = (e) => {
            var isFormatNotScalable;
            switch( this.mySelect.current.value )
            {
                case "png":
                    isFormatNotScalable = false;
                break;
                case "jpg":
                    isFormatNotScalable = false;
                break;
                case "svg":
                    isFormatNotScalable = true;
                break;
                case "pdf":
                    isFormatNotScalable = true;
                break;
            }
            this.setState( { format: this.mySelect.current.value,
                             notScalableFormat: isFormatNotScalable })
        }

        this.onExportClick = (e) => {
            //default behaviour
            //closes the dialog right away.
            e.preventDefault();

            //export assets
            this.export();
        }

        this.onCancelClick = (e) => {
            e.preventDefault();
            this.props.dialog.close();
        }

        this.export = async() => {
          console.log('exporting..');
          //console.log('items: ' + this.props.selection.items.length);
          //console.log('scale: ' + this.state.scale);
          //console.log('format: ' + this.state.format);

          var exp = await exportAssets( this.props.selection,
                                        this.props.root,
                                        this.state.scale,
                                        this.state.format ); //true | false

          this.props.dialog.close();
        }
    }

    //on mount, let's force the default value
    //into our format dropdown.
    componentDidMount() {
        //a reference to the node becomes accessible
        //at the "current" attribute of the ref.
        this.mySelect.current.value = "png";
    }

    //render dialog UI
    render() {
        return (
            <form id="custom-exporter">

                <div className="header">
                    <div className="logoArea">
                        <div className="logo"></div>
                    </div>
                    <div className="title">
                        <h1>Custom Export</h1>
                        <p>Export selected layers and artboards to any scale.</p>
                    </div>
                </div>

                <div className="controls">
                    <label>
                        <span>Scale</span>
                        <input value={this.state.scale} disabled={this.state.notScalableFormat} onChange={this.onInputScaleChange} />
                    </label>

                    <label>
                        <span>Format</span>
                        <select ref={this.mySelect}
                                value={this.state.format}
                                onChange={this.onSelectFormatChange}>
                            <option value="png">png</option>
                            <option value="jpg">jpg</option>
                            <option value="svg">svg</option>
                            <option value="pdf">pdf</option>
                        </select>
                    </label>
                </div>

                <footer>
                    <button uxp-variant="primary"
                            onClick={this.onCancelClick}>Cancel</button>
                    <button uxp-variant="cta"
                            onClick={this.onExportClick}>Export</button>
                </footer>
            </form>
        );
    }
}

let dialog;
function getDialog(selection,root) {
    if (dialog == null) {
        dialog = document.createElement("dialog");
        ReactDOM.render(<UI dialog={dialog} selection={selection} root={root}/>, dialog);
    }
    else {
      //re-rendering..
      ReactDOM.render(<UI dialog={dialog} selection={selection} root={root}/>, dialog);
    }
    return dialog
}

module.exports = {
    commands: {
        menuCommand: function (selection,root) {
            document.body.appendChild(getDialog(selection,root)).showModal();
        }
    }
};
