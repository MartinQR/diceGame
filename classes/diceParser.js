class DiceParser {
  static parse(dices) {

    if (dices.length < 3) {
      throw new Error("You must provide at least 3 dice configurations.");
    }

    return dices.map(dice => {
      const correctDice = dice.split(',').map(Number);

      if (correctDice.length !== 6 || correctDice.some(isNaN)) {
        throw new Error(`Invalid dice configuration: ${dice}. Each dice must have 6 integers.`);
      }

      return correctDice;
    });
  }
}



module.exports = DiceParser;