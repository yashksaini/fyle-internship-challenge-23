import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  //Data from API
  public userData: any;
  public reposData: any;
  // User Input
  public userName: string;

  public isLoading: boolean = false;
  public userNameFound: boolean | undefined;
  public loadingRepos: boolean = false;
  public totalPages: number = 1;
  public errorMessage: string = '';

  // Api payload
  public repoLimit: number = 10;
  public repoOrder: string = 'desc';
  public pageNo: number = 1;
  constructor(private apiService: ApiService) {
    this.userName = '';
  }

  ngOnInit(): void {}

  setUserName(event: any) {
    this.userName = event.target.value;
  }
  searchProfile() {
    if (this.userName) {
      this.pageNo = 1;
      this.totalPages = 1;
      this.repoLimit = 10;
      this.repoOrder = 'desc';
      this.isLoading = true;
      this.loadingRepos = true;
      const userObservable = this.apiService.getUser(this.userName);
      if (userObservable) {
        userObservable.subscribe({
          next: (response) => {
            // Handle successful data emission
            this.userData = response;
            this.isLoading = false;
            this.userNameFound = true;
            this.getTotalPages(this.userData.public_repos);
            this.getReps(10, 1, 'desc');
          },
          error: (error: any) => {
            // Handle errors
            console.log('No username exists', error.error.message);
            this.errorMessage = error.error.message;
            this.isLoading = false;
            this.userNameFound = false;
          },
        });
      }
    }
  }
  reposLimit(event: any) {
    this.repoLimit = event.target.value;
    this.pageNo = 1;
    this.getTotalPages(this.userData.public_repos);
    this.getReps(this.repoLimit, this.pageNo, this.repoOrder);
  }
  reposOrder(event: any) {
    this.repoOrder = event.target.value;
    this.pageNo = 1;
    this.getReps(this.repoLimit, this.pageNo, this.repoOrder);
  }
  updatePageNo(value: string) {
    if (value === 'prev' && this.pageNo > 1) {
      this.pageNo--;
      this.getReps(this.repoLimit, this.pageNo, this.repoOrder);
    } else if (value === 'next' && this.pageNo < this.totalPages) {
      this.pageNo++;
      this.getReps(this.repoLimit, this.pageNo, this.repoOrder);
    }
  }
  getTotalPages(count: number) {
    this.totalPages = Math.ceil(count / this.repoLimit);
  }
  getReps(repoLimit: number = 10, page: number = 1, order: string = 'desc') {
    this.reposData = [];
    this.loadingRepos = true;
    const repoObservable = this.apiService.getRepositories(
      this.userName,
      repoLimit,
      page,
      order
    );
    if (repoObservable) {
      repoObservable.subscribe({
        next: (response) => {
          this.reposData = response;
          this.loadingRepos = false;
        },
        error: (error: any) => {
          console.log('Error in finding repo', error.message);
        },
      });
    }
  }
}
