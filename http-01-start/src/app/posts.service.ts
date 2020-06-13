import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { environment } from "../environments/environment";
import { Post } from "./post.model";

export type FireBasePostResponse = { name: string };

@Injectable({
  providedIn: "root",
})
export class PostsService {
  constructor(private http: HttpClient) {}

  createAndStorePost(postData: {
    title: string;
    content: string;
  }): Observable<FireBasePostResponse> {
    return this.http.post<FireBasePostResponse>(
      `${environment.fireBaseUrl}/posts.json`,
      postData
    );
  }

  fetchPosts(): Observable<Post[]> {
    return this.http
      .get<{ [key: string]: Post }>(`${environment.fireBaseUrl}/posts.json`)
      .pipe(
        map((responseData) => {
          const posts: Post[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              posts.push({ ...responseData[key], id: key });
            }
          }
          return posts;
        })
      );
  }

  clearPosts(): void {
    this.http
      .delete(`${environment.fireBaseUrl}/posts.json`)
      .subscribe(() => {});
  }
}
