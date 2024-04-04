import {Component, ElementRef, OnDestroy, OnInit, Renderer2} from '@angular/core';

@Component({
  selector: 'app-root',
  template: '<app-navbar></app-navbar> <router-outlet></router-outlet> <app-footer></app-footer>',
})
export class AppComponent {
  title = 'ski-workerselector';
}