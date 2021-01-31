const axios = require('axios');

class DictionaryApi {

    baseUrl = 'https://www.dictionaryapi.com/api/v3/references/';

    async getDefinition(word) {

        var client = axios.create({
            baseURL: this.baseUrl
        });

        var response = await client.get(`collegiate/json/${word}?key=${process.env.DICTIONARY_API_KEY}`);

        return response.data;

    }

    async getSynonyms(word) {

        var client = axios.create({
            baseURL: this.baseUrl
        });

        var response = await client.get(`thesaurus/json/${word}?key=${process.env.THESAURUS_API_KEY}`);

        return response.data[0]['shortdef'];

    }

};

module.exports = DictionaryApi;