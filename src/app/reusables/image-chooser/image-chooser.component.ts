import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import loadImage from 'blueimp-load-image';
import { ErrorService } from 'src/app/services/error.service';

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

  selectedFile: Blob;
  selectedFileDataUrl: string;

  constructor(private errorService: ErrorService) {}

  private onTouchedCallback: () => void = () => {};
  private onChangeCallback: (file: Blob) => void = () => {};

  ngOnInit(): void {}

  async onInputChange(event) {
    const file = event.target.files[0] as File;
    this.fileChanged(file, true);
  }

  async fileChanged(file?: File | Blob, dispatch = false) {
    if (!file) {
      this.selectedFile = undefined;
      this.selectedFileDataUrl = undefined;
      return;
    }

    const blob = await new Promise<Blob>((resolve) => {
      loadImage(
        file,
        (image) => {
          if (!(image instanceof HTMLCanvasElement)) {
            this.selectedFile = undefined;
            this.selectedFileDataUrl = undefined;
            this.errorService.publishByText(
              'Laden Fehlgeschlagen',
              'Das Bild konnte nicht geladen werden'
            );
            return;
          }

          image.toBlob(resolve);
          this.selectedFileDataUrl = image.toDataURL('image/png');
        },
        {
          maxWidth: 1024,
          maxHeight: 1024,
          orientation: true,
        }
      );
    });

    this.selectedFile = blob;
    if (dispatch) {
      this.onChangeCallback(blob);
    }
  }

  onInputBlur() {
    this.onTouchedCallback();
  }

  writeValue(imageFile?: Blob): void {
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
