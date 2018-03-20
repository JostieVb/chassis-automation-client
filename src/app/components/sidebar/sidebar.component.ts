import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  navItems = [
    {link: true, title: 'Products', path: '/products', icon: 'fa fa-shopping-basket', children: []},
    {link: false, title: 'Automation', path: '', icon: '', children: []},
    {link: true, title: 'Dashboard', path: '/dashboard', icon: 'pg-layouts2', children: []},
    {link: true, title: 'Processes', path: '/processes', icon: 'fa fa-cogs', children: []},
    {link: true, title: 'Entries', path: '/entries', icon: 'fa fa-list', children: []},
    {link: true, title: 'Configure', path: '/configuration', icon: 'fa fa-wrench', children: []},
  ];

  constructor() { }

  ngOnInit() {
  }

}
