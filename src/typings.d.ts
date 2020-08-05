/* SystemJS module definition */
declare var module: NodeModule;
declare module NodeJS {
  interface Global {
    appData: IApplicationConfig;
  }
}
interface NodeModule {
  id: string;
}

interface IApplicationConfig {
  cultures: ICulture[];
  content: StringMap[];
  loginProviders: string[];
  stsAuthority: string;
}

interface ICulture {
  value: string;
  text: string;
  current: boolean;
}

interface StringMap {
  [s: string]: string;
}
interface ICookieConsent {
  showConsent: boolean;
  cookieString: string;
}
