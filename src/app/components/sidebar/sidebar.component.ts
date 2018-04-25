import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../../auth/user.service';
import { EntriesService } from '../../entries/services/entries.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {

    protected fillables = [
      {link: true, title: 'Products', path: '/products', permissions: 'products', icon: 'fa fa-shopping-basket', children: []},
      {link: false, title: 'Automation', path: '', icon: '', permissions: 'automation', children: []},
      {link: true, title: 'Dashboard', path: '/dashboard', permissions: 'dashboard', icon: 'fa fa-columns', children: []},
      {link: true, title: 'Processes', path: '/processes', permissions: 'processes', icon: 'fa fa-cogs', children: []},
      {link: true, title: 'Entries', path: '/entries', permissions: 'entries', icon: 'fa fa-inbox', children: []},
      {link: true, title: 'Forms', path: '/forms', permissions: 'forms', icon: 'fa fa-list', children: []},
      {link: true, title: 'Data tables', path: '/data-tables', permissions: 'data-tables', icon: 'fa fa-database', children: []},
    ];
    protected navItems = [];
    protected unreadEntries = 0;
    private subs = [];

  constructor(
      private auth: UserService,
      private entriesService: EntriesService
  ) { }

  ngOnInit() {
    this.auth.getAuthUser().subscribe(user => {
        this.fillables.forEach(navItem => {
          if (user.permissions !== '' && user.permissions !== null) {
              if (user.permissions.includes(navItem.permissions)) {
                  this.navItems.push(navItem);
              }
          }
        });
    });
    this.entriesService.countUnreadEntries();
    this.subs.push(
      this.entriesService.unreadEntries.subscribe(unreadEntries => this.unreadEntries = unreadEntries)
    );
  }

  ngOnDestroy() {
      this.subs.forEach(sub => sub.unsubscribe());
  }

}
