import { Component, OnInit, OnDestroy } from '@angular/core';
import { DeleteService } from '../../services/delete.service';
import { ProcessService } from '../../services/process.service';
import { Router } from '@angular/router';
import { AlertService } from '../../../components/services/alert.service';
import {Alert} from '../../../components/alert/alert';

@Component({
  selector: 'app-delete-process',
  templateUrl: './delete-process.component.html',
  styleUrls: ['./delete-process.component.scss']
})
export class DeleteProcessComponent implements OnInit, OnDestroy {

  /**
   * content      :   the content that should be displayed in the modal
   * subs         :   modal subscriptions
   * */
  protected content = {};
  private subs = [];

  constructor(
      private router: Router,
      private deleteService: DeleteService,
      private processService: ProcessService,
      private alert: AlertService
  ) { }

  /**
   * On modal initialization, get the content by subscribing to the deleteService 'content' variable
   *
   * */
  ngOnInit() {
    this.subs.push(
      this.deleteService.content.subscribe(content => this.content = content)
    );
  }

  /**
   * Delete process and get new overview from processes on callback
   *
   * @param   id - id of the process
   * */
  deleteProcess(id: number) {
    this.deleteService.deleteProcess(id).subscribe((res) => {
      if (res['status'] === 200) {
        this.processService.getProcesses();
        this.alert.alert.next(new Alert('Process \'' + this.content['name'] + '\' successfully deleted.', 'success', '', true, false));
      } else {
        this.alert.alert.next(new Alert('Process \'' + this.content['name'] + '\' could not be deleted.', 'danger', '<i class="fa fa-exclamation-circle" aria-hidden="true"></i>', true, false));
      }
    });
  }

  /**
   * On destroy, unsubscribe all subscriptions
   * */
  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

}
