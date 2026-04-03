//Take elements from DOM
const cells = document.querySelectorAll(".cell");
const resetBtn = document.getElementById("resetBtn");
const statusText = document.getElementById("status");
const clickSound = new Audio("sounds/click.mp3.wav");
const winSound = new Audio("sounds/win.mp3.wav");
const drawSound = new Audio("sounds/draw.mp3.wav");
const resetSound = new Audio("sounds/reset.mp3.wav");
const xScoreText = document.getElementById("xScore");
const oScoreText = document.getElementById("oScore");

let xScore = 0;
let oScore = 0;
let currentPlayer = "X";
let gameActive = true;


const winningCombos = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
];


cells.forEach(cell => {
    cell.addEventListener("click", () => {

        if (!gameActive || cell.textContent !== "") return;

        cell.textContent = currentPlayer;
        cell.classList.add("filled");
        clickSound.play();

        if (checkWinner()) {
            gameActive = false;
            winSound.play();
            return;
        }

        // check draw
        const isDraw = [...cells].every(cell => cell.textContent !== "");

        if (isDraw) {
            statusText.textContent = "It's a Draw!";
            drawSound.play();
            gameActive = false;
            return;
        }

        currentPlayer = currentPlayer === "X" ? "O" : "X";
        statusText.textContent = `Player ${currentPlayer}'s Turn`;
    });
});


function checkWinner() {

    for (let combo of winningCombos) {
        const [a, b, c] = combo;

        if (
            cells[a].textContent &&
            cells[a].textContent === cells[b].textContent &&
            cells[a].textContent === cells[c].textContent
        ) {
            const winner = cells[a].textContent;

            if (winner === "X") {
                xScore++;
                xScoreText.textContent = xScore;
            } else {
                oScore++;
                oScoreText.textContent = oScore;
            }

            statusText.textContent = winner + " Wins!";
            return true;
        }
    }
    
    return false;
}


resetBtn.addEventListener("click", function () {  

  resetSound.play();

  cells.forEach (cell => {
    cell.textContent = "";
    cell.classList.remove("filled");
  });

  currentPlayer = "X";
  gameActive = true;
  statusText.textContent = "Player X's Turn";
});