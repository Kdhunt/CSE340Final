import WordOps from './WordOps.mjs';
import Utils from './utils.mjs';
const utils = new Utils();
utils.loadHeaderFooter(async () => {
const wordOps = new WordOps();
console.log('Synonym:');
console.log(wordOps.getSynonymn('happy'));
console.log('Antonym:');
console.log(wordOps.getAntonym('happy'));
console.log('Rhyme:');
console.log(wordOps.getRhyme('happy'));
console.log(wordOps.getRandomWord());
});




