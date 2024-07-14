import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map } from 'rxjs';
import { IBook } from '../models/book';
import { HandleErrosService } from '../../shared/services/handleError.service';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  constructor(
    private http: HttpClient,
    private handleError: HandleErrosService
  ) {}

  private booksApi =
    'https://openlibrary.org/search.json';

  // Method to get book titles only With duplicates removed
  getBooksTitles(page: number): Observable<string[]> {
    const params = new HttpParams()
      .set('q', 'the lord of the rings')
      .set('page', page.toString());
    return this.http.get<{ docs: IBook[] }>(this.booksApi,{ params }).pipe(
      map((response) => {
        // Set استخراج العناوين وإزالة التكرارات باستخدام
        const uniqueTitles = Array.from(
          new Set(response.docs.map((book) => book.title))
        );
        return uniqueTitles; // إرجاع العناوين الفريدة
      }),
      catchError(this.handleError.handleError) 
    );
  }
}

