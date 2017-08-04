import React, { Component } from 'react';

export default class Search extends Component {
	render() {
		return (
			<form onSubmit={(e) => this.props.search(e, this.input.value)}>
				<input
					style={{height: '50px', width: '100%', fontSize: '20px', textAlign: 'center'}}
					autoFocus
					type="text"
					placeholder="enter kanji"
					ref={(x) => this.input = x}
					onChange={() => this.props.showKanji(this.input.value)}
				/>
				<button>Search</button>
			</form>
		);
	}
}