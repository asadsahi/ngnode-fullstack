// Typings reference file, you can add your own global typings here
// https://www.typescriptlang.org/docs/handbook/writing-declaration-files.html
/* SystemJS module definition */
declare var module: NodeModule;
declare module 'domino'
declare var tinymce: any;
declare var global: NodeJS.Global;
declare var Zone: any;
interface NodeModule {
    id: string;
    hot: string;
    [key: string]: string; // missing index defintion
}

interface IAppGlobalRef {
    appData: IApplicationConfig;
}

declare module NodeJS {
    interface Global {
        appData: IApplicationConfig
        appConfig: ServerAppConfig;
        errorHandler: Function;
    }
}

interface IApplicationConfig {
    cultures: ICulture[];
    content: StringMap[];
    loginProviders: string[];
}
interface ICulture {
    value: string;
    text: string;
    current: boolean;
}
interface ServerAppConfig {
    indexPath: string;
    Host: string;
    appTitle: string;
    Security: SecurityConfig
}

interface SecurityConfig {
    JWT_SECRET: string;
    SESSION_SECRET: string;
}


interface IMessage {
    id: number;
    from: string;
    to: string;
    message: string;
    createdAt: Date;
    roomid: number;
    room: IRoom;
}

interface IRoom {
    id: number;
    name: string;
    createdAt: Date;
    messages?: IMessage[];
}


interface IUser {
    id: number;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    password: string;
    displayName: string;
    provider: string;
    createdAt?: Date;
    updatedAt?: Date;
    profileImage?: string;
    roles?: Role[];
    additionalProvidersData?: any;
}

interface IRole {
    id: number;
    name: string;
    description?: string;
}
