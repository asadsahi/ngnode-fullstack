import { NgNodeFullStackHomePage } from './app.po';

describe('angular2-full-stack App', function () {
  let page: NgNodeFullStackHomePage;

  beforeEach(() => {
    page = new NgNodeFullStackHomePage();
  });

  it('should display Loading... text when page is loading', () => {
    page.navigateTo();
    page.getParagraphText().then(text => {
      expect(text).toEqual('Loading...');
    });
  });
});
