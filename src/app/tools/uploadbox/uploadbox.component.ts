import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IconComponent } from '../app-icon/icon.component';
import { AppButtonComponent } from '../app-button/app-button.component';
import { UploadedFile } from '../../interfaces/uploaded-file.interface';

@Component({
  selector: 'app-uploadbox',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatCardModule,
    MatTooltipModule,
    IconComponent,
    AppButtonComponent
  ],
  templateUrl: './uploadbox.component.html',
  styleUrl: './uploadbox.component.scss'
})
export class UploadboxComponent implements OnInit {
  @Input() multiple: boolean = false;
  @Input() accept: string = '*/*';
  @Input() maxFileSize: number = 10 * 1024 * 1024; // 10MB default
  @Input() maxFiles: number = 5;
  @Input() uploadUrl?: string;
  @Input() autoUpload: boolean = true;
  @Input() showPreview: boolean = true;
  @Input() dragDropEnabled: boolean = true;
  @Input() placeholder: string = 'Drop files here or click to browse';
  @Input() buttonText: string = 'Choose Files';
  
  @Output() filesSelected = new EventEmitter<File[]>();
  @Output() fileUploaded = new EventEmitter<UploadedFile>();
  @Output() uploadComplete = new EventEmitter<UploadedFile[]>();
  @Output() uploadError = new EventEmitter<{ file: File; error: string }>();
  @Output() fileRemoved = new EventEmitter<UploadedFile>();

  uploadedFiles: UploadedFile[] = [];
  isDragOver: boolean = false;
  isUploading: boolean = false;
  private fileMap = new Map<string, File>();

  constructor(private snackBar: MatSnackBar) {}

  ngOnInit() {}

  onFileSelected(event: any) {
    const files: File[] = Array.from(event.target.files);
    this.handleFiles(files);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    if (event.dataTransfer?.files) {
      const files: File[] = Array.from(event.dataTransfer.files);
      this.handleFiles(files);
    }
  }

  private handleFiles(files: File[]) {
    // Validate number of files
    if (this.uploadedFiles.length + files.length > this.maxFiles) {
      this.showError(`Maximum ${this.maxFiles} files allowed`);
      return;
    }

    // Validate each file
    const validFiles: File[] = [];
    files.forEach(file => {
      if (this.validateFile(file)) {
        validFiles.push(file);
      }
    });

    if (validFiles.length === 0) {
      return;
    }

    // Emit selected files
    this.filesSelected.emit(validFiles);

    // Create uploaded file objects
    validFiles.forEach(file => {
      const uploadedFile: UploadedFile = {
        id: this.generateId(),
        name: file.name,
        size: file.size,
        type: file.type,
        url: '',
        uploadedAt: new Date(),
        uploadedBy: 'user',
        isActive: true,
        status: 'pending'
      };

      this.uploadedFiles.push(uploadedFile);
      this.fileMap.set(uploadedFile.id, file);

      // Auto upload if enabled
      if (this.autoUpload) {
        this.uploadFile(file, uploadedFile);
      }
    });
  }

  private validateFile(file: File): boolean {
    // Check file size
    if (file.size > this.maxFileSize) {
      this.showError(`File ${file.name} is too large. Maximum size is ${this.formatFileSize(this.maxFileSize)}`);
      return false;
    }

    // Check file type if accept is specified
    if (this.accept !== '*/*') {
      const acceptedTypes = this.accept.split(',').map(type => type.trim());
      const isValidType = acceptedTypes.some(type => {
        if (type.endsWith('/*')) {
          return file.type.startsWith(type.replace('/*', ''));
        }
        return file.type === type || file.name.toLowerCase().endsWith(type.replace('*', ''));
      });

      if (!isValidType) {
        this.showError(`File type not allowed for ${file.name}`);
        return false;
      }
    }

    return true;
  }

  private async uploadFile(file: File, uploadedFile: UploadedFile) {
    uploadedFile.status = 'uploading';
    uploadedFile.progress = 0;

    try {
      if (this.uploadUrl) {
        // Simulate upload to server
        await this.simulateUpload(file, uploadedFile);
      } else {
        // Create local URL for preview
        uploadedFile.url = URL.createObjectURL(file);
        uploadedFile.status = 'completed';
        uploadedFile.progress = 100;
      }

      this.fileUploaded.emit(uploadedFile);
      this.showSuccess(`File ${file.name} uploaded successfully`);
    } catch (error) {
      uploadedFile.status = 'error';
      uploadedFile.error = error instanceof Error ? error.message : 'Upload failed';
      this.uploadError.emit({ file, error: uploadedFile.error });
      this.showError(`Failed to upload ${file.name}`);
    }
  }

  private async simulateUpload(file: File, uploadedFile: UploadedFile): Promise<void> {
    return new Promise((resolve, reject) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          uploadedFile.progress = progress;
          uploadedFile.status = 'completed';
          uploadedFile.url = URL.createObjectURL(file);
          resolve();
        } else {
          uploadedFile.progress = progress;
        }
      }, 200);
    });
  }

  removeFile(file: UploadedFile) {
    const index = this.uploadedFiles.findIndex(f => f.id === file.id);
    if (index !== -1) {
      this.uploadedFiles.splice(index, 1);
      this.fileRemoved.emit(file);
      
      // Revoke object URL if it exists
      if (file.url) {
        URL.revokeObjectURL(file.url);
      }

      // Remove from file map
      this.fileMap.delete(file.id);
    }
  }

  uploadAll() {
    this.uploadedFiles
      .filter(file => file.status === 'pending')
      .forEach(file => {
        const originalFile = this.getOriginalFile(file);
        if (originalFile) {
          this.uploadFile(originalFile, file);
        }
      });
  }

  private getOriginalFile(uploadedFile: UploadedFile): File | null {
    return this.fileMap.get(uploadedFile.id) || null;
  }

  hasPendingFiles(): boolean {
    return this.uploadedFiles.some(file => file.status === 'pending');
  }

  previewFile(file: UploadedFile) {
    if (file.url) {
      window.open(file.url, '_blank');
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  private showSuccess(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  getFileIcon(fileType: string): string {
    if (fileType.startsWith('image/')) return 'image';
    if (fileType.startsWith('video/')) return 'video_file';
    if (fileType.startsWith('audio/')) return 'audio_file';
    if (fileType.includes('pdf')) return 'picture_as_pdf';
    if (fileType.includes('word') || fileType.includes('document')) return 'description';
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return 'table_chart';
    if (fileType.includes('powerpoint') || fileType.includes('presentation')) return 'slideshow';
    return 'insert_drive_file';
  }

  getFileStatusColor(status: string): string {
    switch (status) {
      case 'completed': return '#4caf50';
      case 'uploading': return '#2196f3';
      case 'error': return '#f44336';
      default: return '#9e9e9e';
    }
  }
} 