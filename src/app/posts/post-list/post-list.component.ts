import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../../models/post.model';
import { PostsService } from '../../services/posts.service';
import { PageEvent } from '@angular/material/paginator';
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css'
})
export class PostListComponent implements OnInit{

posts: Post[] = [];
isLoading = false;
private postSub: Subscription
totalPosts = 0;
postsPerPage = 2;
pageSizeOpt = [1, 2, 5, 10];
currentPage = 1;

constructor(public postService: PostsService) { }





ngOnInit() {
 this.isLoading = true
 this.postService.getPosts(this.postsPerPage, this.currentPage);
  this.postSub = this.postService.getPostUpdatedListener()
    .subscribe((postData: {posts: Post[], postCount: number}) => {
      this.isLoading = false;
      this.totalPosts = postData.postCount;
      this.posts = postData.posts;
    });
    
  // Then fetch posts
  this.postService.getPosts(this.postsPerPage, this.currentPage);
}


onChangedPage(pageData: PageEvent){
  this.isLoading = true;
  this.currentPage = pageData.pageIndex + 1;
  this.postsPerPage = pageData.pageSize;
  this.postService.getPosts(this.postsPerPage, this.currentPage);
}

onDelete(postId: string){
  this.isLoading = true;
this.postService.deletePost(postId).subscribe(() => {
  this.postService.getPosts(this.postsPerPage, this.currentPage);
});
}
ngOnDestroy(): void {
  
    this.postSub.unsubscribe();
    

}

}
