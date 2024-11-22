class ProbabilityCalculator {
  static calculateProbabilities(diceConfigs) {
      const probabilities = [];
      for (let i = 0; i < diceConfigs.length; i++) {
          const row = [];
          for (let j = 0; j < diceConfigs.length; j++) {
              {
                const wins = countWins(diceConfigs[i], diceConfigs[j]);
                const probability = wins / 36;
                row.push(probability);
              }
          }
          probabilities.push(row);
      }
      return probabilities;
  }
}

function countWins(a, b) {
  let n = 0;
  for (let x of a) {
      for (let y of b) {
          if (x > y) n++;
      }
  }
  return n;
}

module.exports = ProbabilityCalculator;