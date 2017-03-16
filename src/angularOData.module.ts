import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelloWorldComponent } from './helloWorld.component';

@NgModule({
  declarations: [
    HelloWorldComponent
  ],
  imports: [CommonModule],
  exports: [HelloWorldComponent]
})
export class AngularODataModule {

  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: AngularODataModule
    };
  }

}
