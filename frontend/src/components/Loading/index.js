import React from 'react';

export default class DashRow extends React.Component {
  constructor(){
    super();
    this.state = {
      width: 100
    };
  }
  render(){
    let progressStyle = {
      width: `${this.state.width}%`
    };
    return (
      <tr className="LoadingRow">
        <td colSpan={6} className="noPadding">
          <div className="progress flat-progress">
            <div className="progress-bar progress-bar-striped progress-bar-animated bg-success" role="progressbar" aria-valuenow={this.state.width} aria-valuemin="0" aria-valuemax="100" style={progressStyle}></div>
          </div>
        </td>
      </tr>
    );   
  }
}