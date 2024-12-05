import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(private http: HttpClient) { }

  getPost(): Observable<any> {
    return this.http.get("http://localhost:3000/posts")
  }

  getPostById(id:any): Observable<any> {
    return this.http.get("http://localhost:3000/posts/" + id)
  }


  removePost(postId: any): Observable<any> {
    return this.http.delete("http://localhost:3000/posts/" + postId,)
  }

  editPost(postData: any): Observable<any> {
    return this.http.put("http://localhost:3000/posts/" + postData.id, postData)
  }

  addPost(postData: any): Observable<any> {
    return this.http.post("http://localhost:3000/posts", postData)
  }
}
