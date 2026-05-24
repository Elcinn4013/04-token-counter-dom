const textarea = document.querySelector('#inputText');
const resultEl = document.querySelector('#result');
const statChars = document.querySelector('#stat-chars');
const statWords = document.querySelector('#stat-words');
const statTokens = document.querySelector('#stat-tokens');
const saveBtn = document.querySelector('#save-btn');
const clearBtn = document.querySelector('#clear-btn');
const historyList = document.querySelector('#history-list');
const history = [];


clearBtn.addEventListener('click', () => {
    history.length = 0;
    renderHistory();
})
textarea.addEventListener('input', function () {
    const analysis = analyzeText(textarea.value);
    statChars.textContent = 'Characters: ' + analysis.characters;
    statWords.textContent = 'Words: ' + analysis.words;
    statTokens.textContent = 'Estimated tokens: ' + analysis.tokens;
});

saveBtn.addEventListener('click', function () {
    if (textarea.value.trim() === '') {
        alert("Textarea is empty");
        return;
    }
    const analysis = analyzeText(textarea.value);
    analysis.label = 'Snapshot ' + (history.length + 1);
    history.push(analysis);
    renderHistory();
    console.log(history);
    if (history.length > 1) {
        const tokenCounts = history.map(e => e.tokens)
        const maxTokens = Math.max(...tokenCounts)
        console.log("Highest token count across all snapshots:", maxTokens);
    }
    renderHistory();
});

function renderHistory() {
    historyList.innerHTML = '';
    history.forEach(function (entry) {
        const li = document.createElement('li');
        li.textContent = entry.label + ' ' + entry.tokens + ' tokens, ' + entry.words + ' words, ' + entry.characters + ' characters';
        historyList.appendChild(li);
    });
}

textarea.addEventListener('input', () => {
    const tokens = characterCount(textarea.value);
    resultEl.textContent = 'Estimated tokens: ' + tokens;
});

function analyzeText(text) {
    const cleaned = cleanText(text);
    const words = splitIntoWords(cleaned);
    const filtered = removeEmptyWords(words);

    return {
        characters: cleaned.length,
        words: filtered.length,
        tokens: estimateTokens(filtered)
    };
}


function cleanText(text) {
    return text.trim();
}

console.log(cleanText("  Hello world  "));

function splitIntoWords(text) {
    return text.split(" ");
}

console.log(splitIntoWords("The quick brown fox"));

function removeEmptyWords(words) {
    return words.filter(function (word) {
        return word !== "";
    });
}


const messy = splitIntoWords("Hello   world");
console.log(messy);
console.log(removeEmptyWords(messy));

function estimateTokens(words) {
    return Math.ceil(words.length * 0.75);
}

const words = ["The", "quick", "brown", "fox"];
console.log(estimateTokens(words));

function countTokens(text) {
    const cleaned = cleanText(text);
    const words = splitIntoWords(cleaned);
    const filtered = removeEmptyWords(words);
    return estimateTokens(filtered);
}
console.log(countTokens("Hello"));
console.log(countTokens("Hello, world!"));
console.log(countTokens("The quick brown fox jumps over the lazy dog"));
console.log(countTokens("  I am learning JavaScript   today  "));

function estimateCost(tokenCount, pricePerMillion) {
    const cost = (tokenCount / 1000000) * pricePerMillion;
    return cost.toFixed(6);
}

function characterCount(text) {
    return cleanText(text).length;
}