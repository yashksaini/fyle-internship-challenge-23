import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private httpClient: HttpClient) {}

  getUser(githubUsername: string) {
    return this.httpClient.get(
      `https://api.github.com/users/${githubUsername}`
    );
  }
  getRepositories(
    githubUsername: string,
    page_limit: number = 10,
    page_no: number = 1,
    direction: string = 'desc'
  ) {
    return this.httpClient.get(
      `https://api.github.com/users/${githubUsername}/repos?per_page=${page_limit}&page=${page_no}&sort=created&direction=${direction}`
    );
  }
}
