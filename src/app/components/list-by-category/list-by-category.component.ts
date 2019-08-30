import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';

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
  loading: boolean =true;

  constructor(private router: Router, private activeRoute: ActivatedRoute, private httpservice: HttpService) {
  }

  ngOnInit() {
    this.activeRoute
      .queryParams
      .subscribe(params => {
        this.catType = params.data;
      });
    this.getBooksByCategory(this.catType);
  }

  getBooksByCategory(category) {
    this.allBooks = [];
    const requestUrl = `books/?mime_type=image&topic=${category}`;
    this.httpservice.get_Data(requestUrl).subscribe(data => {
      this.booksByCat = data;
      this.loading = false;
      this.tempAllBooks = data;

    });
  }

  searchBook() {
    if(this.searchText.length > 0 && this.searchText.trim() === ''){
      this.booksByCat = this.tempAllBooks;
    } else{
      const requestUrl = `books/?search=${this.searchText}&topic=${this.catType}&mime_type=image`
      this.loading = true;
      /* search using API*/
      this.httpservice.get_Data(requestUrl).subscribe(data => {
        this.booksByCat = data;
        this.loading = false;
        return 0;
      });
    }
  }
      //## To search in the list without Api call
      /* 
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

  getAllBooks() {
    const requestUrl = 'books/';
    this.httpservice.get_Data(requestUrl).subscribe(data => {
      this.allBooks = data.results;
    });
  }
  onScroll(event: any) {
    // detect bottom og scroll
    // visible height + pixel scrolled >= total height 
    if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight) {
      let requestUrl = this.tempAllBooks.next;
      requestUrl = requestUrl.split('8000/');
      this.httpservice.get_Data(requestUrl[1]).subscribe(data => {

    });
    }
  }
}


    