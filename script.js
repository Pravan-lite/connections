const groups = [
    {
        name: "ANTIVIRUS SOFTWARE",
        color: "blue",
        words: [
            "DEFENDER",
            "MALWAREBYTES",
            "MCAFEE",
            "BITDEFENDER"
        ]
    },

    {
        name: "COMMON CYBERPATRIOT POINTS",
        color: "green",
        words: [
            "LSP",
            "GPO",
            "USERS",
            "SERVICES"
        ]
    },

    {
        name: "LINUX MINT RELEASES",
        color: "yellow",
        words: [
            "GIGI",
            "ZARA",
            "WILMA",
            "VIRGINIA"
        ]
    },

    {
        name: "CYBERPATRIOT OPEN DIVISION WINNERS",
        color: "purple",
        words: [
            "TITANTURTLES",
            "PHOENIX",
            "HALF DOME",
            "TEMPEST"
        ]
    }
];

let words = [];
let selected = [];
let solvedGroups = [];
let mistakes = 4;

const board = document.getElementById("game-board");
const solvedContainer = document.getElementById("solved-container");
const mistakesDisplay = document.getElementById("mistakes");
const message = document.getElementById("message");
const submitButton = document.getElementById("submit-button");
const shuffleButton = document.getElementById("shuffle-button");
const winScreen = document.getElementById("win-screen");
const flagDisplay = document.getElementById("flag");
const playAgainButton = document.getElementById("play-again");

function startGame() {
    words = [];

    groups.forEach(group => {
        group.words.forEach(word => {
            words.push({
                word: word,
                group: group
            });
        });
    });

    shuffleArray(words);

    selected = [];
    solvedGroups = [];
    mistakes = 4;

    mistakesDisplay.textContent = mistakes;
    message.textContent = "";

    solvedContainer.innerHTML = "";
    board.innerHTML = "";

    winScreen.classList.add("hidden");

    renderBoard();
}

function renderBoard() {
    board.innerHTML = "";

    words.forEach(item => {
        const button = document.createElement("button");

        button.className = "word";
        button.textContent = item.word;

        if (
            selected.some(selectedItem =>
                selectedItem.word === item.word
            )
        ) {
            button.classList.add("selected");
        }

        button.addEventListener("click", () => selectWord(item));

        board.appendChild(button);
    });
}

function selectWord(item) {

    if (
        selected.some(selectedItem =>
            selectedItem.word === item.word
        )
    ) {
        selected = selected.filter(selectedItem =>
            selectedItem.word !== item.word
        );
    } else {

        if (selected.length >= 4) {
            return;
        }

        selected.push(item);
    }

    renderBoard();
}

function submitSelection() {

    if (selected.length !== 4) {
        message.textContent = "Select exactly four words.";
        return;
    }

    const selectedGroups = selected.map(item => item.group);

    const sameGroup = selectedGroups.every(
        group => group === selectedGroups[0]
    );

    if (sameGroup) {

        const group = selectedGroups[0];

        solveGroup(group);

        selected = [];

        message.textContent = "Correct!";

        renderBoard();

        if (solvedGroups.length === groups.length) {
            setTimeout(showWinScreen, 500);
        }

    } else {

        mistakes--;
        mistakesDisplay.textContent = mistakes;

        message.textContent = "Not quite!";

        selected = [];

        renderBoard();

        if (mistakes === 0) {
            setTimeout(() => {
                alert("Game over! Try again.");
                startGame();
            }, 100);
        }
    }
}

function solveGroup(group) {

    solvedGroups.push(group);

    words = words.filter(item =>
        item.group !== group
    );

    const groupBox = document.createElement("div");

    groupBox.className =
        "solved-group " + group.color;

    const title = document.createElement("div");

    title.className = "solved-title";
    title.textContent = group.name;

    const solvedWords = document.createElement("div");

    solvedWords.className = "solved-words";
    solvedWords.textContent = group.words.join(" • ");

    groupBox.appendChild(title);
    groupBox.appendChild(solvedWords);

    solvedContainer.appendChild(groupBox);
}

function shuffleArray(array) {

    for (let i = array.length - 1; i > 0; i--) {

        const j = Math.floor(
            Math.random() * (i + 1)
        );

        [array[i], array[j]] =
            [array[j], array[i]];
    }
}

function showWinScreen() {

    flagDisplay.textContent =
        "flag{c0nn3ct10ns_m4st3r}";

    winScreen.classList.remove("hidden");
}

shuffleButton.addEventListener(
    "click",
    () => {
        shuffleArray(words);
        renderBoard();
        message.textContent = "";
    }
);

submitButton.addEventListener(
    "click",
    submitSelection
);

playAgainButton.addEventListener(
    "click",
    startGame
);

startGame();
