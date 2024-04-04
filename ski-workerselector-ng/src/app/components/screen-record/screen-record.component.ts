import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-screen-record',
  template: '<button id="stop" (click)="downloadBlob()" *ngIf="hasVideo" class="btn btn-info">Descargar</button>',
})
export class ScreenRecordComponent implements OnInit {
  @ViewChild('recordVideo', { static: false }) recordVideo: ElementRef = {} as ElementRef;
  @Input() videoFileName = "";
  hasVideo: boolean = false;
  isRecording: boolean = false;
  recorder: any;
   mediaDevices = navigator.mediaDevices as any;
  completeBlob!: Blob;
  streamRecord: any;
  constructor() { }

  ngOnInit(): void {
  }

  private async startRecording() {
    this.streamRecord = await this.mediaDevices.getDisplayMedia({
      video: { mediaSource: "screen" }
    });
    this.recorder = new MediaRecorder(this.streamRecord);


    const chunks: any[] | undefined = [];
    this.recorder.ondataavailable = (e: { data: any; }) => chunks.push(e.data);
    this.recorder.onstop = (e: any) => {
      this.completeBlob = new Blob(chunks, { type: chunks[0].type });
      this.recordVideo.nativeElement.src = URL.createObjectURL(this.completeBlob);
    };


    this.recorder.start();
  }


  public recordStart() {
    this.hasVideo = false;
    this.isRecording = true;
    this.startRecording();
  }


  public recordStop() {
    this.hasVideo = true;
    this.isRecording = false;
    this.recorder.stop();
    this.streamRecord.getVideoTracks()[0].stop();
  }

  public downloadBlob(name = "Entrevista_"+this.videoFileName + '.mp4'): any {
    if (
      window.navigator &&
     ( window.navigator as any).msSaveOrOpenBlob
    ) return (window.navigator as any).msSaveOrOpenBlob(this.completeBlob);


    // For other browsers:
    // Create a link pointing to the ObjectURL containing the blob.
    const data = window.URL.createObjectURL(this.completeBlob);


    const link = document.createElement('a');
    link.href = data;
    link.download = name;


    // this is necessary as link.click() does not work on the latest firefox
    link.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      })
    );


    setTimeout(() => {
      // For Firefox it is necessary to delay revoking the ObjectURL
      window.URL.revokeObjectURL(data);
      link.remove();
    }, 100);
  }

}
