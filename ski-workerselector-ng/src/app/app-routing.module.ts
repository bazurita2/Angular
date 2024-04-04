import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { AnalyticsComponent } from './pages/analytics/analytics.component';
import { HomeComponent } from './pages/home/home.component';
import { InterviewComponent } from './pages/interview/interview.component';
import { TermsComponent } from './pages/terms/terms.component';

const routes: Routes = [
  {
    path:'',
    component: HomeComponent
  },
  {
    path:'interview',
    component: InterviewComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./pages/interview/interview.module').then(m => m.InterviewModule)
      }
    ]
  },
  {
    path:'analytics',
    component: AnalyticsComponent
  },
  {
    path:'about',
    component: AboutUsComponent
  },
  {
    path:'terms',
    component: TermsComponent
  },
  {
    path:'**',
    redirectTo: '/'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
