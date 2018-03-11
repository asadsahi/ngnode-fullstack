// import { waitForAngular } from 'testcafe-angular-selectors';
import { AppPage } from './app.po';

const page = new AppPage();

fixture('App').beforeEach(async (t) => {
  // await waitForAngular();
});

test('should display home heading as NgNode', async (t) => {
  await page.navigateTo();

  const homeHeadingText = await page.getHomeText();

  await t.expect(homeHeadingText).contains('NgNode');
});
