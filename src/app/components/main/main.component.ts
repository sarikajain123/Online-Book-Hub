import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: '.app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  ngOnInit(): void {

  }
  categories = ['FICTION', 'DRAMA', 'HUMOR', 'POLITICS', 'PHILOSOPHY', 'HISTORY','ADVANTURE'];
  allBooks = {};
  booksByCat = {};
  selectedcat: any;
  constructor(private router: Router) {

  }

  onSelect(category) {
    this.router.navigate(['list'], {queryParams: {
      data: category
        }});
    }

}
