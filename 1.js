let stopGame = false

const container = document.querySelector(".container")

function Gameboard() {
    this.board = [
        "", "", "", 
        "", "", "", 
        "", "", ""
    ]
}

function Player(name, symbol) {
    this.name = name
    this.symbol = symbol
}


let player1 = new Player("X", "X")
let player2 = new Player("O", "O")

const gameboard = new Gameboard()


const Game = (() => {
    let currentPlayer
    function startGame() {
        currentPlayer = player1
        if (!status) {
            display.createStatus()
        }

        display.statusTurn()
        
    }

    function switchPlayer() {
        if (currentPlayer === player1) {
            currentPlayer = player2
        } else {
            currentPlayer = player1
        }
        display.statusTurn()
    }

    function playTurn(position) {
        if (!stopGame) {
            gameboard.board[position] = currentPlayer.symbol
            display.renderBoard()
            if (checkWinner(currentPlayer.symbol)) {
                console.log(`${currentPlayer.name} wins!`)
                display.statusWin()
                display.renderBoard()
            } else if (checkTie()) {
                console.log("Tie!")
                display.statusTie()
                display.renderBoard()
            } else {
                switchPlayer()
            }
        }
    }

    function checkWinner(symbol) {
        let win = false
        let winCondition = 0
        const winningPositions = [
            [0, 1, 2], 
            [3, 4, 5], 
            [6, 7, 8], 
            [0, 3, 6], 
            [1, 4, 7], 
            [2, 5, 8], 
            [0, 4, 8], 
            [2, 4, 6]
        ]
        for (let i=0;i<winningPositions.length;i++) {
            for(let number=0;number<3;number++) {
                if (gameboard.board[winningPositions[i][number]] === symbol) {
                    winCondition ++
                }
            }
            if (winCondition === 3) {
                win = true
                stopGame = true
            }
            winCondition = 0
        }

        return win
    }

    function checkTie() {
        let tie = false
        if (!gameboard.board.includes("")) {
            tie = true
        }
        return tie
    }


    function restartGame() {
        gameboard.board = [
            "", "", "", 
            "", "", "", 
            "", "", ""
        ]
    }

    function getCurrentPlayer() {
        return currentPlayer
    }

    return {
        playTurn: playTurn,
        restartGame: restartGame,
        getCurrentPlayer: getCurrentPlayer,
        startGame: startGame
    }
})()







let status
const display = (() => {

    

    function statusTurn() {
        status.textContent = `${Game.getCurrentPlayer().name}'s turn!`
    }

    function statusWin() {
        status.textContent = `${Game.getCurrentPlayer().name} wins!`
    }

    function statusTie() {
        status.textContent = `Tie!`
    }

    const form = document.querySelector("form")
    const submitButton = document.querySelector(".submit-button")

    submitButton.addEventListener("click", (e)=>{
        e.preventDefault()
        form.style.display = "none"

        let player1Name = document.querySelector("#player1").value
        let player2Name = document.querySelector("#player2").value

        player1 = new Player(player1Name || "X", "X")
        player2 = new Player(player2Name || "O", "O")
        
        Game.startGame()

        
        
        
    })

    const restartButton = document.querySelector(".restart-button")
    const board = document.querySelector(".board")

    function createNineCells() {
        for (let i=0;i < 9;i++) {
            const cell = document.createElement("div")
            cell.classList.add("cell")
            board.appendChild(cell)
        }
    }
    createNineCells()

    const cells = document.querySelectorAll(".cell")

    function renderBoard() {
        for (let i=0;i<9;i++) {
            const consoleCell = gameboard.board[i]
            const cell = cells[i]
            cell.innerHTML = consoleCell
            changeXOcolor()
        }
    }

    function createStatus() {
        status = document.createElement("div")
        status.classList.add("status")

        container.prepend(status)
    }

    function changeXOcolor() {
        for (let i=0;i<9;i++) {
            const consoleCell = gameboard.board[i]
            const cell = cells[i]
            if (consoleCell==="X") {
                cell.style.color = "red" 
            } else if (consoleCell==="O") {
                cell.style.color = "blue"
            }
        }
    }

    restartButton.addEventListener("click", () => {
        Game.restartGame()
        renderBoard()
        status.textContent = "New Round!"
        stopGame = false
    })

    for (let i=0;i<9;i++) {
        const cell = cells[i]
        cell.addEventListener("click", () => {
            form.style.display = "none"
            if (gameboard.board.every(cell => cell === "")) {
                Game.startGame()
            }
            if (gameboard.board[i] ==="") {
                Game.playTurn(i)
            }
        })
    }

    

    return {
        renderBoard,
        statusTurn,
        statusTie,
        statusWin,
        createStatus
    }

})()