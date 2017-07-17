import React, { Component } from 'react';

export default class Search extends Component {
	render() {
		return (
			<input
				style={{height: '50px', width: '100%', fontSize: '20px', textAlign: 'center'}}
				autoFocus
				type="text"
				placeholder="enter kanji"
				ref={(x) => this.input = x}
				onChange={() => this.props.search(this.input.value)}
			/>
		);
	}
}