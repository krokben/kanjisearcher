import React, { Component } from 'react';
import ClipboardButton from 'react-clipboard.js';
import kradfile from './kradfile';
import Search from './components/Search';

export default class App extends Component {
	constructor() {
		super();

		this.state = {
			krad: Object.keys(kradfile).map(key => [key, kradfile[key]]),
			kanji: null
		};
	}

	search(input) {
		const array = Array.from(input);
		const	result = this.state.krad.filter(x => {
			let bool;
			for (let i = 0; i < array.length; i++) {
				x[1].includes(array[i]) && bool !== false ? bool = true : bool = false;
			}
			return bool;
		}).map(y => y[0]);

		let kanji = this.state.kanji;
		kanji = result;
		this.setState({kanji});
	}

	changeSource(kanji) {
		kanji.select();
	}
	
	render() {
		return (
			<div>
				<Search search={this.search.bind(this)} ref={x => this.searchInput = x} />
				<div>
					{this.state.kanji ? this.state.kanji.map(x => {
						return (
							<ClipboardButton
								style={{
									backgroundColor: '#fff',
									height: '50px',
									width: '50px',
									fontSize: '30px',
									cursor: 'pointer'
								}}
								key={x}
								data-clipboard-text={x}
							>
								{x}
							</ClipboardButton>
						);
					}) : null}
				</div>
			</div>
		);
	}
}
