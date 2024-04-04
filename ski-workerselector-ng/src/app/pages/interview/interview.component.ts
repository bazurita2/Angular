import { formatDate } from '@angular/common';
import { Component, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { ModalDialogComponent } from 'src/app/components/modal-dialog/modal-dialog.component';
import { QuestionComponent } from 'src/app/components/question/question.component';
import { ScreenRecordComponent } from 'src/app/components/screen-record/screen-record.component';
import { TimerComponent } from 'src/app/components/timer/timer.component';
import { DataBaseApiService } from 'src/app/services/data-base-api/data-base-api.service';
import { FaceApiService } from 'src/app/services/face-api/face-api.service';
import { VideoPlayerService } from 'src/app/services/video-player/video-player.service';
import { Interview } from 'src/app/types/Interview';
import { Question } from 'src/app/types/Question';
import { User } from 'src/app/types/User';

@Component({
  selector: 'app-interview',
  templateUrl: './interview.component.html',
  styleUrls: ['./interview.component.scss']
})
export class InterviewComponent implements OnInit {
  public currentStream: any;
  public dimensionVideo: any;
  listEvents: Array<any> = [];
  overCanvas: any;
  listExpressions: any = [];

  // questions
  startedQuiz = false;
  @ViewChild(TimerComponent) timerComponent!: TimerComponent;
  @ViewChildren(QuestionComponent) questionsComponents!: QueryList<QuestionComponent>;

  //UserData
  userData: User = { key: '', name: '' };
  //

  public btnMessage = "";
  public count = -1;
  public arrayPreguntas = [
    //Inspirar Confianza Moral - Integridad
    '¿Podría dar un ejemplo de una situación reciente en la que su integridad causó un problema personal?',
    //Inteligencia emocional
    '¿Qué actividades te energizan o te entusiasman?',
    //Pensamiento estratégico
    '¿Que significa para ti el exito profesional?',
    //Potenciar los talentos de los demás
    '¿Cómo manejas los reclamos e inquietudes de los demas?',
    //Flexibilidad
    '¿Alguna vez tuvo que hacerse cargo por un tiempo de una área que no era la suya? ¿Cómo se manejó?',
    //Iniciativa
    '¿Qué haces cuando tienes dificultades para resolver un problema? De un ejemplo',
    //Resiliencia - Temple
    'Relátame alguna situación sin exito de su vida profesional/laboral. ¿Qué pasó?',
  ]
  today = new Date();
  interview: Interview = {
    _id: '',
    key: '',
    name: '',
    questions: [],
    result: '',
    date_start: '',
    date_finish: ''
  };

  @ViewChild(ScreenRecordComponent) screenRecordComponent!: ScreenRecordComponent;

  constructor(
    private faceApiService: FaceApiService,
    protected videoPlayerService: VideoPlayerService,
    private dataBaseApiService: DataBaseApiService,
    private modal: NgbModal
  ) { }


  ngOnInit(): void {
    this.btnMessage = 'Iniciar';
    this.listenerEvents();
    this.checkMediaSource();
    this.getSizeCam();
  }

  ngOnDestroy(): void {
    this.listEvents.forEach(event => event.unsubscribe());
    this.questions = new Array<Question>(7);
  }

  listenerEvents = () => {
    const observer1$ = this.videoPlayerService.cbAi
      .subscribe(({ resizedDetections, displaySize, expressions, videoElement }) => {
        resizedDetections = resizedDetections[0] || null;
        if (resizedDetections) {
          this.listExpressions = _.map(expressions, (value, name) => {
            return { name, value };
          });
          this.drawFace(resizedDetections, displaySize);
        }
      });

    this.listEvents = [observer1$];
  };

  drawFace = (resizedDetections: any, displaySize: any) => {
    if (this.overCanvas) {
      const { globalFace } = this.faceApiService;
      this.overCanvas.getContext('2d').clearRect(0, 0, displaySize.width, displaySize.height);
      globalFace.draw.drawFaceLandmarks(this.overCanvas, resizedDetections);
    }
  };

  checkMediaSource = () => {
    if (navigator && navigator.mediaDevices) {

      navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true
      }).then(stream => {
        this.currentStream = stream;
      }).catch(() => {
        console.log('**** ERROR NOT PERMISSIONS *****');
      });

    } else {
      console.log('******* ERROR NOT FOUND MEDIA DEVICES');
    }
  };

  getSizeCam = () => {
    const elementCam: HTMLElement = document.querySelector('.cam') as HTMLElement;
    const { width, height } = elementCam.getBoundingClientRect();
    this.dimensionVideo = { width, height };
  };

  // Metodos quiz
  empezarQuiz() {
    if (this.count == -1) {
      this.interview.date_start = formatDate(this.today, 'YYYY-mm-ddTHH:MM:ss', 'en-US', '+0530');
      this.screenRecordComponent.videoFileName = ""+this.userData.name;
      this.screenRecordComponent.recordStart();

      this.questionsComponents.get(0)?.changeSelected(true);

      this.questionsComponents.get(1)?.changeSelected(true);
    }
    this.startedQuiz = true;
    this.btnMessage = 'Siguiente pregunta';
    this.timerComponent.changeQuestion();
    this.count++;
    console.log('idQuestion ' + this.count + 'Time ' + this.timerComponent.totalSeconds);


    if (this.count === 7) {
      this.btnMessage = 'Finalizar';
    }

    if (this.count > 7) {
      this.screenRecordComponent.recordStop();
      this.finishInterview();
      this.btnMessage = 'Iniciar';
      this.count = -1;
    }

    for (let i = 0; i < this.questionsComponents.length; i++) {
      const q = this.questionsComponents.get(i);
      if (i <= this.count) {
        q?.changeSelected(true);
      }

    }
    let aprobedQuestion = 'false';
    if (this.videoPlayerService._numPositiveE > this.videoPlayerService._numNegativeE) {
      aprobedQuestion = 'true';
    }
    if (this.count > 0) {
      this.addQuestionToArray(this.videoPlayerService._numPositiveE + '', this.videoPlayerService._numNegativeE + '', this.timerComponent.totalSeconds.toString(), aprobedQuestion);

    }

    this.timerComponent.totalSeconds = 0;
    this.videoPlayerService._numNegativeE = 0;
    this.videoPlayerService._numPositiveE = 0;
  }

  stopQuiz() {
    this.timerComponent.stop();
  }

  questions = new Array<Question>(7);

  finishInterview() {
    console.log('finishInterview');
    this.interview.key = this.getRandomKey();
    this.userData.key = this.interview.key;
    this.interview.name = this.userData.name;
    this.questions = this.questions.filter(s => s != null);
    this.interview.questions = this.questions;
    this.timerComponent.stop();
    //FUNCTION
    let promedioResult = 0;
    this.questions.forEach(q => {
      let sum = Number(q.negative_emotions) + Number(q.positive_emotions);
      let x = 0;
      if(sum > 0){
         x = Number(q.positive_emotions)/Number(sum);
      }
      promedioResult += x;
    });
    console.log('promedioResult' +promedioResult);
    let resultInt = false;
    if(Number(promedioResult/this.questions.length) >0.7){
      resultInt = true;
    }
    this.interview.result = resultInt + "";
    this.interview.date_finish = formatDate(this.today, 'dd-MM-yyyy hh:mm:ss a', 'en-US', '+0530');

    console.log(this.questions);
    console.log(this.interview);

    this.dataBaseApiService.setInterview(this.interview);
    this.questions = new Array<Question>(7);
    this.startedQuiz = false;
    this.count = 0;

    this.showModal();
  }
  counta = 0;
  addQuestionToArray(postive: string, negative: string, time: string, prediction: string) {
    let question: Question = {
      positive_emotions: '',
      negative_emotions: '',
      time: '',
      prediction: ''
    };
    question.positive_emotions = postive;
    question.negative_emotions = negative;
    question.prediction = prediction;
    question.time = time;
    if (question !== null || question !== undefined) {

      console.log(question);
      this.counta++;
      console.log('cuenta ' + this.counta)
      this.questions.push(question);
    }
    //  console.log('list expresion' + this.listExpressions);
    //    this.imprimeExpresiones();

  }
  getRandomKey(): string {
    let key = '';
    let min = Math.ceil(1000);
    let max = Math.floor(9999);
    let random = Math.floor(Math.random() * (max - min + 1)) + min;
    let random2 = Math.floor(Math.random() * (max - min + 1)) + min;
    let h = this.today.getHours() + '';
    let m = this.today.getMinutes() + '';
    let s = this.today.getSeconds() + '';
    key = h + random + m + random2 + s;
    return key;
  }
  txt = '';
  imprimeExpresiones() {
    this.txt = 'expresiones: ';
    /*
    for (let index = 0; index < this.listExpressions.length; index++) {
      const exp = this.listExpressions[index];
      this.txt += ',' + exp.name + exp.value;
    }*/
    this.txt += this.countPositivas + ', negativa: ' + this.countNegativas;
    console.log(this.txt);
  }
  imprimeCount() {
    console.log('countExp, pos: ' + this.countPositivas + ', negativa: ' + this.countNegativas);
  }


  acumularExpression() {
    for (let index = 0; index < this.listExpressions.length; index++) {
      const exp = this.listExpressions[index];
      if ((exp.name == 'happy' || exp.name == 'surprised') && exp.value > 0.8) {
        this.countPositivas++;
      } else if ((exp.name == 'angry' || exp.name == 'disgusted' || exp.name == 'fearful' || exp.name == 'sad') && exp.value > 0.001) {
        this.countNegativas++;
      }

    }
    this.imprimeCount();
  }
  countPositivas = 0;
  countNegativas = 0
  // subscripcionEmociones: Subscription;

  showModal() {
    const modalRef = this.modal.open(ModalDialogComponent, { centered: true });
    modalRef.componentInstance.title = 'Gracias por utilizar SKI Worker Selector ' + this.userData.name + ' !';
    modalRef.componentInstance.body = 'Esta es su key para ver sus resultados: ' + this.userData.key;
    modalRef.componentInstance.userData = this.userData
  }
}

