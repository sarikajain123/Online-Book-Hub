import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-list-by-category',
  templateUrl: './list-by-category.component.html',
  styleUrls: ['./list-by-category.component.scss']
})
export class ListByCategoryComponent implements OnInit {

  searchText: string;
  param: any;
  catType: any;
  booksByCat: any;
  allBooks: any;
  tempAllBooks: any;
  loading: boolean = true;
  loadingDataOnScrolling: boolean = false;

  constructor(private spinnerService: Ng4LoadingSpinnerService, private activeRoute: ActivatedRoute, private httpservice: HttpService) {
  }

  ngOnInit() {
    this.activeRoute
      .queryParams
      .subscribe(params => {
        this.catType = params.data;
      });
    this.spinnerService.show();
    this.getBooksByCategory(this.catType);
  }

  getBooksByCategory(category) {
    this.allBooks = [];
    const requestUrl = `books/?mime_type=image&topic=${category}`;
    this.httpservice.get_Data(requestUrl).subscribe(data => {
      this.booksByCat = data;
      this.loading = false
      this.spinnerService.hide();
      this.tempAllBooks = data;

    });
  }

  searchBook() {
    if (this.searchText.length > 0 && this.searchText.trim() === '') {
      this.booksByCat = this.tempAllBooks;
    } else {
      const requestUrl = `books/?search=${this.searchText}&topic=${this.catType}&mime_type=image`
      this.spinnerService.show();
      /* search using API*/
      this.httpservice.get_Data(requestUrl).subscribe(data => {
        this.booksByCat = data;
        this.spinnerService.hide();
        return 0;
      });
    }
  }

  /* 
   //## To search in the list without Api call
    this.booksByCat=this.tempAllBooks;
  this.booksByCat = this.booksByCat.results.filter((item) => {
    return (item.title.toLowerCase().indexOf(this.searchText.toLowerCase()) > -1 ||item.authors[0].name.toLowerCase().indexOf(this.searchText.toLowerCase()) > -1);
  }); */


  openBook(book) {
    const matchFormatHTML = [];
    const matchFormatPdf = [];
    const matchFormatText = [];

    for (const key in book.formats) {
      if (book.formats[key].indexOf('.zip') !== -1) {
        continue;
      }

      if (key.indexOf('text/html') !== -1) {
        matchFormatHTML.push(key);
      } else if (key.indexOf('rdf') !== -1) {
        matchFormatPdf.push(key);
      } else if (key.indexOf('text/plain ') !== -1) {
        matchFormatText.push(key);
      }
    }

    if (matchFormatHTML.length > 0) {
      window.open(book.formats[matchFormatHTML[0]], '_blank');
    } else if (matchFormatPdf.length > 0) {
      window.open(book.formats[matchFormatPdf[0]], '_blank');
    } else if (matchFormatText.length > 0) {
      window.open(book.formats[matchFormatText[0]], '_blank');
    } else {
      alert('“No​ ​viewable​ ​version​ ​available');
    }
  }

  onScroll(event: any) {
    // detect bottom og scroll
    // visible height + pixel scrolled >= total height 
    if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight) {
      this.loadingDataOnScrolling = true;
      this.spinnerService.show();
      let requestUrl = this.booksByCat.next;

      requestUrl = requestUrl.split('8000/');
      this.httpservice.get_Data(requestUrl[1]).subscribe(data => {
        this.booksByCat.results = this.booksByCat.results.concat(data.results);
        this.booksByCat.next = data.next;
        // this.booksByCat.pre= data.pre;
        this.loadingDataOnScrolling = false;
        this.spinnerService.hide();
        return 1;
      });
    }
  }
}


/*
 getAllBooks() {
   const requestUrl = 'books/';
   this.httpservice.get_Data(requestUrl).subscribe(data => {
     this.allBooks = data.results;
   });
 } */