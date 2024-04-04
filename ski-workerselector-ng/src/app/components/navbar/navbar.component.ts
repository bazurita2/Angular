import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/types/User';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {

  public isMenuCollapsed = true;
  
  user$: BehaviorSubject<User>;

  constructor(
    private userService: UserService,
    private router: Router) {
    this.user$ = this.userService.user$;
  }

  userData: User = { key: '', name: '' };
  is_userLoaded: boolean = false;

  ngOnInit(): void {
    this.user$.subscribe(user => {
      user == null ? this.userData = { key: '', name: '' } : this.userData = user;
      if(this.userData.key != '' && this.userData.name != ''){
        this.is_userLoaded = true;
        this.userService.is_userLoaded = this.is_userLoaded;
        this.router.navigate(["analytics"]);
      }else{
        this.is_userLoaded = false;
        this.userService.is_userLoaded = this.is_userLoaded; 
      }
    });
  }

  logIn() {
    this.userService.getUser(this.userData);
  }

  logOut() {
    this.userService.resetUser();
    this.router.navigate(["home"]);
  }
}
