import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ApiService } from './services/api.service';
describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let apiService: jasmine.SpyObj<ApiService>;

  beforeEach(async () => {
    apiService = jasmine.createSpyObj('ApiService', [
      'getUser',
      'getRepositories',
    ]);

    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [{ provide: ApiService, useValue: apiService }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should set userName on calling setUserName()', () => {
    const event = { target: { value: 'testUser' } };
    component.setUserName(event);
    expect(component.userName).toEqual('testUser');
  });

  it('should not fetch user details if userName is empty', () => {
    component.userName = '';
    component.searchProfile();
    expect(apiService.getUser).not.toHaveBeenCalled();
  });

  it('should fetch user details if userName is not empty', () => {
    component.userName = 'johnpapa';
    component.searchProfile();

    // Checking if getUser was called during the searchProfile method
    expect(apiService.getUser).toHaveBeenCalledWith(component.userName);
  });
  it('should fetch repos if userName is not empty', () => {
    component.userName = 'johnpapa';
    component.getReps();

    expect(apiService.getRepositories).toHaveBeenCalled();
  });

  it('should only fetch repos of user when next and prev button clicked', () => {
    component.userName = 'johnpapa';
    component.pageNo = 2;
    component.totalPages = 3;
    component.updatePageNo('prev');
    expect(apiService.getUser).not.toHaveBeenCalled();
    expect(apiService.getRepositories).toHaveBeenCalled();

    //For the next button
    component.updatePageNo('next');
    expect(apiService.getUser).not.toHaveBeenCalled();
    expect(apiService.getRepositories).toHaveBeenCalled();
  });
});
