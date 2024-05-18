document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const solveBtn = document.getElementById('solve-btn');
    const clearBtn = document.getElementById('clear-btn');
    const checkBtn = document.getElementById('check-btn');
    const tableBody = document.querySelector('tbody');
    const feedback = document.getElementById('feedback');

    // Initialize an empty 9x9 grid
    let grid = Array.from({ length: 9 }, () => Array(9).fill(''));

    function createSudokuGrid() {
        tableBody.innerHTML = '';
        for (let i = 0; i < 9; i++) {
            const row = document.createElement('tr');
            for (let j = 0; j < 9; j++) {
                const cell = document.createElement('td');
                const input = document.createElement('input');
                input.setAttribute('type', 'text');
                input.setAttribute('maxlength', '1');
                input.setAttribute('data-row', i);
                input.setAttribute('data-col', j);
                input.value = grid[i][j];
                input.addEventListener('input', handleInput);
                cell.appendChild(input);
                row.appendChild(cell);
            }
            tableBody.appendChild(row);
        }
    }

    function handleInput(event) {
        const input = event.target;
        const row = input.getAttribute('data-row');
        const col = input.getAttribute('data-col');
        const value = input.value;

        if (value >= 1 && value <= 9) {
            grid[row][col] = parseInt(value, 10);
        } else {
            input.value = '';
            grid[row][col] = '';
        }
    }

    function generateRandomSudoku() {
        clearSudoku();

        function shuffle(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }

        function isValid(board, row, col, num) {
            for (let x = 0; x < 9; x++) {
                if (board[row][x] == num || board[x][col] == num || board[3 * Math.floor(row / 3) + Math.floor(x / 3)][3 * Math.floor(col / 3) + x % 3] == num) {
                    return false;
                }
            }
            return true;
        }

        function fillDiagonalSubgrids(board) {
            for (let i = 0; i < 9; i += 3) {
                let nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
                for (let row = 0; row < 3; row++) {
                    for (let col = 0; col < 3; col++) {
                        board[row + i][col + i] = nums.pop();
                    }
                }
            }
        }

        function fillRemaining(board, row = 0, col = 0) {
            if (col >= 9 && row < 8) {
                row++;
                col = 0;
            }
            if (row >= 9 && col >= 9) {
                return true;
            }
            if (row < 3) {
                if (col < 3) {
                    col = 3;
                }
            } else if (row < 6) {
                if (col === Math.floor(row / 3) * 3) {
                    col += 3;
                }
            } else {
                if (col === 6) {
                    row++;
                    col = 0;
                    if (row >= 9) {
                        return true;
                    }
                }
            }
            for (let num = 1; num <= 9; num++) {
                if (isValid(board, row, col, num)) {
                    board[row][col] = num;
                    if (fillRemaining(board, row, col + 1)) {
                        return true;
                    }
                    board[row][col] = '';
                }
            }
            return false;
        }

        function removeNumbers(board, level = 50) {
            for (let i = 0; i < level; i++) {
                let row = Math.floor(Math.random() * 9);
                let col = Math.floor(Math.random() * 9);
                while (board[row][col] === '') {
                    row = Math.floor(Math.random() * 9);
                    col = Math.floor(Math.random() * 9);
                }
                board[row][col] = '';
            }
        }

        grid = Array.from({ length: 9 }, () => Array(9).fill(''));
        fillDiagonalSubgrids(grid);
        fillRemaining(grid);
        removeNumbers(grid);
        createSudokuGrid();
    }

    function solveSudoku() {
        function isValid(board, row, col, num) {
            for (let x = 0; x < 9; x++) {
                if (board[row][x] == num || board[x][col] == num || board[3 * Math.floor(row / 3) + Math.floor(x / 3)][3 * Math.floor(col / 3) + x % 3] == num) {
                    return false;
                }
            }
            return true;
        }

        function solve(board) {
            for (let row = 0; row < 9; row++) {
                for (let col = 0; col < 9; col++) {
                    if (board[row][col] == '') {
                        for (let num = 1; num <= 9; num++) {
                            if (isValid(board, row, col, num)) {
                                board[row][col] = num;
                                if (solve(board)) {
                                    return true;
                                }
                                board[row][col] = '';
                            }
                        }
                        return false;
                    }
                }
            }
            return true;
        }

        solve(grid);
        createSudokuGrid();
    }

    function clearSudoku() {
        grid = Array.from({ length: 9 }, () => Array(9).fill(''));
        createSudokuGrid();
        feedback.textContent = '';
    }

    function checkSolution() {
        function isValid(board, row, col, num) {
            for (let x = 0; x < 9; x++) {
                if (x !== col && board[row][x] == num) return false;
                if (x !== row && board[x][col] == num) return false;
                let boxRow = 3 * Math.floor(row / 3) + Math.floor(x / 3);
                let boxCol = 3 * Math.floor(col / 3) + x % 3;
                if ((boxRow !== row || boxCol !== col) && board[boxRow][boxCol] == num) return false;
            }
            return true;
        }

        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                let num = grid[row][col];
                if (num === '' || !isValid(grid, row, col, num)) {
                    feedback.textContent = 'Incorrect Solution';
                    feedback.style.color = 'red';
                    return;
                }
            }
        }
        feedback.textContent = 'Correct Solution!';
        feedback.style.color = 'green';
    }

    generateBtn.addEventListener('click', generateRandomSudoku);
    solveBtn.addEventListener('click', solveSudoku);
    clearBtn.addEventListener('click', clearSudoku);
    checkBtn.addEventListener('click', checkSolution);

    createSudokuGrid();
});
