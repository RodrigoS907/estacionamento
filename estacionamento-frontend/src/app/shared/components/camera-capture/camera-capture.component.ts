import { Component, ElementRef, EventEmitter, Output, ViewChild, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-camera-capture',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="camera">
      <div class="viewport">
        <img *ngIf="previewUrl()" [src]="previewUrl()" alt="Preview">
        <video #video *ngIf="!previewUrl() && streamAtivo()" autoplay playsinline muted></video>
        <div *ngIf="!previewUrl() && !streamAtivo()" class="placeholder">
          <p>Câmera desligada</p>
        </div>
      </div>

      <canvas #canvas style="display:none"></canvas>

      <div class="actions">
        <button *ngIf="!streamAtivo() && !previewUrl()" (click)="ligarCamera()" class="primary">
          Ativar câmera
        </button>
        <button *ngIf="streamAtivo() && !previewUrl()" (click)="capturar()" class="primary">
          Capturar foto
        </button>
        <button *ngIf="previewUrl()" (click)="refazer()">
          Refazer
        </button>
      </div>

      <p class="erro" *ngIf="erro()">{{ erro() }}</p>
    </div>
  `,
  styles: [`
    .camera { display: flex; flex-direction: column; gap: 12px; }
    .viewport {
      background: #0f172a; border: 1px solid #334155; border-radius: 12px;
      aspect-ratio: 4/3; overflow: hidden; display: grid; place-items: center;
    }
    video, img { width: 100%; height: 100%; object-fit: cover; }
    .placeholder { color: #64748b; font-size: 14px; }
    .actions { display: flex; gap: 8px; }
    button {
      background: #334155; color: #e2e8f0; border: none;
      padding: 10px 16px; border-radius: 8px; font-size: 14px; flex: 1;
    }
    button.primary { background: #6366f1; color: white; font-weight: 600; }
    .erro { color: #f87171; font-size: 13px; margin: 0; }
  `]
})
export class CameraCaptureComponent implements OnDestroy {
  @ViewChild('video') videoRef?: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvasRef?: ElementRef<HTMLCanvasElement>;

  @Output() fotoCapturada = new EventEmitter<Blob>();

  readonly streamAtivo = signal(false);
  readonly previewUrl = signal<string | null>(null);
  readonly erro = signal<string | null>(null);

  private stream: MediaStream | null = null;

  async ligarCamera() {
    this.erro.set(null);
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false
      });
      this.streamAtivo.set(true);
      // Aguarda a view atualizar para então conectar o stream ao video
      setTimeout(() => {
        if (this.videoRef && this.stream) {
          this.videoRef.nativeElement.srcObject = this.stream;
        }
      }, 0);
    } catch (e: any) {
      this.erro.set('Não foi possível acessar a câmera: ' + (e?.message ?? e));
      this.streamAtivo.set(false);
    }
  }

  capturar() {
    if (!this.videoRef || !this.canvasRef) return;
    const video = this.videoRef.nativeElement;
    const canvas = this.canvasRef.nativeElement;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    canvas.toBlob(blob => {
      if (!blob) return;
      this.previewUrl.set(URL.createObjectURL(blob));
      this.fotoCapturada.emit(blob);
      this.desligarCamera();
    }, 'image/jpeg', 0.9);
  }

  refazer() {
    const url = this.previewUrl();
    if (url) URL.revokeObjectURL(url);
    this.previewUrl.set(null);
    this.ligarCamera();
  }

  private desligarCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(t => t.stop());
      this.stream = null;
    }
    this.streamAtivo.set(false);
  }

  ngOnDestroy() {
    this.desligarCamera();
    const url = this.previewUrl();
    if (url) URL.revokeObjectURL(url);
  }
}
