function allowedOperations(a, b, aStr, bStr) {
    const operations = [];
    if (document.getElementById('addition').checked) {
        operations.push([a + b, `(${aStr} + ${bStr})`]);
    }
    if (document.getElementById('subtraction').checked) {
        operations.push([a - b, `(${aStr} - ${bStr})`]);
        operations.push([b - a, `(${bStr} - ${aStr})`]);
    }
    if (document.getElementById('multiplication').checked) {
        operations.push([a * b, `(${aStr} * ${bStr})`]);
    }
    if (document.getElementById('division').checked && b !== 0 && a % b === 0) {
        operations.push([Math.floor(a / b), `(${aStr} / ${bStr})`]);
    }
    if (document.getElementById('division').checked && a !== 0 && b % a === 0) {
        operations.push([Math.floor(b / a), `(${bStr} / ${aStr})`]);
    }
    if (document.getElementById('exponentiation').checked && a !== 1 && b !== 1) {
        operations.push([Math.pow(a, b), `(${aStr} ^ ${bStr})`]);
        operations.push([Math.pow(b, a), `(${bStr} ^ ${aStr})`]);
    }
    return operations;
}

function calculateWeight(numOperations, numNumbers) {
    return 0.75 * numOperations + 0.25 * numNumbers;
}

function bfs(target, maxNumber) {
    const queue = [];
    for (let i = 1; i <= maxNumber; i++) {
        if (i !== 10) {
            queue.push([i, [i], [], i.toString(), 0]);
        }
    }

    const visited = {};
    for (let i = 1; i <= maxNumber; i++) {
        if (i !== 10) {
            visited[i] = calculateWeight(0, 1);
        }
    }

    let bestSolution = null;
    let bestWeight = Infinity;

    while (queue.length > 0) {
        const [currentValue, path, operations, equation, numOps] = queue.shift();
        const currentWeight = calculateWeight(numOps, new Set(path).size);

        if (currentValue === target) {
            if (currentWeight < bestWeight) {
                bestSolution = [path, operations, equation];
                bestWeight = currentWeight;
            }
            continue;
        }

        for (let i = 1; i <= maxNumber; i++) {
            if (i === 10) continue;

            for (const [newValue, operation] of allowedOperations(currentValue, i, equation, i.toString())) {
                const newWeight = calculateWeight(numOps + 1, new Set([...path, i]).size);
                if (newValue > 0 && newValue <= target && (!visited.hasOwnProperty(newValue) || newWeight < visited[newValue])) {
                    queue.push([newValue, [...path, i], [...operations, operation], operation, numOps + 1]);
                    visited[newValue] = newWeight;
                }
            }
        }
    }

    return bestSolution ? {
        equation: bestSolution[2],
        numOperations: bestSolution[1].length,
        uniqueNumbers: new Set(bestSolution[0]).size
    } : null;
}

function optimize() {
    const target = parseInt(document.getElementById('target').value);
    const maxNumber = parseInt(document.getElementById('maxNumber').value);

    if (isNaN(target) || isNaN(maxNumber)) {
        document.getElementById('result').textContent = 'Please enter valid numbers for Target number and Max number unlocked.';
        return;
    }

    const solution = bfs(target, maxNumber);

    if (solution !== null) {
        document.getElementById('result').textContent = `Final equation: ${solution.equation}`;
        document.getElementById('numOperations').textContent = `Number of operations: ${solution.numOperations}`;
        document.getElementById('uniqueNumbers').textContent = `Unique numbers used: ${solution.uniqueNumbers}`;
    } else {
        document.getElementById('result').textContent = `No solution found to reach ${target}`;
        document.getElementById('numOperations').textContent = '';
        document.getElementById('uniqueNumbers').textContent = '';
    }
}
