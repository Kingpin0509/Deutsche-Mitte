import { Injector, ComponentFactoryResolver, ApplicationRef, Type, NgZone } from '@angular/core';
import { ComponentLoader } from './component-loader';
export interface ModalRef {
    modal: any;
    destroy: Function;
}
/**
 * @object ModalFactory
 */
export declare class ModalFactory {
    private _injector;
    private _resolver;
    private _appRef;
    private _componentLoader;
    private _zone;
    constructor(_injector: Injector, _resolver: ComponentFactoryResolver, _appRef: ApplicationRef, _componentLoader: ComponentLoader, _zone: NgZone);
    createModal(componentType: Type<any>, params?: Object): Promise<ModalRef>;
}
