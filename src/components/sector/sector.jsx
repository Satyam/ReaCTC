import React from 'react';
require('./sector.less');

export default class Sector extends React.Component {
	render () {
		return (<div className="sector">{this.props.params.sector}</div>);
	}
}
