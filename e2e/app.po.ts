import { browser, element, by } from 'protractor';

export class NgNodeFullStackHomePage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('appc-root .loader')).getText();
  }
}
