import { Component, OnInit } from '@angular/core';
import { newBpmnDiagram } from './new-bpmn-diagram';
import { DraftProcess } from '../../models/draft-process';

@Component({
  selector: 'app-new-process',
  templateUrl: './new-process.modal.html',
  styleUrls: ['./new-process.modal.scss']
})
export class NewProcessModalComponent implements OnInit {
  /**
   * name   :   name of new process
   * */
  protected name = '';
  private newBpmnDiagram = newBpmnDiagram;

  constructor() { }

  ngOnInit() {
  }

  addProcess() {
    if (this.name !== '') {
      const oParser = new DOMParser();
      const oDOM = oParser.parseFromString(this.newBpmnDiagram, 'text/xml');

      const draftProcess = new DraftProcess();
      draftProcess.id = 1;
      draftProcess.name = this.name;
      draftProcess.file = oDOM;

      this.name = '';
    }
  }

}
