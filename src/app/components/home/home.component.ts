import { Component, inject, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { take } from 'rxjs';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  allPosts = [];
  resultPosts = [];
  private modalService = inject(NgbModal);
  searchForm: FormGroup | undefined;
  currPage = 1;
  perPage = 10;
  startIdx: number = 0;
  endIdx: number = 10;
  postLength:number= 10;


  constructor(private sharedService: SharedService, private formBuilder: FormBuilder) {
    this.getPost()
  }

  ngOnInit(): void {
    this.createForm();
  }

  perPageVal(value: any) {
    this.perPage = Number(value);
    this.currPage = 1
    this.endIdx = this.startIdx + this.perPage;
    this.resultPosts = this.allPosts.slice(this.startIdx, this.endIdx)
    console.log(this.startIdx, this.endIdx);

  }

  pageChange(pageNum: any) {
    this.currPage = pageNum;
    this.startIdx = (this.currPage * this.perPage) - this.perPage;
    this.endIdx = this.startIdx + this.perPage;
    this.resultPosts = this.allPosts.slice(this.startIdx, this.endIdx)
    console.log(this.startIdx, this.endIdx);
  }

  createForm(formdata = { searchInt: '' }) {
    this.searchForm = this.formBuilder.group({
      searchInt: [formdata.searchInt, Validators.required]
    })
  }

  searchPost() {
    console.log(this.searchForm);
    this.resultPosts = this.allPosts.filter(post => this.searchval(post));
  }

  searchval(post: any) {
    return post?.["title"].includes(this.searchForm
      ?.value?.['searchInt']) || post?.["body"].includes(this.searchForm
        ?.value?.['searchInt']) || post?.["id"].includes(this.searchForm
          ?.value?.['searchInt'])
  }


  getPost() {
    this.sharedService.getPost().pipe(take(1)).subscribe((res) => {
      this.allPosts = res;
      this.resultPosts = res.slice(this.startIdx, this.endIdx);


      this.postLength = this.allPosts.length
    })
  }

  removePost(postId: any) {
    this.sharedService.removePost(postId).pipe(take(1)).subscribe((res) => {
      this.getPost();
    })
  }

  editPost(postData: any) {
    this.sharedService.editPost(postData).pipe(take(1)).subscribe((res) => {
      console.log(res);
      // this.getPost();
    })
  }

  addPost(postData: any) {
    this.sharedService.addPost(postData).pipe(take(1)).subscribe((res) => {
      console.log(res);
      // this.getPost();
    })
  }

  open(content: TemplateRef<any>, postId: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result
      .then(() => {
        this.removePost(postId)
      },
        () => {
          console.log("note delete");
        },
      );
  }
}

