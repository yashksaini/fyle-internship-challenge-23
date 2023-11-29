import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let apiService: ApiService;

  beforeEach(() => {
    // Setting up the testing environment
    TestBed.configureTestingModule({
      imports: [HttpClientModule], // Importing HttpClientModule for HttpClient usage
      providers: [ApiService], // Providing the ApiService
    });

    // Getting the instance of ApiService for testing
    apiService = TestBed.inject(ApiService);
  });

  it('should be created', () => {
    // Verifying if ApiService instance is created
    expect(apiService).toBeTruthy();
  });

  it('should call getUser with correct URL', inject(
    [HttpClient], // Injecting HttpClient for mocking
    (http: HttpClient) => {
      const testUsername = 'johnpapa';
      const mockUserData = {
        /* mock user data */
      };

      // Mocking the HttpClient's get method and returning an observable of mock data
      spyOn(http, 'get').and.returnValue(of(mockUserData));

      // Invoking the getUser method and expecting the correct URL to be called
      apiService.getUser(testUsername).subscribe((data) => {
        expect(data).toEqual(mockUserData); // Expecting the received data to match the mocked user data
      });

      // Verifying that the HttpClient's get method was called with the correct URL
      expect(http.get).toHaveBeenCalledWith(
        `https://api.github.com/users/${testUsername}`
      );
    }
  ));

  it('should call getRepositories with correct URL and parameters', inject(
    [HttpClient], // Injecting HttpClient for mocking
    (http: HttpClient) => {
      const testUsername = 'johnpapa';
      const mockReposData = [{}]; // Mocked repository data

      const pageLimit = 10;
      const pageNo = 1;
      const direction = 'desc';

      // Mocking the HttpClient's get method and returning an observable of mock repository data
      spyOn(http, 'get').and.returnValue(of(mockReposData));

      // Invoking the getRepositories method and expecting the correct URL and parameters to be used
      apiService
        .getRepositories(testUsername, pageLimit, pageNo, direction)
        .subscribe((data) => {
          expect(data).toEqual(mockReposData); // Expecting the received data to match the mocked repository data
        });

      // Verifying that the HttpClient's get method was called with the correct URL and parameters
      expect(http.get).toHaveBeenCalledWith(
        `https://api.github.com/users/${testUsername}/repos?per_page=${pageLimit}&page=${pageNo}&sort=created&direction=${direction}`
      );
    }
  ));
});
