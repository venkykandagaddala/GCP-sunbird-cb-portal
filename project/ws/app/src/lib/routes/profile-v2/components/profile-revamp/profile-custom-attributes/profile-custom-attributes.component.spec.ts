import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileCustomAttributesComponent } from './profile-custom-attributes.component';

describe('ProfileCustomAttributesComponent', () => {
  let component: ProfileCustomAttributesComponent;
  let fixture: ComponentFixture<ProfileCustomAttributesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileCustomAttributesComponent]
    });
    fixture = TestBed.createComponent(ProfileCustomAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
