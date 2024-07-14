import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './select.component.html',
  styleUrl: './select.component.css',

})
export class SelectComponent  {

  constructor(private fb: FormBuilder) {}


  @Input() data: any[] = [];

}
