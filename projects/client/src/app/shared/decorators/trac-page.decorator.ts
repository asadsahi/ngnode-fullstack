// import { AnalyticsService, AppModule } from '../../app.module';

// Usage on any component:
// @PageTrack('page-name')
export function PageTrack(pageName: string): ClassDecorator {

  return function (constructor: any) {
    // const analyticsService = (<any>AppModule).injector.get(AnalyticsService);

    const ngOnInit = constructor.prototype.ngOnInit;

    constructor.prototype.ngOnInit = function (...args: any[]) {
      // analyticsService.visit(pageName);
      console.warn('Visiting ' + pageName);
      // tslint:disable-next-line:no-unused-expression
      ngOnInit && ngOnInit.apply(this, args);
    };

    const ngOnDestroy = constructor.prototype.ngOnDestroy;

    constructor.prototype.ngOnDestroy = function (...args: any[]) {
      // analyticsService.leave(pageName);
      console.warn('Leaving ' + pageName);
      // tslint:disable-next-line:no-unused-expression
      ngOnDestroy && ngOnDestroy.apply(this, args);
    };

  };
}
