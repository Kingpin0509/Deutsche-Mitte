import { Injector, ComponentFactoryResolver, ApplicationRef, Type, NgZone } from '@angular/core';
import { ComponentLoader } from './component-loader';
export interface DialogRef {
    dialog: any;
    destroy: Function;
}
/**
 * @object DialogFactory
 */
export declare class DialogFactory {
    private _injector;
    private _resolver;
    private _appRef;
    private _componentLoader;
    private _zone;
    constructor(_injector: Injector, _resolver: ComponentFactoryResolver, _appRef: ApplicationRef, _componentLoader: ComponentLoader, _zone: NgZone);
    createDialog(componentType: Type<any>, params?: Object): Promise<DialogRef>;
}
