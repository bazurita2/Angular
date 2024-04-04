import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/types/User';

@Component({
  selector: 'app-modal-dialog',
  templateUrl: './modal-dialog.component.html',
})
export class ModalDialogComponent implements OnInit {
  @Input() title: string = '';
  @Input() body: string = '';
  @Input() userData: User = { key: '', name: '' };

  constructor(public activeModal: NgbActiveModal,
    private userService: UserService,
    private router: Router) { this.userService.user$.subscribe(user => {console.log(user)});}


  ngOnInit(): void {
  }

  /*
  onSubmit(): void {
    this.userService.setUser(this.userData);
    this.activeModal.close();
  }
  */

  navigateToAnalytics(){
    this.userService.setUser(this.userData);
    this.router.navigate(["/analytics"])
  }

}
