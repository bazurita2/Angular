import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataBaseApiService } from 'src/app/services/data-base-api/data-base-api.service';
import { Interview } from 'src/app/types/Interview';
import { Question } from 'src/app/types/Question';
import { Chart } from 'src/app/types/analytics/Chart';
import { Serie } from 'src/app/types/analytics/Serie';
import { forkJoin, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {

  view: [number, number] = [0,0];

  questionsData: Array<Question> | undefined = [];
  barVertical2dData: Array<Chart> = [];
  advancedPieData: Array<Serie> = [];
  lineData: Array<Chart> = [];

  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = true;
  showLegend: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Preguntas';
  showYAxisLabel: boolean = true;
  yAxisLabel: string = 'Emociones';
  legendTitle: string = 'Valencia Emociones';
  timeline: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  legend: boolean = true;


  joinable$: Observable<([Interview])> = new Observable();
  suscriptor: Subscription = new Subscription();

  constructor(private dataBaseApiService: DataBaseApiService) { this.view = [innerWidth / 1.3, 400]; }

  interview$ = this.dataBaseApiService.getInterview();

  interviewData: Interview = {
    _id: '',
    key: '',
    name: '',
    questions: [],
    result: '',
    date_start: '',
    date_finish: ''
  };

  ngOnInit(): void {
    this.joinable$ = forkJoin([this.interview$]);
    this.suscriptor = this.joinable$.subscribe( res => {
      this.interviewData = res[0];
      this.dataBaseApiService.interview = this.interviewData;
      console.log(this.dataBaseApiService.interview)
      this.interviewData.questions?.forEach(question => this.questionsData?.push(question));
      //console.log(this.questionsData)
      let serie: Array<Serie> = [];
      for (var i = 0; i < this.questionsData!.length; i++) {
        serie.push({ name: 'Positivas', value: Number(this.questionsData![i].positive_emotions) });
        serie.push({ name: 'Negativas', value: Number(this.questionsData![i].negative_emotions) })
        this.barVertical2dData[i] = { name: 'Pregunta ' + (i + 1).toString(), series: serie }
        this.advancedPieData[i] = { name: 'Pregunta ' + (i + 1).toString(), value: Number(this.questionsData![i].positive_emotions) };
        this.lineData[i] = { name: 'Pregunta ' + (i + 1).toString(), series: serie }
        serie = [];
        //console.log(this.barVertical2dData[i])
      }
    });
  }

  onSelect(data: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data: any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  onResize(event: any) {
    this.view = [event.target.innerWidth / 1.35, 400];
  } 

}
