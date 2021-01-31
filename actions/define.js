
const DictionaryApi = require('../apis/dictionaryApi');

// Get the definition for the word.
const define = async (word) => {

    let dictionaryApi = new DictionaryApi();

    var response = await dictionaryApi.getDefinition(word);

    if (response.length <= 0) {
        return `I don\'t think "${word}" is a real word.`;
    }
    var shortDefs = response[0]['shortdef'];

    let definitions = shortDefs.map((def, index) => `${index + 1}: ${def}`);

    return `The definition of "${word}" is:\n>>> ${definitions.join("\n")}.`;
};

module.exports = define;