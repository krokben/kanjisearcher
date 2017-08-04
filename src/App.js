import React, { Component } from 'react';
import axios from 'axios';
import ClipboardButton from 'react-clipboard.js';
import kradfile from './kradfile.json';
import Search from './components/Search';

export default class App extends Component {
	constructor() {
		super();

		this.state = {
			krad: Object.keys(kradfile).map(key => [key, kradfile[key]]),
			kanji: null,
			content: null,
			kotoba: []
		};
	}

	componentDidMount() {
		this.fetchKotoba();
	}

	fetchKotoba() {
		axios.get('http://localhost:3004/kotoba')
			.then((response) => {
				let kotoba = this.state.kotoba;
				kotoba = [];
				response.data.forEach(x => {
					kotoba.push(x);
				});
				this.setState({kotoba});
			});
	}

	showKanji(input) {
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

	chooseKanji(kanji) {
		this.searchInput.input.value = kanji;
	}

	search(e, input) {
		e.preventDefault();
		const request = new XMLHttpRequest();
		request.open('GET', 'http://localhost/kanjisearcher/php/wrapper.php?kanji=' + input, true);

		request.onload = function() {
			if (request.status >= 200 && request.status < 400) {
				this.showResult(request.responseText);
			} else {
				console.log('error');
			}
		}.bind(this);

		request.send();

		let kanji = this.state.kanji;
		kanji = null;
		this.setState({kanji});
	}

	showResult(result) {
		const content = document.querySelector('#content');
		content.innerHTML = result;
		const kotoba = content.querySelectorAll('span.text');
		kotoba.forEach(x => x.addEventListener('click', () => this.pushKotoba(x)));
	}

	pushKotoba(word) {
		const strippedWord = word.textContent.replace(/ /g,'').replace(/(\r\n|\n|\r)/gm, '');
		let meaning = strippedWord + '\n';

		const furigana = word.previousElementSibling.querySelectorAll('span');
		furigana.forEach(x => {
			meaning += x.innerHTML;
		});

		meaning += ' ';

		const meaningsElement = word.parentElement.parentElement.parentElement.nextElementSibling;
		const meanings = meaningsElement.querySelectorAll('span.meaning-meaning');
		meanings.forEach((x, i) => {
			const notWikiOrOther = x.parentElement.parentElement.previousElementSibling.innerHTML !== 'Wikipedia definition' &&
				x.parentElement.parentElement.previousElementSibling.innerHTML !== 'Other forms';
			if (notWikiOrOther && i > 0) {
				meaning += (i + 1) + ' .' + x.innerHTML + '\n';
			} else if (notWikiOrOther) {
				meaning += x.innerHTML + '\n';
			}
		});
	
		axios.post('http://localhost:3004/kotoba',
			{word: strippedWord, meaning: meaning, id: strippedWord})
			.then(window.location.reload());
	}
	
	eraseKotoba(id) {
		axios.delete('http://localhost:3004/kotoba/' + id)
			.then(window.location.reload());
	}

	renderKotoba() {
		return this.state.kotoba.map(x => {
			return (
				<li
					style={{display: 'flex', justifyContent: 'space-between'}}
					key={`word-${x.word}`}
				>
					<ClipboardButton
						style={{
							backgroundColor: '#fff',
							height: '50px',
							fontSize: '20px',
							cursor: 'pointer'
						}}
						data-clipboard-text={x.meaning}
					>
						{x.word}
					</ClipboardButton>
					<button
						style={{cursor: 'pointer'}}
						onClick={() => this.eraseKotoba(x.id)}
					>
						Erase
					</button>
				</li>
			);
		});
	}

	render() {
		return (
			<div style={{display: 'flex', height: '98vh', overflow: 'scroll'}}>
				<div style={{flex: 1}}>
					<Search showKanji={this.showKanji.bind(this)} search={this.search.bind(this)} ref={x => this.searchInput = x} />
					<div>
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
										onClick={() => this.chooseKanji(x)}
									>
										{x}
									</ClipboardButton>
								);
							}) : null}
						</div>
						<div>
							{this.state.content}
						</div>
					</div>
				</div>
				<div style={{flex: 1}}>
					<h1 style={{textAlign: 'center'}}>my kotoba</h1>
					<ul>
						{this.renderKotoba()}
					</ul>
				</div>
			</div>
		);
	}
}
