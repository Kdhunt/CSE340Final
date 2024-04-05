import Utils from './utils.mjs';
const utils = new Utils();

export default class SeedWords {
    constructor(){
        this.fetchWords();
    }
    async fetchWords(){
        this.words = await fetch('/json/wordsbySubject.json');
        this.words = await this.words.json();
    }
    getRandomSeedWord(subject, partofspeech){
        //let wordList = this.words.find(subj => subj === subject).find(pos => pos === partofspeech);
        let wordList = this.words[subject][partofspeech];
        return utils.getRandom(wordList);
    }
    getRandomSubject(){
        let subjects = Object.keys(this.words);
        return utils.getRandom(subjects);
    }
    getSubjects(){
        return Object.keys(this.words);
    }

}