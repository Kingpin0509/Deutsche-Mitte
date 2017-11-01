import { Injector, ComponentFactoryResolver, ApplicationRef, NgZone } from '@angular/core';
import { ComponentLoader } from './component-loader';
export interface PopoverRef {
    popover: any;
    destroy: Function;
}
/**
 * @object PopoverFactory
 */
export declare class PopoverFactory {
    private _injector;
    private _resolver;
    private _appRef;
    private _componentLoader;
    private _zone;
    constructor(_injector: Injector, _resolver: ComponentFactoryResolver, _appRef: ApplicationRef, _componentLoader: ComponentLoader, _zone: NgZone);
    createPopover(componentType: any, params?: Object): Promise<PopoverRef>;
}
