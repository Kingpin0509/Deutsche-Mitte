import { ApplicationRef, ComponentRef } from '@angular/core';
export declare class ComponentLoader {
    private appRef;
    constructor(appRef: ApplicationRef);
    load(componentRef: ComponentRef<any>): void;
}
