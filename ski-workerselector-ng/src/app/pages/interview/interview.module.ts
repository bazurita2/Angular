import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InterviewComponent } from './interview.component';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { QuestionComponent } from 'src/app/components/question/question.component';
import { TimerComponent } from 'src/app/components/timer/timer.component';
import { VideoPlayerComponent } from 'src/app/components/video-player/video-player.component';
import { ScreenRecordComponent } from 'src/app/components/screen-record/screen-record.component';



@NgModule({
  declarations: [
    InterviewComponent,
    VideoPlayerComponent,
    TimerComponent,
    QuestionComponent,
    ScreenRecordComponent
   
  ],
  imports: [
    CommonModule, 
    FormsModule,
    NgxSpinnerModule 
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class InterviewModule { }
