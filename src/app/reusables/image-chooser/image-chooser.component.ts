import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-image-chooser',
  templateUrl: './image-chooser.component.html',
  styleUrls: ['./image-chooser.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ImageChooserComponent,
      multi: true,
    },
  ],
})
export class ImageChooserComponent implements OnInit, ControlValueAccessor {
  uploadState: Observable<number> | null = null;

  selectedFile: File;
  selectedFileDataUrl: string;

  constructor() {}

  private onTouchedCallback: () => void = () => {};
  private onChangeCallback: (file: File) => void = () => {};

  ngOnInit(): void {}

  async onInputChang(event) {
    const file = event.target.files[0] as File;
    this.onChangeCallback(file);
    this.fileChanged(file);
  }

  async fileChanged(file: File) {
    this.selectedFile = file;
    this.selectedFileDataUrl = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.addEventListener(
        'load',
        () => {
          resolve(reader.result as string);
        },
        false
      );
      reader.readAsDataURL(this.selectedFile);
    });
  }

  onInputBlur() {
    this.onTouchedCallback();
  }

  writeValue(imageFile?: File): void {
    if (imageFile) {
      this.fileChanged(imageFile);
    } else {
      this.selectedFile = null;
      this.selectedFileDataUrl = null;
    }
  }
  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    throw new Error('Method not implemented.');
  }
}
