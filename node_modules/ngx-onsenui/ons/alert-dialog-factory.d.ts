import { Injector, ComponentFactoryResolver, ApplicationRef, Type, NgZone } from '@angular/core';
import { ComponentLoader } from './component-loader';
export interface AlertDialogRef {
    alertDialog: any;
    destroy: Function;
}
/**
 * @object AlertDialogFactory
 */
export declare class AlertDialogFactory {
    private _injector;
    private _resolver;
    private _appRef;
    private _componentLoader;
    private _zone;
    constructor(_injector: Injector, _resolver: ComponentFactoryResolver, _appRef: ApplicationRef, _componentLoader: ComponentLoader, _zone: NgZone);
    createAlertDialog(componentType: Type<any>, params?: Object): Promise<AlertDialogRef>;
}
