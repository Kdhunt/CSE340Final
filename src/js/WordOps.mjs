import Utils from './utils.mjs';
const baseURL = import.meta.env.VITE_API_BASE_URL;
const apiKey = import.meta.env.VITE_API_KEY;
const apiHost = import.meta.env.VITE_API_HOST;

const utils = new Utils();

export default class WordOps {

    /// MAKING THE API CALLS 
    async fetchWordData(url, params = null) {
        const options = {
            method: 'GET',
            params: params,
            headers: {
                'X-RapidAPI-Key': apiKey,
                'X-RapidAPI-Host': apiHost
            }
        };
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
             //   throw new Error('Network response was not ok.');
            }
            const result = await response.text();
           // console.log(result);
            return result; // Returning the actual value
       } catch (error) {
           console.error(error);
            throw error; // Re-throwing the error to be caught by the caller
       }
    }
    // SYNONYMS
    async fetchSynonyms() {
        const url = `${baseURL}${this.word}/synonyms`;
        let result = await this.fetchWordData(url);
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
        const url = `${baseURL}${this.word}/antonyms`;
        let result = await this.fetchWordData(url);
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
        const url = `${baseURL}${this.word}/rhymes`;
        let result = await this.fetchWordData(url);
        this.rhymes = JSON.parse(result);
        return this.rhymes.results.data;
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
        const url = `${baseURL}?random=true`;
        let result = await this.fetchWordData(url);
        let json = JSON.parse(result);
        return json.word;
    }
    async search(params){
        let pos = "";
        let syl="";
        let url = `${baseURL}`;
        let n = 0;
        for (const [key, value] of Object.entries(params)) {
            if(!pos && key == "partofspeech"){ pos = value;}
            if(!syl && key == "syllables"){ syl = value;}
            url = url+ `${(n==0)?'?':'&'}${key}=${value}`;
            n++;
        }
        //check for the call in wordlist if it has already been made for that partofspeech and syllable count
        if(pos && syl){
            console.log(`${pos}${syl}`);
           let wordlist = await utils.getLocalStorage(`${pos}${syl}`);
            if(wordlist){
                return wordlist;
            }
        }
        let result = await this.fetchWordData(url, params);
        let json = JSON.parse(result);
        console.log(json);
        //store the results in local storage by the partofspeech and syllable count for future lookup
        //this would be better in session storage as you can set it to expire, keeping poem content fresh while reducing API calls
        //That may be something I explore with this next semester, I plan to reuse this project and build a custom API for this app
        if(pos && syl){
           await utils.setLocalStorage(`${pos}${syl}`, json.results.data);
        }
        return json.results.data;
    }






    async getRandom(wordList){
        const randomIndex = Math.floor(Math.random() * wordList.length);
        return wordList[randomIndex];
    }

   


}
