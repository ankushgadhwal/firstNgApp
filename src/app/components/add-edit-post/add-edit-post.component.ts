import { group } from '@angular/animations';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-add-edit-post',
  templateUrl: './add-edit-post.component.html',
  styleUrls: ['./add-edit-post.component.css']
})
export class AddEditPostComponent implements OnInit {

  addUpdateForm: FormGroup | undefined;
  postId: any;
  postIdFormData: any;


  constructor(private formBuilder: FormBuilder, private sharedService: SharedService, private activatedRoute: ActivatedRoute, private router:Router) { }

  ngOnInit(): void {
    this.postId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    if (this.postId) {
      this.getPost(this.postId);
    } else {
      this.createForm()
    }
  }

  getPost(postId: any) {
    this.sharedService.getPostById(postId).pipe(take(1)).subscribe((res) => {
      this.postIdFormData = res;
      this.createForm(this.postIdFormData)
    })
  }

  createForm(formData = { body: '', title: '' }) {
    this.addUpdateForm = this.formBuilder.group({
      body: [formData?.['body'], Validators.required],
      title: [formData?.['title'], Validators.required]
    });
  }

  addUpdateSubmit() {
    if (this.addUpdateForm?.valid) {
      this.postIdFormData = { ...this.postIdFormData, ...this.addUpdateForm?.value }
      if (this.postId) {
        this.sharedService.editPost(this.postIdFormData).subscribe((res) => {
          console.log(res);
          this.router.navigate(['home']);
        })
      } else {
        this.sharedService.addPost(this.postIdFormData).subscribe((res) => {
          console.log(res);
          this.router.navigate(['home']);

        })
      }
    }
  }
}
