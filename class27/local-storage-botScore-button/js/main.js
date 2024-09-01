let player1DeckID = null;
let player2DeckID = null;
let player1Score = 0;
let player2Score = 0;
let round = 0;
const maxRounds = 100; // Set a limit to avoid infinite games

document.querySelector('#dealCards').addEventListener('click', handleButtonClick);

function handleButtonClick() {
    if (!player1DeckID || !player2DeckID) {
        shuffleNewDecks();
    } else {
        playRound();
    }
}

function shuffleNewDecks() {
    const url = `https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1`;

    // Shuffle and fetch Player 1's deck
    fetch(url)
        .then(res => res.json())
        .then(data => {
            player1DeckID = data.deck_id;
            return fetch(url); // Shuffle and fetch Player 2's deck
        })
        .then(res => res.json())
        .then(data => {
            player2DeckID = data.deck_id;
            updateButtonToDeal();
        })
        .catch(err => console.error(`Error: ${err}`));
}

function playRound() {
    if (round >= maxRounds) {
        declareWinner();
        return;
    }

    round++;
    const player1DrawUrl = `https://www.deckofcardsapi.com/api/deck/${player1DeckID}/draw/?count=1`;
    const player2DrawUrl = `https://www.deckofcardsapi.com/api/deck/${player2DeckID}/draw/?count=1`;

    Promise.all([fetch(player1DrawUrl), fetch(player2DrawUrl)])
        .then(responses => Promise.all(responses.map(res => res.json())))
        .then(([player1Data, player2Data]) => {
            const player1Card = player1Data.cards[0];
            const player2Card = player2Data.cards[0];

            document.querySelector('#player1Image1').src = player1Card.image;
            document.querySelector('#player2Image1').src = player2Card.image;

            let player1Value = convertToNums(player1Card.value);
            let player2Value = convertToNums(player2Card.value);

            if (player1Value > player2Value) {
                player1Score++;
                document.querySelector('#results').textContent = `Player 1 wins the round with a value of ${player1Value}!`;
            } else if (player1Value < player2Value) {
                player2Score++;
                document.querySelector('#results').textContent = `Player 2 wins the round with a value of ${player2Value}!`;
            } else {
                document.querySelector('#results').textContent = "It's a tie! Initiating war...";
                handleWar(player1Value, player2Value);
            }

            document.querySelector('#player1Score').textContent = player1Score;
            document.querySelector('#player2Score').textContent = player2Score;

            if (player1Data.remaining === 0 || player2Data.remaining === 0) {
                declareWinner();
            }
        })
        .catch(err => console.error(`Error: ${err}`));
}

function handleWar(player1Value, player2Value) {
    // In war, both players draw 3 more cards (if available), and compare the last drawn card
    const warDrawCount = 3;
    const player1WarUrl = `https://www.deckofcardsapi.com/api/deck/${player1DeckID}/draw/?count=${warDrawCount}`;
    const player2WarUrl = `https://www.deckofcardsapi.com/api/deck/${player2DeckID}/draw/?count=${warDrawCount}`;

    Promise.all([fetch(player1WarUrl), fetch(player2WarUrl)])
        .then(responses => Promise.all(responses.map(res => res.json())))
        .then(([player1WarData, player2WarData]) => {
            const player1FinalValue = convertToNums(player1WarData.cards[warDrawCount - 1].value);
            const player2FinalValue = convertToNums(player2WarData.cards[warDrawCount - 1].value);

            if (player1FinalValue > player2FinalValue) {
                player1Score += warDrawCount; // Player 1 wins the war and takes all cards
                document.querySelector('#results').textContent = `Player 1 wins the war with a value of ${player1FinalValue}!`;
            } else if (player1FinalValue < player2FinalValue) {
                player2Score += warDrawCount; // Player 2 wins the war and takes all cards
                document.querySelector('#results').textContent = `Player 2 wins the war with a value of ${player2FinalValue}!`;
            } else {
                document.querySelector('#results').textContent = "Another tie in war! Another war initiated...";
                handleWar(player1FinalValue, player2FinalValue); // Recursive call in case of another tie
            }

            document.querySelector('#player1Score').textContent = player1Score;
            document.querySelector('#player2Score').textContent = player2Score;
        })
        .catch(err => console.error(`Error: ${err}`));
}

function convertToNums(value) {
    const cardValues = {
        'JACK': 11,
        'QUEEN': 12,
        'KING': 13,
        'ACE': 14
    };
    return cardValues[value] || parseInt(value);
}

function updateButtonToDeal() {
    const dealButton = document.querySelector('#dealCards');
    dealButton.textContent = "Play Round";
    dealButton.removeEventListener('click', shuffleNewDecks);
    dealButton.addEventListener('click', handleButtonClick);
}

function updateButtonToShuffle() {
    const dealButton = document.querySelector('#dealCards');
    dealButton.textContent = "Shuffle New Decks";
    dealButton.removeEventListener('click', handleButtonClick);
    dealButton.addEventListener('click', shuffleNewDecks);
}

function declareWinner() {
    if (player1Score > player2Score) {
        document.querySelector('#results').textContent = `Player 1 wins the game with ${player1Score} points!`;
    } else if (player1Score < player2Score) {
        document.querySelector('#results').textContent = `Player 2 wins the game with ${player2Score} points!`;
    } else {
        document.querySelector('#results').textContent = "The game is a tie!";
    }

    updateButtonToShuffle(); // Reset the game to shuffle new decks
}
