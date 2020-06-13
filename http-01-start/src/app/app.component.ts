import { Component, OnInit } from "@angular/core";
import { Post } from "./post.model";
import { PostsService } from "./posts.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  loadedPosts: Post[] = [];
  isFetching = false;

  constructor(private postsService: PostsService) {}

  ngOnInit() {
    this.fetchPosts();
  }

  onCreatePost(postData: Post) {
    this.postsService.createAndStorePost(postData).subscribe((data) => {
      console.log(data);
    });
  }

  onFetchPosts() {
    this.fetchPosts();
  }

  onClearPosts() {
    this.postsService.clearPosts();
  }

  private fetchPosts() {
    this.isFetching = true;
    this.postsService.fetchPosts().subscribe((posts) => {
      this.isFetching = false;
      this.loadedPosts = posts;
    });
  }
}
