import { Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FaceApiService } from 'src/app/services/face-api/face-api.service';
import { VideoPlayerService } from '../../services/video-player/video-player.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements OnInit, OnDestroy {

  @ViewChild('videoElement', { static: false }) videoElement: ElementRef<HTMLVideoElement> = {} as ElementRef<HTMLVideoElement>;
  @Input() stream: any;
  @Input() width: number = 0;
  @Input() height: number = 0;

  modelsReady: boolean = false;
  listEvents: Array<any> = [];

  overCanvas: HTMLCanvasElement = {} as HTMLCanvasElement;

  constructor(
    private renderer2: Renderer2,
    private elementRef: ElementRef,
    private faceApiService: FaceApiService,
    private videoPlayerService: VideoPlayerService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.listenerEvents();
  }

  ngOnDestroy(): void {
    this.listEvents.forEach(event => event.unsubscribe());
    this.stopMediaVideo();
  }

  listenerEvents = () => {
    this.faceApiService.loadModels();
    const observer1$ = this.faceApiService.cbModels.subscribe(res => {
      this.modelsReady = true;
      this.checkFace();
    });

    const observer2$ = this.videoPlayerService.cbAi
      .subscribe(({ resizedDetections, displaySize }) => {
        resizedDetections = resizedDetections[0] || null;
        if (resizedDetections) {
          this.drawFace(resizedDetections, displaySize);
        }
      });

    this.listEvents = [observer1$, observer2$];
  };

  drawFace = (resizedDetections: any, displaySize: any) => {
    const { globalFace } = this.faceApiService;
    this.overCanvas.getContext('2d')?.clearRect(0, 0, displaySize.width, displaySize.height);
    globalFace.draw.drawDetections(this.overCanvas, resizedDetections);
    globalFace.draw.drawFaceLandmarks(this.overCanvas, resizedDetections);
    this.spinner.hide();
  };

  checkFace = () => {
    setInterval(async () => {
      await this.videoPlayerService.getLandMark(this.videoElement);
    }, 100);
  };

  loadedMetaData(): void {
    this.videoElement.nativeElement.play();
  }

  listenerPlay(): void {
    const { globalFace } = this.faceApiService;
    this.overCanvas = globalFace.createCanvasFromMedia(this.videoElement.nativeElement);
    this.renderer2.setProperty(this.overCanvas, 'id', 'new-canvas-over');
    this.renderer2.setStyle(this.overCanvas, 'width', `${this.width}px`);
    this.renderer2.setStyle(this.overCanvas, 'height', `${this.height}px`);
    this.renderer2.appendChild(this.elementRef.nativeElement, this.overCanvas);
  }

  stopMediaVideo() {
    this.stream.getTracks().forEach((track: any) => track.stop());
  }
}
