import { environment } from '@environments/environment';

// This decorator will be helpful for debugging purposes.
// We will log the ngOnInit, ngOnDestroy and ngOnChanges lifecycle hooks.

export function NgLog(): ClassDecorator {
    return function (constructor: any) {
        if (!environment.production) {
            // You can add/remove events for your needs
            const LIFECYCLE_HOOKS = [
                'ngOnInit',
                'ngOnChanges',
                'ngOnDestroy'
            ];
            const component = constructor.name;

            LIFECYCLE_HOOKS.forEach(hook => {
                const original = constructor.prototype[hook];

                constructor.prototype[hook] = function (...args: any[]) {
                    console.log(`%c ${component} - ${hook}`, `color: #4CAF50; font-weight: bold`, ...args);
                    // tslint:disable-next-line:no-unused-expression
                    original && original.apply(this, args);
                };
            });
        }

    };
}
