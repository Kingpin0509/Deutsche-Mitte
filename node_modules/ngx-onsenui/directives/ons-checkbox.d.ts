import { ElementRef, OnDestroy } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
/**
 * @element ons-checkbox
 * @directive OnsCheckbox
 * @selector ons-checkbox
 * @description
 *   [en]Angular directive for `<ons-checkbox>` component. You can use `[(ngModel)]` to synchronize the value of `[(ngModel)]` with the array of the selected values.[/en]
 *   [ja]`<ons-checkbox>`要素のAngularディレクティブです。 `[(ngModel)]` を使用すると、 `[(ngModel)]` の値を選択された値の配列と同期することができます。[/ja]
 * @example
 *   <ons-checkbox value="Item A" [(ngModel)]="selectedValues"></ons-checkbox>
 *   <ons-checkbox value="Item B" [(ngModel)]="selectedValues"></ons-checkbox>
 *   <ons-checkbox value="Item C" [(ngModel)]="selectedValues"></ons-checkbox>
 */
export declare class OnsCheckbox implements OnDestroy, ControlValueAccessor {
    private _elementRef;
    private _element;
    private _boundOnChange;
    private _state;
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
