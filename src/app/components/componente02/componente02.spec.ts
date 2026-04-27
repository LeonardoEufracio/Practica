import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Componente02 } from './componente02';

describe('Componente02', () => {
  let component: Componente02;
  let fixture: ComponentFixture<Componente02>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Componente02],
    }).compileComponents();

    fixture = TestBed.createComponent(Componente02);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
