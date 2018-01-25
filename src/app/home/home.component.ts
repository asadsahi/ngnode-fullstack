import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'appc-home',
  styleUrls: ['./home.component.scss'],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {

  public options: any[];

  constructor() { }

  ngOnInit(): void {
    this.options = [
      { name: 'Node', description: 'Node.js® is a JavaScript runtime built on Chrome\'s V8 JavaScript engine', link: 'https://nodejs.org/' },
      { name: 'Angular', description: 'One Framework Mobile and desktop', link: 'https://angular.io/' },
      { name: 'Bootstrap 4', description: 'Bootstrap is the most popular HTML, CSS, and JS framework for developing responsive, mobile first projects on the web.', link: 'https://getbootstrap.com/' }
    ];
  }

}
