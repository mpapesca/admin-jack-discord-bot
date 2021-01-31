const DictionaryApi = require('../apis/dictionaryApi');

// Get synonyms for the word.
const synonyms = async (word, count) => {

    count = count == null ? 10 : count;

    let dictionaryApi = new DictionaryApi();

    var response = await dictionaryApi.getSynonyms(word);

    if (response.length <= 0) {
        return `I don\'t think "${word}" is a real word.`;
    }

    if (!response[0]['meta']) {
        return `I couldn't find that word. Did you mean one these?\n> ${response.slice(0, 3).join(', ')}`;
    }

    var synonymArrays = response[0]['meta']['syns'];

    var syns = synonymArrays[0].concat(...(synonymArrays.slice(1)));

    let answer;

    if (syns.length >= count) {
        answer = `Here are ${count} synonyms for ${word}:`;
    } else {
        count = syns.length;
        answer = `We could only find ${count} synonyms for ${word}:`;
    }

    let randos = [];
    while (randos.length < count) {
        let index = Math.floor(Math.random() * syns.length);
        if (randos.indexOf(index) == -1) {
            randos.push(index);
        }
    }

    let chosenSyns = randos.map(r => syns[r]);
    answer += `\n> ${chosenSyns.join(', ')}`;
    return answer;
};

module.exports = synonyms;