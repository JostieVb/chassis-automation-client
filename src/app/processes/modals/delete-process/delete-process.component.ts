import { Component, OnInit, OnDestroy } from '@angular/core';
import { DeleteService } from '../../services/delete.service';
import { ProcessService } from '../../services/process.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete-process',
  templateUrl: './delete-process.component.html',
  styleUrls: ['./delete-process.component.scss']
})
export class DeleteProcessComponent implements OnInit, OnDestroy {
  protected content = {};
  private subs = [];

  constructor(
      private router: Router,
      private deleteService: DeleteService,
      private processService: ProcessService
  ) { }

  /**
   * On modal initialization, get the content by subscribing to the service content
   * */
  ngOnInit() {
    this.subs.push(
      this.deleteService.content.subscribe(content => this.content = content)
    );
  }

  deleteProcess(id) {
    this.deleteService.deleteProcess(id).subscribe((res) => {
      if (res['status'] === 200) {
        this.processService.getProcesses();
      }
    });
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

}
