import WordOps from './WordOps.mjs';
import SeedWords from "./SeedWords.mjs";
import Poem from './Poem.mjs';
import Utils from './utils.mjs';
const utils = new Utils();
const seedWords = new SeedWords();
utils.loadHeaderFooter(async () => {
//const wordOps = new WordOps();
//console.log('Synonym:');
//console.log(wordOps.getSynonymn('happy'));
//console.log('Antonym:');
//console.log(wordOps.getAntonym('happy'));
//console.log('Rhyme:');
//console.log(wordOps.getRhyme('happy'));
//console.log(wordOps.getRandomWord());
const subjects = await seedWords.getSubjects();
const subjectDDL = document.getElementById('theme');
subjects.forEach(subject => {
    const option = document.createElement('option');
  option.text = subject;
  option.value = subject;
  subjectDDL.appendChild(option);

});

//const subject = await seedWords.getRandomSubject();

let loading = document.getElementById("loading")
document.getElementById('generate').addEventListener('click', async (e)=>{
    e.preventDefault();
    const subject = document.getElementById('theme').value || seedWords.getRandomSubject();
    const style = document.getElementById('style').value;
    const poem = new Poem(subject, style);
   //await poem.generatePoem();
   //poem.display();
   document.getElementById('nav').classList.toggle('active');
   loading.classList.toggle('active');
    let poemHTML = await poem.generatePoem();
    document.getElementById('poemField').innerHTML = poemHTML;
    
    loading.classList.toggle('active');
    
  //const randomWord =
});
//Nav Menu Toggle for Mobile
(async () => {
  document.getElementById('menu_toggle').addEventListener('click', () => {
    document.getElementById('nav').classList.toggle('active');
  });
})();
});




