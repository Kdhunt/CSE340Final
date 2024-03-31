const baseURL = import.meta.env.API_BASE_URL;
const apiKey = import.meta.env.API_KEY;
const apiHost = import.meta.env.API_HOST;



/// MAKING THE API CALL
export default class Word {

    async fetchWordData(url) {
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': apiKey,
                'X-RapidAPI-Host': apiHost
            }
        };
        try {
            const response = await fetch(url, options);
            const result = await response.text();
            console.log(result);
        } catch (error) {
            console.error(error);
        }
    }
    // SYNONYMS
    async fetchSynonyms() {
        const url = `${baseURL}/words/${this.word}/synonyms`;
        await this.fetchWordData(url);
        this.synonyms = JSON.parse(result);
    }
    async hasSynonym(){
        if(!this.synonyms || this.synonyms.length === 0){
            return false;
        }
    }
    async getSynonymn(word){
        this.word = word;
        if(!this.synonyms || this.synonyms.length === 0){
            await this.fetchSynonyms();
        }
        await this.fetchSynonyms();
        return this.getRandom(this.synonyms);
    }

    // ANTONYMS
    async fetchAntonyms() {
        const url = `${baseURL}/words/${this.word}/antonyms`;
        await this.fetchWordData(url);
        this.synonyms = JSON.parse(result);
    }
    async hasAntonyms(){
        if(!this.antonyms || this.antonyms.length === 0){
            return false;
        }
    }
    async getAntonym(word){
        this.word = word;
        if(!this.antonyms || this.antonyms.length === 0){
            await this.fetchSynonyms();
        }
        await this.fetchAntonyms();
        return this.getRandom(this.antonyms);
    }
    // Rhymes
    async fetchRhymes() {
        const url = `${baseURL}/words/${this.word}/rhymes`;
        await this.fetchWordData(url);
        this.rhymes = JSON.parse(result);
    }
    async hasRhymes(){
        if(!this.rhymes || this.rhymes.length === 0){
            return false;
        }
    }
    async getRhyme(word){
        this.word = word;
        if(!this.rhymes || this.rhymes.length === 0){
            await this.fetchRhymes();
        }
        await this.fetchRhymes();
        return this.getRandom(this.rhymes);
    }

    async getRandomWord(){
        const url = `${baseURL}/words/?random=true`;
        await this.fetchWordData(url);
        let json = JSON.parse(result);
        return json.word;
    }






    async getRandom(wordList){
        const randomIndex = Math.floor(Math.random() * wordList.length);
        return wordList[randomIndex];
    }



}