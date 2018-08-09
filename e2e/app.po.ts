import { Selector } from 'testcafe';

import { browser } from './utils';

export class AppPage {
  navigateTo() {
    return browser.goTo('/');
  }

  getHomeText() {
    return Selector('app-root h1').textContent;
  }

}
