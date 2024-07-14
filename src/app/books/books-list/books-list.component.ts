import { Component, HostListener, OnInit } from '@angular/core';
import { BookService } from '../services/book.service';
import { SelectComponent } from '../../shared/select/select.component';
import { CommonModule, NgFor } from '@angular/common';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-books-list',
  standalone: true,
  imports: [
    SelectComponent,
    CommonModule,
    SpinnerComponent,
    FormsModule,
    CdkDropList,
    CdkDrag,
    CdkDropListGroup,
  ],
  templateUrl: './books-list.component.html',
  styleUrl: './books-list.component.css',
})
export class BooksListComponent implements OnInit {
  booksTitles: string[] = [];
  filterBooksTitles: string[] = [];
  loadingForSpinner: boolean = false;
  selectedBooks: string[] = []; // this a new array for second and third array
  page: number = 1;
  hasMoreBooks: boolean = true;
  firstLoading: boolean = true;
  constructor(
    private bookService: BookService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
this.getBooksTitles();
  }



// Method to load books with pagination
getBooksTitles() {
  if (!this.hasMoreBooks) return;  // عدم تحميل المزيد إذا لم يكن هناك كتب إضافية

  this.loadingForSpinner = true;
  this.bookService.getBooksTitles(this.page).subscribe({
    next: (response: string[]) => {
      if (response.length > 0) {
        // إضافة العناوين الجديدة إلى القائمة الحالية
        this.booksTitles.push(...response);
        this.filterBooksTitles.push(...this.booksTitles);
        this.page++;  // زيادة رقم الصفحة لتحميل المزيد من الكتب في المستقبل
      } else {
        // إذا لم يكن هناك المزيد من الكتب، توقف عن تحميل المزيد
        this.hasMoreBooks = false;
      }
      this.loadingForSpinner = false;
    },
    error: () => {
      this.loadingForSpinner = false;
      this.toastrService.error(
        'Something bad happened; please try again later.',
        'Error',
        {
          timeOut: 2000,
          progressBar: true,
        }
      );
    },
  });
}




// Add scroll event
@HostListener('window:scroll', ['$event'])
onScroll() {
  const scrollPosition = window.innerHeight + window.scrollY;
  const bottomPosition = document.documentElement.scrollHeight;
 console.log(this.page)
  // تحقق من أن التمرير وصل إلى أسفل الصفحة وأنه ليس هناك تحميل جارٍ حاليًا
  // && !this.loadingForSpinner هذا الشرط كان من الضروري وضعه حتى لا يتم ارسال الطلب مرتين
  //                             بنفس رقم الصفحة عند عمل سكرول
  if (scrollPosition + 50 >= bottomPosition && !this.loadingForSpinner) {
    this.getBooksTitles(); // استدعاء الدالة لتحميل المزيد من الكتب
  }
}




  //  the next block for filtered the books by searching in the textbox
  private _keyword: string = '';

  get keyword(): string {
    return this._keyword;
  }

  set keyword(value: string) {
    console.log('called from setter ', value);
    this._keyword = value;
    var filterBy = value.toLocaleLowerCase();
    this.filterBooksTitles = this.booksTitles.filter((titleBook) =>
      titleBook.toLocaleLowerCase().includes(filterBy)
    );
  }




  // the next function form materialCDK for drag and drop in books lists
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      // Moving an item within the same list
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      // Moving an item from one list to another
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.selectedBooks = event.container.data; ;
    }
  }

  // The following function is for deleting a book when the delete button is pressed by the user
  removeBook(index: any) {
    this.selectedBooks.splice(index, 1);
  }

  changeColor(color: string) {
    const list = document.querySelector('.example-container:nth-of-type(3) .example-list') as HTMLElement;
      list.style.backgroundColor = color;
  }

}
