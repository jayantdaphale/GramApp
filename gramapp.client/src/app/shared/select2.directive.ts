import { AfterViewInit, ChangeDetectorRef, Directive, ElementRef, forwardRef, Input, OnDestroy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import $ from 'jquery';
import select2Factory from 'select2';

select2Factory(window, $);

if (typeof $.fn.select2 !== 'function') {
  throw new Error('Select2 failed to initialize.');
}

declare global {
  interface JQuery {
    select2(options?: Record<string, unknown> | 'destroy'): JQuery;
  }
}

@Directive({
  selector: 'select[appSelect2]',
  standalone: false,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => Select2Directive), multi: true }]
})
export class Select2Directive implements AfterViewInit, OnDestroy, ControlValueAccessor {
  @Input() select2Placeholder = 'Select an option';

  private element: JQuery;
  private observer?: MutationObserver;
  private initialized = false;
  private value: string | null = null;
  private onChange: (value: string | null) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  constructor(elementRef: ElementRef<HTMLSelectElement>, private cdr: ChangeDetectorRef) {
    this.element = $(elementRef.nativeElement);
  }

  ngAfterViewInit(): void {
    this.initialize();
    this.observer = new MutationObserver(() => this.syncSelection());
    this.observer.observe(this.element[0], { childList: true, subtree: true });
  }

  writeValue(value: unknown): void {
    this.value = value === null || value === undefined || value === '' ? null : String(value);
    if (this.initialized) this.syncSelection();
  }

  registerOnChange(fn: (value: string | null) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(disabled: boolean): void { this.element.prop('disabled', disabled); }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.element.off('.select2Angular');
    if (this.initialized) this.element.select2('destroy');
  }

  private initialize(): void {
    this.element.select2({ width: '100%', placeholder: this.select2Placeholder, allowClear: true });
    this.initialized = true;
    this.syncSelection();
    this.element.on('change.select2Angular', () => {
      const value = this.element.val();
      this.value = value === '' || value === null ? null : String(value);
      this.onChange(this.value);
      this.cdr.markForCheck();
    });
    this.element.on('select2:close.select2Angular', () => this.onTouched());
  }

  private syncSelection(): void {
    if (!this.initialized) return;
    this.element.val(this.value ?? '').trigger('change.select2');
  }
}
