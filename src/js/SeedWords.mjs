import Utils from "./utils.mjs";
let utils;

export default class SeedWords {
    constructor(){
        this.subjectWords = this.fetchWordsBySubject();
        this.syllableWords = this.fetchWordsBySyllableCount();
        utils = new Utils();
    }
    async fetchWordsBySubject(){
        let response = await fetch('/json/wordsbySubject.json');
        this.subjectWords =  await response.json();
        return this.subjectWords;
    }
    async fetchWordsBySyllableCount(){
        let response = await fetch('/json/wordsbySyllableCount.json');
        this.syllableWords = await response.json();
        return this.syllableWords;
    }
    getRandomSeedWord(subject, partofspeech){
        //let wordList = this.words.find(subj => subj === subject).find(pos => pos === partofspeech);
        let wordList = this.subjectWords[subject][partofspeech];
        if(!Array.isArray(wordList) ){
           return  this.getRandomWordBySyllableCount(1);
          }else{
            return utils.getRandom(wordList);
          }
        
    }
    getSeedWords(subject, partofspeech){
        //let wordList = this.words.find(subj => subj === subject).find(pos => pos === partofspeech);
        return this.subjectWords[subject][partofspeech];
    }
    getRandomSubject(){
        let subjects = Object.keys(this.subjectWords);
        return utils.getRandom(subjects);
    }
    getSubjects(){
        return Object.keys(this.subjectWords);
    }
    async getRandomWordBySyllableCount(syllables){
        let wordList = await this.syllableWords[syllables];
        return utils.getRandom(wordList);
    }

}