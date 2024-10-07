import { useState } from "react";
/* user defined objects*/
import GoBoardT from './goboardtype.js';
import { INIT_BOARDDIM, INIT_SIZE, INIT_TURN } from './constants.js'; /* -------------------- */

function Cell({ boarddim, boardsize, r, c, chval, onCellClick, onCellDoubleClick }) {

	let celldim = boarddim / boardsize;
	let halfdim = celldim / 2;
	let x = c * celldim;
	let y = r * celldim;
	let stoneelement = <></>;

	switch (chval) {
		case '+':/* invisible circle since proxy for handling click event */
			stoneelement = (<>
				<circle cx={x + halfdim} cy={y + halfdim} r={halfdim}
					stroke-opacity="0" fill-opacity="0" onClick={onCellClick} />
				<line x1={x} y1={y + halfdim} x2={x + celldim} y2={y + halfdim} />
				<line x1={x + halfdim} y1={y} x2={x + halfdim} y2={y + celldim} />
			</>);
			break;
		case 'B':
			stoneelement = (<>
				<circle cx={x + halfdim} cy={y + halfdim} r={halfdim}
					stroke="white" fill="black" onClick={() => onCellClick('B')} onDoubleClick={() => onCellDoubleClick('+')} />
			</>);
			break;
		case 'W':
			stoneelement = (<>
				<circle cx={x + halfdim} cy={y + halfdim} r={halfdim}
					stroke="black" fill="white" onClick={() => onCellClick('W')} onDoubleClick={() => onCellDoubleClick('+')} />
			</>);
			break;
		default:
			console.error("ERROR unknown character read ", { chval });
	}

	return <>
		<line x1={x + halfdim} y1={y} x2={x + halfdim} y2={y + celldim} />
		<line x1={x} y1={y + halfdim} x2={x + celldim} y2={y + halfdim} />
		{/* <text x={x + halfdim} y={y + halfdim}>{chval+"("+r+","+c+")"}</text> */}
		{stoneelement}
	</>;

}

function GoBoard({ dims, sz, boardstring, turn, makeCellUpdate, makeBoardReset, makeBoardRandomize, makeBoardResize, makeTurnChange }) { /* sz is the number of squares on the board */

	function handleCellClick(r, c, color) {
		makeCellUpdate(r, c, color);
	}
	function handleCellDoubleClick(r, c, color) {
		color = '+';
		console.log("double clicked ", r, c, color);
		makeCellUpdate(r, c, color);
	}

	function handleResetClick() {
		makeBoardReset();
	}

	function handleRandomizeClick() {
		makeBoardRandomize();
	}

	function handleSizeClick(szval) {
		makeBoardResize(szval);
	}

	function handleTurnClick(turnval) {
		makeTurnChange(turnval);
	}

	let lines = boardstring.split('\n');
	let cells = [];
	let count = 0; /* serve as a key to cells array */
	for (let rindex = 0; rindex < sz; rindex++) {
		for (let cindex = 0; cindex < sz; cindex++) {
			let cell = lines[rindex][cindex];
			cells.push(
				<Cell
					key={count}
					boarddim={dims}
					boardsize={sz}
					r={rindex} c={cindex}
					chval={cell}
					onCellClick={() => handleCellClick(rindex, cindex, turn)}
					onCellDoubleClick={() => handleCellDoubleClick(rindex, cindex, '+')}
				/>
			);
			count++;
		}
	}


	return <>
		<svg height={dims} width={dims}>

			<g stroke="black">

				// ChatJippity gave me this for the grid numbers...
				{Array.from({ length: sz }, (_, i) => (
					<text key={i} x={i * (dims / sz) + (dims / sz) / 2} y={12} textAnchor="middle" dominantBaseline="middle" fontSize="12px">{String.fromCharCode(65 + i)}</text>
				))}
				{Array.from({ length: sz }, (_, i) => (
					<text key={i} x={12} y={i * (dims / sz) + (dims / sz) / 2} textAnchor="middle" dominantBaseline="middle" fontSize="12px">{sz - i}</text>
				))}

				{/* <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fontSize="100px">{sz}</text> */}
				<rect x="0" y="0" width="100%" height="100%" fill="gold" fill-opacity="0.5" stroke-opacity="1.0" />
				{cells}
				{/* <rect x="100" y="100" width={dims} height={dims} fill="green" fill-opacity="0.4" stroke-opacity="1.0" /> */}
			</g>
		</svg>

		<Controls onResetClick={handleResetClick} onRandomizeClick={handleRandomizeClick} onSizeClick={(szval) => handleSizeClick(szval)} sz={sz} turn={turn} onTurnClick={(turn) => handleTurnClick(turn)} />

	</>;
}

function Controls({ onResetClick, onRandomizeClick, onSizeClick, sz, turn, onTurnClick }) {
	return <div id="controls-wrapper">
			<div id="bullet-controls" class="vert-sep hori-sep">
				<fieldset>
					<legend>To move:</legend>
					<div>
						<input type="radio" id="black" name="tomove" value="black" checked={turn === 'B'} onClick={() => onTurnClick('B')} />
						<label for="black">Black</label>
					</div>
					<div>
						<input type="radio" id="white" name="tomove" value="white" checked={turn === 'W'} onClick={() => onTurnClick('W')} />
						<label for="white">White</label>
					</div>
				</fieldset>

				<fieldset>
					<legend>Board size:</legend>
					<div>
						<input type="radio" id="9" name="boardsize" checked={sz === 9} onClick={() => onSizeClick(9)} />
						<label for="9">9 x 9</label>
					</div>
					<div>
						<input type="radio" id="13" name="boardsize" checked={sz === 13} onClick={() => onSizeClick(13)} />
						<label for="13">13 x 13</label>
					</div>
					<div>
						<input type="radio" id="19" name="boardsize" checked={sz === 19} onClick={() => onSizeClick(19)} />
						<label for="19">19 x 19</label>
					</div>
				</fieldset>
			</div>
			<div id="button-controls" class="vert-sep hori-sep">

				<input type="button"
					onClick={onResetClick}
					value="CLEAR / RESET / NEW" />


				{/* <input type="button"
					onClick={onRandomizeClick}
					value="RANDOMIZE STONES" /> */}
			</div>
	</div>
}

function Info({ dump }) {

	let lines = dump.split('\n');

	return <>
		<div>
			{lines.map((line, index) => (
				<p key={index}>{line}</p>
			))}
		</div>
	</>
}

function GlobalErrorMessage({ message }) {
	return <>
		<div>
			<p>Oops, something went wrong...</p>
			<p>Please refresh, or try again later.</p>
			<p>Details: {new Date().getTime()}, {message}</p>
		</div>
	</>
}

export default function Board() {
	const [boardObjState, setBoardObjState] = useState(new GoBoardT(INIT_SIZE));
	const [turnState, setTurnState] = useState(INIT_TURN);

	function handleCellUpdate(r, c, color) {
		let newBoardObj = new GoBoardT(boardObjState.size);
		GoBoardT.propClone(boardObjState, newBoardObj);
		newBoardObj.placeStone(r, c, color);
		setBoardObjState(newBoardObj);
	}

	function handleBoardReset() {
		let currsize = boardObjState.size;
		let newBoardObj = new GoBoardT(currsize);
		setBoardObjState(newBoardObj);
	}

	function handleBoardRandomize() {
		let numOfRandomPieces = 5;
		let currsize = boardObjState.size;
		let newBoardObj = new GoBoardT(currsize);
		function getRandomInt(min, max) {
			const minCeiled = Math.ceil(min);
			const maxFloored = Math.floor(max);
			return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
		}
		for (let i = 0, piece = 'B'; i < numOfRandomPieces; i++) {// this is not perfect, can overwite when random generates collisions, fix me later
			newBoardObj.placeStone(getRandomInt(1, currsize), getRandomInt(1, currsize), piece);
			piece = piece === 'B' ? 'W' : 'B';

		}
		setBoardObjState(newBoardObj);
	}

	function handleBoardResize(szval) {
		let newBoardObj = new GoBoardT(szval);
		setBoardObjState(newBoardObj);
	}

	function handleTurnClick(turnval) {
		setTurnState(turnval);
	}

	try {

		return <div>
			<header>
				<h1>
					<a class="nostyle" href="https://en.wikipedia.org/wiki/Go_(game)"> Go | Wéiqí | Baduk </a>
				</h1>
			</header>
			<section id="board-app-wrapper">

				<GoBoard dims={INIT_BOARDDIM}
					sz={boardObjState.size}
					boardstring={boardObjState.getBoardGrid()}
					turn={turnState}
					makeCellUpdate={(r, c, color) => handleCellUpdate(r, c, color)}
					makeBoardReset={handleBoardReset}
					makeBoardRandomize={handleBoardRandomize}
					makeBoardResize={(szval) => handleBoardResize(szval)}
					makeTurnChange={(turnval) => handleTurnClick(turnval)}
				/>
				{/* <Info dump={boardObjState.getBoardGrid()} /> */}

			</section>

		</div>
	} catch (error) {
		console.error(error);
		return <GlobalErrorMessage message={error.message} />
	}


}
