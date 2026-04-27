import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Componente01 } from './componente01';

describe('Componente01', () => {
  let component: Componente01;
  let fixture: ComponentFixture<Componente01>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Componente01],
    }).compileComponents();

    fixture = TestBed.createComponent(Componente01);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
