
export default class Utils{
  // wrapper for querySelector...returns matching element
  async qs(selector, parent = document) {
    return parent.querySelector(selector);
  }
  // or a more concise version if you are into that sort of thing:
  // export const qs = (selector, parent = document) => parent.querySelector(selector);

  // retrieve data from localstorage
  async getLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
  }
  // save data to local storage
  async setLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }
  // set a listener for both touchend and click
  async setClick(selector, callback) {
    qs(selector).addEventListener("touchend", (event) => {
      event.preventDefault();
      callback();
    });
    qs(selector).addEventListener("click", callback);
  }

  async renderWithTemplate(template, parentElement, data = null, callback = null){
    //const html = templateFn(data);
    //if(clear) parentElement.clear();
    parentElement.insertAdjacentHTML('afterbegin', template);

    //literally zero clue why this is being done, also data is never actually used in this function, so why pass it with the template????
    if(callback) {
      callback(data);
    }
  }

  async loadTemplate(path) {
    const result = await fetch(path);
    const template = await result.text();
    return template;
  }

  async loadHeaderFooter(callback){
    const headerTemplate = await this.loadTemplate('/partials/header.html');
    const headerElem = document.querySelector("header");

    const footerTemplate = await this.loadTemplate('/partials/footer.html');
    const footerElem = document.querySelector("footer");

    this.renderWithTemplate(headerTemplate, headerElem);
    this.renderWithTemplate(footerTemplate, footerElem);
    if(callback){
      callback();
    }

  }
  async countSyllables(word) {
    // The regex pattern provided, adjusted for JavaScript usage
    const pattern = /(aa|ai|ay|ee|(e((at|atu)[^(ato)]){1,3}|ea.$)|ie|oo|oa|oe|oi|oy|ou|ua|ue|ui|yo|tion$|tian$|ine$|pe$|phe$|le$|[aeiou]([\w][^(p|ph|l|a|e|i|o|u)]){1,2}e$|[aeiou].es$|you|([aeiouy]{1}))/g;
    
    // Finding matches based on the pattern
    const matches = word.match(pattern);
    
    return matches ? matches.length : 0;
  }
  getRandom(array) {
    const index = Math.floor(Math.random() * array.length);
    return array[index];
  }
}