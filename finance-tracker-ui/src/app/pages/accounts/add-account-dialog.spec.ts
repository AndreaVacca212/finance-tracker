import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAccountDialog } from './add-account-dialog';

describe('AddAccountDialog', () => {
  let component: AddAccountDialog;
  let fixture: ComponentFixture<AddAccountDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAccountDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(AddAccountDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
