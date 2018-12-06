#!/usr/bin/env node
var chalk = require('chalk');
var inquirer = require('inquirer');
let newWord = require('./allWords.js');
let messages = require('./messages.js');
let validation = require('./wordWizardValidation.js');
let correctWord = newWord();

correctWord.generateLetters();

var guessesRemainingSetting = 3;
var guessesRemaining = guessesRemainingSetting;
var guessesSoFar = [];
let hint = '';

console.log(chalk.cyan(messages.welcomeMessage));

function evaluateResponse(response) {
  if (response.confirm) {
    console.log(chalk.cyan("\nGreat! The Word Wizard is conjuring a new word..."));
    main();
  } else {
    console.log(chalk.cyan("\nThe Word Wizard is displeased!\n"));
    return 'skip';
  };
}

// Reset function
function endGame(outcome) {
  if (outcome === 'winner') {
    console.log(chalk.blue.bold("\nPraise the Word Wizard! You have won!"));
    console.log(chalk.yellow("You guessed ") + chalk.cyanBright.bold(correctWord.correctWord.toUpperCase()) + " " + chalk.yellow("with " + (guessesRemaining) + " guesses remain.") + "\n");
  } else {
    console.log("\n" + chalk.bgRed.white.bold("You have lost! The Word Wizard is displeased..."));
    console.log(chalk.yellow("The correct word was: ") + chalk.yellow(correctWord.correctWord + ".") + "\n");
  };

  correctWord = newWord();
  correctWord.generateLetters();
  guessesRemaining = guessesRemainingSetting;
  guessesSoFar = [];
  hint = '';

  inquirer.prompt([
    {
      message: messages.replay,
      name: "confirm",
      type:"confirm",
    }
  ]).then(function(response) {
    if(evaluateResponse(response) == 'skip') {
      return 'skip';
    };
  });

};

function evaluateUserInput(guess) {
  if (!correctWord.correctWord.includes(guess)) {
    guessesRemaining--;
  }
  guessesSoFar.push(guess.toUpperCase());

  for (var i = 0; i < correctWord.letters.length; i++) {
    correctWord.letters[i].check(guess);
  };
  if (correctWord.update().toLowerCase() == correctWord.correctWord.toLowerCase()) {
    return endGame('winner');
  };
  if (guessesRemaining < 6) {
    hint = correctWord.hint;
  };
  if (guessesRemaining == 0) {

    return endGame('loss');
  };
}

// Main game

function main() {
  inquirer.prompt([
    {
      name: "guess",
      prefix: '',
      message: "\nWord: " + chalk.cyanBright(correctWord.update()) +
        "\n\nGuesses remaining: " + chalk.magenta.bold(guessesRemaining) +
        "\nIncorrect guesses so far: " + chalk.magenta.bold(guessesSoFar.join(' ')) + "\n" +
        "\nCategory: " + chalk.yellow(correctWord.category) + "\n" +
        "\nHint: " + chalk.red(hint) + "\n" +
        "Guess a letter:"
    }
  ]).then(function (data) {

    validation.validateUserInput(data.guess, guessesSoFar);

    // evaluateUserInput(correctWord, data, guessesRemaining, guessesSoFar, hint);

    // Only decrement guessesRemaining on an incorrect guess
      // if (!correctWord.correctWord.includes(data.guess)) {
      //   guessesRemaining--;
      // }
      // guessesSoFar.push(data.guess.toUpperCase());

      // for (var i = 0; i < correctWord.letters.length; i++) {
      //   correctWord.letters[i].check(data.guess);
      // };
      // if (correctWord.update().toLowerCase() == correctWord.correctWord.toLowerCase()) {
      //   endGame('winner');
      //   return;
      // };
      // if (guessesRemaining < 6) {
      //   hint = correctWord.hint;
      // };
      // if (guessesRemaining == 0) {
      //   endGame('loss');
      //   return;
      // };

  if(evaluateUserInput(data.guess) == 'skip') {
    return;
  };

  main();
  });
};

main();