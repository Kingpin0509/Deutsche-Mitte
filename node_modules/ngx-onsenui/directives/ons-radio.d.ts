import { ElementRef, OnDestroy } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
/**
 * @element ons-radio
 * @directive OnsRadio
 * @selector ons-radio
 * @description
 *   [en]Angular directive for `<ons-radio>` component. You can use `[(ngModel)]` to synchronize the value of `[(ngModel)]` with the selected value.[/en]
 *   [ja]`<ons-radio>`要素のAngularディレクティブです。 `[(ngModel)]` を使用すると、 `[(ngModel)]` の値を選択された値と同期することができます。[/ja]
 * @example
 *   <ons-radio value="Item A" [(ngModel)]="selectedValue"></ons-radio>
 *   <ons-radio value="Item B" [(ngModel)]="selectedValue"></ons-radio>
 *   <ons-radio value="Item C" [(ngModel)]="selectedValue"></ons-radio>
 */
export declare class OnsRadio implements OnDestroy, ControlValueAccessor {
    private _elementRef;
    private _element;
    private _boundOnChange;
    private _propagateChange;
    constructor(_elementRef: ElementRef);
    _onChange(event: any): void;
    readonly element: any;
    readonly nativeElement: any;
    ngOnDestroy(): void;
    writeValue(obj: any): void;
    registerOnChange(fn: any): void;
    registerOnTouched(): void;
}
