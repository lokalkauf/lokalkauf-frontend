import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-fullscreen-modal',
  templateUrl: './fullscreen-modal.component.html',
  styleUrls: ['./fullscreen-modal.component.scss'],
})
export class FullscreenModalComponent implements OnInit {
  @Input() showModal = false;
  @Input() imageUrl: string;
  @Output() showModalChange: EventEmitter<boolean> = new EventEmitter<
    boolean
  >();

  constructor() {}

  ngOnInit(): void {}

  closeModal() {
    this.showModal = false;
    this.showModalChange.emit(this.showModal);
  }
}
