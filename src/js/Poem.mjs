import SeedWords from "./SeedWords.mjs";
const seedWords = new SeedWords();
import Utils from "./utils.mjs";
const utils = new Utils();
import WordOps from "./WordOps.mjs";
const wordOps = new WordOps();

export default class Poem {
  constructor(subject, style) {
    this.lines = [];
    this.sentencePatterns = [];
    
    this.theme = subject;
    this.style = style;
    this.title;
    this.key = utils.generateUniqueKey();
  }
  async generatePoem() {
    await this.fetchSentencePatterns();
    await this.getPoemPattern();
    this.title = await this.generateTitle();
    // Array to store promises for generateLine calls
    this.lines = await this.generateLines(); 
    

    // Wait for all generateLine promises to resolve
   // await Promise.all([this.title, this.lines]).then(
      return await this.display();
   // );
  }

  async fetchSentencePatterns() {
    try {
      //  console.log('Fetching sentence patterns...');
      let response = await fetch("/json/sentencePatterns.json");

      if (!response.ok) {
        // If response is not OK, throw an error with the status
        throw new Error(
          `Failed to fetch sentence patterns: ${response.status} ${response.statusText}`,
        );
      }

      let json = await response.json();
      this.sentencePatterns = await json;
      // console.log(json);
      //  console.log(this.sentencePatterns);

      //  console.log('Sentence patterns successfully fetched and loaded:', json);
    } catch (error) {
      // Catch and log any errors that occur during fetch or JSON parsing
      console.error("Error fetching sentence patterns:", error);
    }
  }

  async getPoemPattern() {
    if (!this.style) {
      this.style = "haiku";
    }

    try {
      //    console.log(`Fetching poem pattern for style: ${this.style}`);
      let response = await fetch(`/json/styles/${this.style}.json`);

      if (!response.ok) {
        // If response is not OK, throw an error with the status
        throw new Error(
          `Failed to fetch poem pattern: ${response.status} ${response.statusText}`,
        );
      }

      this.pattern = await response.json();
      //    console.log('Poem pattern successfully fetched and loaded:', this.pattern);
    } catch (error) {
      // Catch and log any errors that occur during fetch or JSON parsing
      console.error("Error fetching poem pattern:", error);
    }
  }

  async generateLines() {
    //create a line for the poem for each line in the poem pattern
   // this.pattern.lines.forEach(async (line) => {
    let rhymeScheme = [];
    for await (const line of this.pattern.lines) {
      // select a sentence pattern for this line of the poem
      let sentenceShortList = this.sentencePatterns.filter(
        (p) =>
          p.lowSyllables <= line.syllableCount &&
          p.highSyllables >= line.syllableCount,
      );
      let randomSentence = utils.getRandom(sentenceShortList);

      let syllableCount = line.syllableCount;
      let filledSentence = randomSentence.pattern;
      console.log(`SENTENCE PATTERN TO FILL ${filledSentence}: SYLLABLE COUNT ${syllableCount}`);
      if(line.rhymeScheme){
        rhymeScheme.push(line.rhymeScheme);
      }
      

      try {
        
        let i = 0;
        for await (const partOfSpeech of randomSentence.partsOfSpeech) {
            let w;
            let checkSyl;
            //manage the number of syllables
            let allowedSyl = syllableCount - (randomSentence.partsOfSpeech.length - i) + 1;
            if(allowedSyl > 5){utils.randomNumber(1, 5);}
            let wordlist;


          try {
            if (i + 1 == randomSentence.partsOfSpeech.length) {
              //get random word from API results
              if (line.rhymeScheme && rhymeScheme[line.rhymeScheme].word) {
                wordlist = await wordOps.fetchRhymes(rhymeScheme[line.rhymeScheme].word);
              }else{
              wordlist = await this.getWordwithPosSyl(partOfSpeech, allowedSyl);
              }
            } else {
             // w = await seedWords.getRandomSeedWord(this.theme, partOfSpeech);
             wordlist = await this.getWordwithPosSyl(partOfSpeech, allowedSyl-1);
            }
          } catch (error) {
            // console.log(
            //   `Error fetching word for '${partOfSpeech}' in theme '${this.theme}':`,
            // );
            console.error(
             `Error:`,
            error,
            );
            //If there was an issue finding a part of speech seed word for a subject,
            //wordlist = await getWordwithPosSyl(partOfSpeech, allowedSyl);
            //w = utils.getRandom(wordlist);
            wordlist = await seedWords.getSeedWords(this.theme, "noun");
            //giving the await time to complete, because we are constantly seeing "undefined" returned as the word
          }// finally {
            
            if(!Array.isArray(wordlist) ){
              w = await wordOps.getRandomWord();
            }else{
              w = utils.getRandom(wordlist);
            }
          
            if(!w){
              if(allowedSyl >5){
                allowedSyl = utils.randomNumber(1,5);
              }
              w = await seedWords.getRandomWordBySyllableCount(allowedSyl);
            }
            if(line.rhymeScheme && !rhymeScheme[line.rhymeScheme]){
              rhymeScheme[line.rhymeScheme] = w;
            }
            checkSyl = utils.countSyllables(w);

            syllableCount -= checkSyl;
            let regex = new RegExp(`{${partOfSpeech}}`, 'i');
            
            filledSentence = filledSentence.replace(regex, w); // Replace the first placeholder with the word
              
            console.log(filledSentence); // Log the line with the first word inserted
         // }
            
           i++;
          };
        
      } catch {
        console.error(
          `Error:`,
         error,
        );
      } finally {
        
      }
      this.lines.push(filledSentence);
      
    };
    return this.lines;
  }

  // async generateLine() {
  //     //initialize lines
  //     this.lines = [];

  //     //create a line for the poem for each line in the poem pattern
  //     await Promise.all(this.pattern.lines.map(async (line) => {
  //       // select a sentence pattern for this line of the poem
  //       let sentenceShortList = this.sentencePatterns.filter(
  //         (p) =>
  //           p.lowSyllables <= line.syllableCount &&
  //           p.highSyllables >= line.syllableCount,
  //       );
  //       let randomSentence = utils.getRandom(sentenceShortList);

  //       let syllableCount = line.syllableCount;
  //       let filledSentence = randomSentence.pattern;

  //       await Promise.all(randomSentence.partsOfSpeech.map(async (partOfSpeech, i) => {
  //         let w;
  //         let wordlist;
  //         let checkSyl;
  //         //manage the number of syllables
  //         let allowedSyl = syllableCount - (randomSentence.partsOfSpeech.length - i) + 1;
  //        // console.log(`Looking for a ${partOfSpeech} in ${this.theme}..`);

  //         // Wrap the entire operation in a Promise to await its resolution
  //         return new Promise(async (resolve, reject) => {
  //           try {
  //             // if (i + 1 == randomSentence.partsOfSpeech.length) {
  //             //   //get random word from API results
  //             //   const randomNumber = Math.random();
  //             //   const page = Math.floor(randomNumber * 100) + 1;
  //             //   console.log("Alpha");
  //             //   wordlist = await wordOps.search({ partofspeech: partOfSpeech, syllables: allowedSyl, limit: 20, page: page });
  //             //   console.log(wordlist);
  //             //   //w = wordlist[Math.floor(Math.random() * wordlist.length)];
  //             // } else {
  //                 console.log("Normal");
  //               wordlist = await seedWords.getSeedWords(this.theme, partOfSpeech);
  //               console.log(wordlist);
  //           //  }
  //           } catch (error) {
  //             console.log(`Error fetching word for '${partOfSpeech}' in theme '${this.theme}':`, error);
  //             //If there was an issue finding a part of speech seed word for a subject,

  //          //   console.log("BORKENED");
  //          //   const wordlist = await wordOps.search({ partofspeech: partOfSpeech, syllables: allowedSyl, limit: 20, page: page });
  //          //   console.log(wordlist);
  //             //w = wordlist[Math.floor(Math.random() * wordlist.length)];
  //           } finally {
  //             console.log("WordList is " + wordlist);
  //             w = await utils.getRandom(wordlist);
  //             checkSyl = await utils.countSyllables(w);
  //             if (checkSyl > allowedSyl) {
  //               //Retry with another word

  // //              console.log("BACKUP");
  // //              w = await wordOps.search({ partofspeech: partOfSpeech, syllables: allowedSyl, limit: 20, page: page })
  // //              .then(results => utils.getRandom(results));

  //               checkSyl = utils.countSyllables(w);
  //             };
  //            // console.log(`${w} has ${checkSyl} syllables on pass ${i}: ${checkSyl > allowedSyl ? "over allowed" : "under allowed"}`);
  //            // console.log(`Using word ${w}`);
  //             syllableCount -= checkSyl;
  //             filledSentence = filledSentence.replace(/{\w+}/, w); // Replace the first placeholder with the word
  //             console.log(filledSentence); // Log the line with the first word inserted
  //             resolve(); // Resolve the Promise once the operation is complete
  //           }
  //         });
  //       }));

  //       this.lines.push(filledSentence);
  //     }));

  //     // All lines have been generated
  //   }

  async generateTitle() {
    let titleWords = [];
    let numWords = 3;
    let titlePattern = ["verb", "adjective", "noun"];
    let i = 0;
    while (titleWords.length < numWords) {
      let word = await seedWords.getRandomSeedWord(this.theme, titlePattern[i]);
      titleWords.push(word);
      i++
    }
    this.title = titleWords.join(" ");
    console.log(this.title);
    return this.title;
  }
  async getWordwithPosSyl(partOfSpeech, allowedSyl) {
    const randomNumber = Math.random();
    const page = Math.floor(randomNumber * 100) + 1;
    return await wordOps.search({
      partofspeech: partOfSpeech,
      syllables: allowedSyl,
      limit: 100,
      page: 1,
      frequencymin: 4,
      frequencymax: 8
    });
  }
  
  display() {

    let template = `
        <div id="$this" id_key="${this.key}">
        <h3>${this.title}</h3>
        ${this.lines.map((line) => `<p class="poem-line">${line}</p>`).join("")}
        </div>
        `;
    return template;
  }
}
