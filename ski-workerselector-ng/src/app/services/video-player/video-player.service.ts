import { ElementRef, EventEmitter, Injectable } from '@angular/core';
import { FaceApiService } from '../face-api/face-api.service';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class VideoPlayerService {
  cbAi: EventEmitter<any> = new EventEmitter<any>();
  _numPositiveE: number = 0;
  _numNegativeE: number = 0;
  sensitivityRangePositive : any = 0.80;
  sensitivityRangeNegative : any = 0.2;

  constructor(private faceApiService: FaceApiService) { }

  getLandMark = async (videoElement: ElementRef) => {
    const { globalFace } = this.faceApiService;
    //HERE ISSUE START
    //console.log(videoElement);
    //console.log('height---' + videoElement.nativeElement.offsetHeight);  //<<<===here
    //console.log('width---' + videoElement.nativeElement.offsetWidth);    //<<<===here
    //const videoWidth = videoElement.nativeElement.offsetWidth;
    //const videoHeight = videoElement.nativeElement.offsetHeight;

    const { videoWidth, videoHeight } = undefined || videoElement?.nativeElement;
    
    const displaySize = { width: videoWidth, height: videoHeight };
    //console.log(displaySize);
    const detectionsFaces = await globalFace.detectAllFaces(videoElement.nativeElement)
      .withFaceLandmarks()
      .withFaceExpressions();

    /* const detectionFace = await globalFace.detectSingleFace(videoElement.nativeElement)
      .withFaceLandmarks()
      .withFaceExpressions(); */

    //console.log(detectionsFaces);
    //console.log(detectionFace);
    //const expressions = detectionFace?.expressions || null;
    let expressions: any;


    if (detectionsFaces[0] == undefined) {
      expressions = { angry: 0, disgusted: 0, fearful: 0, happy: 0, neutral: 0, sad: 0, surprised: 0 };
    } else {
      expressions = detectionsFaces[0].expressions || null;
    }

    //console.log(landmark);
    //console.log(expressions);

    /*
    const landmark = detectionsFaces[0].landmarks || null;
    const expressions = detectionsFaces[0].expressions || null;
    
    const eyeLeft = landmark.getLeftEye();
    const eyeRight = landmark.getRightEye();
    const eyes = {
      left: [_.head(eyeLeft), _.last(eyeLeft)],
      right: [_.head(eyeRight), _.last(eyeRight)],
    };
    */

    //Postive Emotion
    if (expressions.happy > this.sensitivityRangePositive || 
      expressions.surprised > this.sensitivityRangePositive){
        this._numPositiveE++;
    } 
    //Negative Emotion
    else if (expressions.angry > this.sensitivityRangeNegative || 
      expressions.disgusted > this.sensitivityRangeNegative ||
      expressions.fearful > this.sensitivityRangeNegative ||
      expressions.sad > this.sensitivityRangeNegative){
        this._numNegativeE++;
    }
    
    //console.log('positive ' + this._numPositiveE);
    //console.log('negative ' + this._numNegativeE);

    const resizedDetections = globalFace?.resizeResults(detectionsFaces, displaySize);
    this.cbAi.emit({
      resizedDetections,
      displaySize,
      expressions,
      videoElement
    });
  };

  public get numPositiveE() {
    return this._numPositiveE;
  }

  public get numNegativeE() {
    return this._numNegativeE;
  }
}
