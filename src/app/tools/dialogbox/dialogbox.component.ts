import { Injectable, Component, Input, Output, EventEmitter, Inject, Type, Injector, inject } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../app-icon/icon.component';

@Injectable({ providedIn: 'root' })
export class DialogboxService {
  constructor(private dialog: MatDialog) {}

  openDialog(component: Type<any>, config: { title?: string; data?: any; width?: string } = {}) {
    return this.dialog.open(DialogboxContentComponent, {
      data: { title: config.title, component, componentData: config.data },
      panelClass: 'custom-dialog-panel',
      width: config.width || '600px',
      autoFocus: false
    });
  }
}

@Component({
  selector: 'app-dialogbox',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './dialogbox.component.html',
  styleUrl: './dialogbox.component.scss'
})
export class DialogboxComponent {
  @Input() title: string = '';
  @Input() data: any;
  @Output() closed = new EventEmitter<any>();

  constructor(public dialog: MatDialog) {}

  openDialog(): MatDialogRef<any> {
    const dialogRef = this.dialog.open(DialogboxContentComponent, {
      data: { title: this.title, content: this.data },
      panelClass: 'custom-dialog-panel',
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      this.closed.emit(result);
    });
    return dialogRef;
  }
}

@Component({
  selector: 'app-dialogbox-content',
  standalone: true,
  imports: [CommonModule, MatDialogModule, IconComponent],
  templateUrl: './dialogbox-content.component.html',
  styleUrls: ['./dialogbox.component.scss']
})
export class DialogboxContentComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogboxContentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private injector: Injector
  ) {}

  close() {
    this.dialogRef.close();
  }

  createInjector(data: any) {
    return Injector.create({
      providers: [
        { provide: 'dialogData', useValue: data }
      ],
      parent: this.injector
    });
  }
}
