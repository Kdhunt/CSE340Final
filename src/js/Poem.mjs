import SeedWords from "./SeedWords.mjs";
const seedWords = new SeedWords();
import Utils from './utils.mjs';
const utils = new Utils();

export default class Poem {
    constructor(subject, style) {
        this.lines = [];
        this.sentencePatterns = [];
        this.theme = subject;
        this.style = style;
        this.title;
    }
    async generatePoem() {
        await this.fetchSentencePatterns();
        await this.getPoemPattern();
        this.generateTitle();
        this.pattern.lines.forEach(line => {
            this.generateLine();
        });
        return this.display();
    }
    async fetchSentencePatterns() {
        try {
            console.log('Fetching sentence patterns...');
            let response = await fetch('/json/sentencePatterns.json');
    
            if (!response.ok) {
                // If response is not OK, throw an error with the status
                throw new Error(`Failed to fetch sentence patterns: ${response.status} ${response.statusText}`);
            }
    
            let json = await response.json();
            this.sentencePatterns = await json;
            console.log(json);
            console.log(this.sentencePatterns);
            
            console.log('Sentence patterns successfully fetched and loaded:', json);
        } catch (error) {
            // Catch and log any errors that occur during fetch or JSON parsing
            console.error('Error fetching sentence patterns:', error);
        }
    }
    
    async getPoemPattern() {
        if (!this.style) {
            this.style = 'haiku';
        }
    
        try {
            console.log(`Fetching poem pattern for style: ${this.style}`);
            let response = await fetch(`/json/styles/${this.style}.json`);
    
            if (!response.ok) {
                // If response is not OK, throw an error with the status
                throw new Error(`Failed to fetch poem pattern: ${response.status} ${response.statusText}`);
            }
    
            this.pattern = await response.json();
            console.log('Poem pattern successfully fetched and loaded:', this.pattern);
        } catch (error) {
            // Catch and log any errors that occur during fetch or JSON parsing
            console.error('Error fetching poem pattern:', error);
        }
    }
    
    generateLine() {
        this.lines = []; // Assuming initialization of lines
    
        this.pattern.lines.forEach(line => {
            let sentenceShortList = this.sentencePatterns.filter(p => 
                p.lowSyllables <= line.syllableCount && p.highSyllables >= line.syllableCount);
            let randomSentence = utils.getRandom(sentenceShortList);
    
            let filledSentence = randomSentence.pattern;
            randomSentence.partsOfSpeech.forEach(partOfSpeech => {
                let w;
                try {
                    w = seedWords.getRandomSeedWord(this.theme, partOfSpeech);
                } catch (error) {
                    console.error(`Error fetching word for '${partOfSpeech}' in theme '${this.theme}':`, error);
                    w = "embrace"; // Placeholder word in case of an error
                }
    
                if (!w) {
                    console.log(`No word available for '${partOfSpeech}' in theme '${this.theme}', using 'embrace' as a placeholder.`);
                    w = "embrace"; // Ensuring a fallback if no word is returned
                }
    
                filledSentence = filledSentence.replace(/{\w+}/, w); // Replace the first placeholder with the word
            });
    
            this.lines.push(filledSentence);
        });
    }
    generateTitle(){
        let titleWords = [];
        let numWords = 3;
        while(titleWords.length < numWords){
            let word = seedWords.getRandomSeedWord(this.theme, 'noun');
            titleWords.push(word);
        }
        this.title = titleWords.join(" ");
        console.log(this.title);
    }
    display() {
        let template = 
        `
        <div id="poemBlock">
        <h3>${this.title}</h3>
        ${this.lines.map(line => `<span class="poem-line">${line}</span>`).join("")}
        </div>
        `;
        return template;
    }
}