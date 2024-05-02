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

function changerBillets(montant, billets = [500, 1000, 2000, 5000, 10000], pieces = [25, 50, 100]) {
    const result = [];
    const usedCombinations = new Set(); // Set to store unique combinations

    function backtrack(currentAmount, usedBills, usedPieces) {
        if (currentAmount === 0) {
            const sortedCombination = [...usedBills, ...usedPieces].sort((a, b) => b - a);
            const combinationString = sortedCombination.join(',');

            if (!usedCombinations.has(combinationString)) {
                result.push({ billets: usedBills, pieces: usedPieces });
                usedCombinations.add(combinationString);
            }
            return;
        }

        // Limit number of solutions to avoid excessive calculations
        if (result.length >= 60) {
            return;
        }

        for (const billet of billets) {
            if (currentAmount >= billet) {
                usedBills.push(billet);
                backtrack(currentAmount - billet, usedBills.slice(), usedPieces.slice());
                usedBills.pop();
            }
        }

        for (const piece of pieces) {
            if (currentAmount >= piece) {
                usedPieces.push(piece);
                backtrack(currentAmount - piece, usedBills.slice(), usedPieces.slice());
                usedPieces.pop();
            }
        }
    }

    backtrack(montant, [], []);
    return result;
}
function afficherResultat(solutions) {
    resultat.innerHTML = '';

    if (solutions.length > 0) {
        resultat.innerHTML += '<p>Voici toutes les combinaisons possibles de billets et pièces pour changer votre montant :</p>';

        // Sort solutions with bills first
        solutions.sort((a, b) => {
            const hasBillsA = a.billets.length > 0;
            const hasBillsB = b.billets.length > 0;
            return hasBillsB - hasBillsA; // Bills first
        });

        for (const solution of solutions.slice(0, 60)) {
            const billString = solution.billets.length > 0 ? solution.billets.join(', ') + ' CFA' : 'Aucun billet';
            const coinString = solution.pieces.length > 0 ? solution.pieces.join(', ') + ' CFA' : 'Aucune pièce';
            resultat.innerHTML += `<p>- ${billString} et ${coinString}</p>`;
        }
    } else {
        resultat.innerHTML += '<p>Il n\'est pas possible de changer ce montant avec les billets et pièces disponibles.</p>';
    }
}
