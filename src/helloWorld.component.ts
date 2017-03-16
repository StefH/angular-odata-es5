import { Component } from '@angular/core';

@Component({
  selector: 'ao-hello-world',
  template: 'Hello world from the {{ projectTitle }} module!'
})
export class HelloWorldComponent {
  public projectTitle: string = 'Angular OData Library (es5)';
}
