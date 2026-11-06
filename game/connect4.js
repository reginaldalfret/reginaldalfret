/**
 * Connect Four Engine for GitHub Profile README
 * Handles moves, checks win conditions, updates README.md, and interacts with GitHub API.
 */

const fs = require('fs');
const path = require('path');

const STATE_FILE = path.join(__dirname, 'state.json');
const README_FILE = path.join(__dirname, '..', 'README.md');
const REPO = process.env.REPOSITORY || 'reginaldalfret/reginaldalfret';

const ROWS = 6;
const COLS = 7;

function getInitialState() {
  return {
    board: Array.from({ length: ROWS }, () => Array(COLS).fill(0)),
    currentTurn: 'red', // 'red' (1) or 'blue' (2)
    totalMoves: 0,
    winner: null,
    recentMoves: [],
  };
}

function loadState() {
  if (fs.existsSync(STATE_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
    } catch {
      return getInitialState();
    }
  }
  return getInitialState();
}

function saveState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf8');
}

function checkWin(board, r, c, val) {
  const directions = [
    [0, 1],  // Horizontal
    [1, 0],  // Vertical
    [1, 1],  // Diagonal down-right
    [1, -1], // Diagonal down-left
  ];

  for (const [dr, dc] of directions) {
    let count = 1;

    // Check forward
    let step = 1;
    while (true) {
      const nr = r + dr * step;
      const nc = c + dc * step;
      if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && board[nr][nc] === val) {
        count++;
        step++;
      } else {
        break;
      }
    }

    // Check backward
    step = 1;
    while (true) {
      const nr = r - dr * step;
      const nc = c - dc * step;
      if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && board[nr][nc] === val) {
        count++;
        step++;
      } else {
        break;
      }
    }

    if (count >= 4) return true;
  }
  return false;
}

function dropPiece(board, col, val) {
  for (let r = ROWS - 1; r >= 0; r--) {
    if (board[r][col] === 0) {
      board[r][col] = val;
      return r;
    }
  }
  return -1; // Column full
}

function getValidCols(board) {
  const cols = [];
  for (let c = 0; c < COLS; c++) {
    if (board[0][c] === 0) cols.push(c);
  }
  return cols;
}

function chooseAiMove(board, aiVal) {
  const validCols = getValidCols(board);
  if (validCols.length === 0) return -1;

  const opponentVal = aiVal === 1 ? 2 : 1;

  // 1. Can AI win on this turn?
  for (const c of validCols) {
    const copy = board.map(row => [...row]);
    const r = dropPiece(copy, c, aiVal);
    if (r !== -1 && checkWin(copy, r, c, aiVal)) return c;
  }

  // 2. Can opponent win on their next turn? Block them!
  for (const c of validCols) {
    const copy = board.map(row => [...row]);
    const r = dropPiece(copy, c, opponentVal);
    if (r !== -1 && checkWin(copy, r, c, opponentVal)) return c;
  }

  // 3. Prefer center column (col 3), then near center
  const pref = [3, 2, 4, 1, 5, 0, 6];
  for (const c of pref) {
    if (validCols.includes(c)) return c;
  }

  return validCols[0];
}

function renderMarkdown(state) {
  const isRed = state.currentTurn === 'red';
  const turnEmoji = isRed ? '🔴 Red' : '🔵 Blue';
  const issueBase = `https://github.com/${REPO}/issues/new`;

  let out = `### 🎮 Community Connect Four Game\n\n`;

  if (state.winner) {
    const winnerName = state.winner === 'draw' ? 'Nobody (Draw Game!)' : (state.winner === 'red' ? '🔴 Red Team' : '🔵 Blue Team');
    out += `🎉 **Game Over! Winner: ${winnerName}** 🎉\n\n`;
    out += `[🔄 Click here to Start a New Game](${issueBase}?title=connect4:reset&body=Click+%27Submit+new+issue%27+to+reset+the+board+and+start+a+fresh+game.)\n\n`;
  } else {
    out += `Everyone is welcome to play! Click a **column number** below to drop your chip.  \n`;
    out += `Current Turn: **${turnEmoji}** (Moves played: **${state.totalMoves}**)\n\n`;
  }

  // Header column links
  const headerLinks = [];
  for (let c = 1; c <= COLS; c++) {
    if (!state.winner && state.board[0][c - 1] === 0) {
      const title = encodeURIComponent(`connect4:drop:${c}`);
      const body = encodeURIComponent(`Click 'Submit new issue' to drop a chip in Column ${c}. The board will automatically update in seconds!`);
      headerLinks.push(`[${c}](${issueBase}?title=${title}&body=${body})`);
    } else {
      headerLinks.push(`${c}`);
    }
  }

  out += `| ${headerLinks.join(' | ')} |\n`;
  out += `| ${Array(COLS).fill(':-:').join(' | ')} |\n`;

  // Board rows
  for (let r = 0; r < ROWS; r++) {
    const rowCells = [];
    for (let c = 0; c < COLS; c++) {
      const v = state.board[r][c];
      if (v === 1) rowCells.push('🔴');
      else if (v === 2) rowCells.push('🔵');
      else rowCells.push('⚪');
    }
    out += `| ${rowCells.join(' | ')} |\n`;
  }

  out += `\n`;
  if (!state.winner) {
    const aiTitle = encodeURIComponent(`connect4:ai`);
    const aiBody = encodeURIComponent(`Click 'Submit new issue' to have the AI bot make the next turn.`);
    const resetTitle = encodeURIComponent(`connect4:reset`);
    const resetBody = encodeURIComponent(`Click 'Submit new issue' to reset the board.`);
    out += `🤖 Waiting for a player? [Request an AI Move](${issueBase}?title=${aiTitle}&body=${aiBody}) &nbsp;•&nbsp; 🔄 [Reset Game](${issueBase}?title=${resetTitle}&body=${resetBody})\n\n`;
  }

  if (state.recentMoves && state.recentMoves.length > 0) {
    out += `**Recent Moves:**\n\n`;
    out += `| Team | Column | Player |\n`;
    out += `| :--: | :----: | :----- |\n`;
    for (const m of state.recentMoves.slice(0, 5)) {
      const teamIcon = m.team === 'red' ? '🔴 Red' : '🔵 Blue';
      const playerLink = m.player === 'AI Bot' ? '🤖 AI Bot' : `[@${m.player}](https://github.com/${m.player})`;
      out += `| ${teamIcon} | Col ${m.col} | ${playerLink} |\n`;
    }
  }

  return out.trim();
}

function updateReadme(state) {
  if (!fs.existsSync(README_FILE)) {
    console.error('README file not found:', README_FILE);
    return;
  }

  let readme = fs.readFileSync(README_FILE, 'utf8');
  const startTag = '<!-- START CONNECT4 -->';
  const endTag = '<!-- END CONNECT4 -->';

  const sIdx = readme.indexOf(startTag);
  const eIdx = readme.indexOf(endTag);

  const gameMd = renderMarkdown(state);

  if (sIdx !== -1 && eIdx !== -1) {
    readme = readme.substring(0, sIdx + startTag.length) + '\n\n' + gameMd + '\n\n' + readme.substring(eIdx);
  } else {
    // Append to end of file
    readme += `\n\n${startTag}\n\n${gameMd}\n\n${endTag}\n`;
  }

  fs.writeFileSync(README_FILE, readme, 'utf8');
}

function handleIssue() {
  const issueTitle = (process.env.EVENT_ISSUE_TITLE || '').trim();
  const issueUser = process.env.EVENT_USER_LOGIN || 'guest';
  const state = loadState();

  console.log(`Processing action: "${issueTitle}" from user @${issueUser}`);

  if (issueTitle.startsWith('connect4:reset')) {
    const newState = getInitialState();
    saveState(newState);
    updateReadme(newState);
    console.log('Game reset successfully.');
    return;
  }

  if (state.winner) {
    console.log('Game already finished. Submit connect4:reset to start over.');
    return;
  }

  const currentVal = state.currentTurn === 'red' ? 1 : 2;
  const currentTeam = state.currentTurn;

  let chosenCol = -1;
  let isAi = false;

  if (issueTitle.startsWith('connect4:ai')) {
    chosenCol = chooseAiMove(state.board, currentVal);
    isAi = true;
  } else if (issueTitle.startsWith('connect4:drop:')) {
    const colNum = parseInt(issueTitle.split(':')[2], 10);
    if (!isNaN(colNum) && colNum >= 1 && colNum <= COLS) {
      chosenCol = colNum - 1;
    }
  }

  if (chosenCol === -1) {
    console.log('Invalid column requested.');
    return;
  }

  const rowPlaced = dropPiece(state.board, chosenCol, currentVal);
  if (rowPlaced === -1) {
    console.log(`Column ${chosenCol + 1} is already full.`);
    return;
  }

  state.totalMoves++;
  const playerName = isAi ? 'AI Bot' : issueUser;

  state.recentMoves.unshift({
    team: currentTeam,
    col: chosenCol + 1,
    player: playerName,
  });

  if (checkWin(state.board, rowPlaced, chosenCol, currentVal)) {
    state.winner = currentTeam;
    console.log(`🎉 Winner detected: ${currentTeam}!`);
  } else if (state.totalMoves >= ROWS * COLS) {
    state.winner = 'draw';
    console.log(`Game ended in a draw!`);
  } else {
    state.currentTurn = state.currentTurn === 'red' ? 'blue' : 'red';
  }

  saveState(state);
  updateReadme(state);
  console.log(`Move played: Col ${chosenCol + 1} by @${playerName}. Next turn: ${state.currentTurn}`);
}

// If run from CLI with --init, just initialize state & update README
if (process.argv.includes('--init')) {
  const state = loadState();
  saveState(state);
  updateReadme(state);
  console.log('Initialized Connect Four state and README.');
} else {
  handleIssue();
}
