const montantInput = document.getElementById('montantInput');
const changerButton = document.getElementById('changerButton');
const resultat = document.getElementById('resultat');

changerButton.addEventListener('click', () => {
  const montant = parseInt(montantInput.value);

  if (montant > 0) {
    const solutions = changerBillets(montant);
    afficherResultat(solutions);
  } else {
    alert('Veuillez entrer un montant valide.');
  }
});

function changerBillets(montant, billets = [10000, 5000, 2000, 1000, 500], pieces = [25, 50, 100]) {
  const result = [];

  function backtrack(currentAmount, usedBills, usedPieces, memo = {}) {
    if (currentAmount === 0) {
      result.push({ billets: usedBills, pieces: usedPieces });
      return;
    }

    // Limit number of solutions to avoid excessive calculations
    if (result.length >= 60) {
      return;
    }

    // Use bills first
    for (const billet of billets) {
      if (currentAmount >= billet) {
        usedBills.push(billet);
        backtrack(currentAmount - billet, usedBills.slice(), usedPieces.slice(), memo);
        usedBills.pop();
      }
    }

    // If remaining amount is small and coins can cover it, use coins
    if (currentAmount > 0 && isCoinSufficient(currentAmount, pieces)) {
      for (const coin of pieces) {
        if (currentAmount >= coin) {
          const maxCoinUsage = Math.floor(currentAmount / coin); // Maximum times a coin can be used
          for (let i = 1; i <= maxCoinUsage; i++) {
            usedPieces.push(coin);
            backtrack(currentAmount - (coin * i), usedBills.slice(), usedPieces.slice(), memo);
          }
        }
      }
    }
  }

  function isCoinSufficient(amount, coins) {
    for (const coin of coins) {
      if (amount % coin === 0) {
        return true;
      }
    }
    return false;
  }

  backtrack(montant, [], []);
  return result;
}

function afficherResultat(solutions) {
  resultat.innerHTML = '';

  if (solutions.length > 0) {
    resultat.innerHTML += '<p>Voici toutes les combinaisons possibles de billets pour changer votre montant :</p>';

    for (const solution of solutions) {
      const billString = solution.billets.length > 0 ? solution.billets.join(', ') + ' CFA' : 'Aucun billet';
      const coinString = solution.pieces.length > 0 ? solution.pieces.join(', ') + ' CFA' : 'Aucune pièce';
      resultat.innerHTML += `<p>- ${billString} et ${coinString}</p>`;
    }
  } else {
    resultat.innerHTML += '<p>Il n\'est pas possible de changer ce montant avec les billets disponibles.</p>';
  }
}
