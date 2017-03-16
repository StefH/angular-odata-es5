import {
  inject,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';
import { expect } from 'chai';
import { HelloWorldComponent } from './../src/helloWorld.component';
import { AngularODataModule } from '../src';

describe('ao-hello-world component', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({imports: [AngularODataModule.forRoot()]});
  });

  it('should say hello world', () => {
    const fixture: ComponentFixture<HelloWorldComponent> = TestBed.createComponent(HelloWorldComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.innerHTML.trim()).to.equal('Hello world from the Angular OData Library (es5) module!');
  });

});
