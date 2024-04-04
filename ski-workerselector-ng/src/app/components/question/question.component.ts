import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html'
})
export class QuestionComponent implements OnInit {

  @Input() question: string = '';
  @Input() isSelected = false ;
  constructor() { }

  ngOnInit(): void {
  }
  public  changeSelected(b: boolean){
    this.isSelected = b;
  }


}
