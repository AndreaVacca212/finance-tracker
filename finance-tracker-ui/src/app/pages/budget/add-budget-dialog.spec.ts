import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBudgetDialog } from './add-budget-dialog';

describe('AddBudgetDialog', () => {
  let component: AddBudgetDialog;
  let fixture: ComponentFixture<AddBudgetDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBudgetDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(AddBudgetDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
