import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpEventType,
} from "@angular/common/http";

import { Observable, Subject, throwError } from "rxjs";
import { map, catchError, tap } from "rxjs/operators";

import { environment } from "../environments/environment";
import { Post } from "./post.model";

export type FireBasePostResponse = { name: string };

@Injectable({
  providedIn: "root",
})
export class PostsService {
  error = new Subject<string>();

  constructor(private http: HttpClient) {}

  createAndStorePost(postData: { title: string; content: string }): void {
    this.http
      .post<FireBasePostResponse>(
        `${environment.fireBaseUrl}/posts.json`,
        postData,
        {
          observe: "response",
        }
      )
      .subscribe(
        (data) => {
          console.log(data);
        },
        (error) => {
          this.error.next(error.message);
        }
      );
  }

  fetchPosts(): Observable<Post[]> {
    return this.http
      .get<{ [key: string]: Post }>(`${environment.fireBaseUrl}/posts.json`, {
        params: new HttpParams().set("print", "pretty"),
      })
      .pipe(
        map((responseData) => {
          const posts: Post[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              posts.push({ ...responseData[key], id: key });
            }
          }
          return posts;
        }),
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  clearPosts(): void {
    this.http
      .delete(`${environment.fireBaseUrl}/posts.json`, {
        observe: "events",
      })
      .pipe(
        tap((event) => {
          console.log(event);
        })
      )
      .subscribe(() => {});
  }
}
