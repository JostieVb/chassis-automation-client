import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProcessService } from '../../services/process.service';

@Component({
  selector: 'app-keyboard-shortcuts',
  templateUrl: './keyboard-shortcuts.component.html',
  styleUrls: ['./keyboard-shortcuts.component.scss']
})

export class KeyboardShortcutsComponent implements OnInit, OnDestroy {

  protected show = false;
  private subs = [];

  constructor(
      private processService: ProcessService
  ) { }

  hideKeyboardShortcuts(target) {
    if (target.classList.contains('keyboard-shortcuts-overlay')) {
      this.processService.showKeyboardShortcuts.next(false);
    }
  }

  ngOnInit() {
    this.subs.push(
      this.processService.showKeyboardShortcuts.subscribe(bool => {
        this.show = bool;
      })
    );
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

}
