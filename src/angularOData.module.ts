import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [ ],
  imports: [ CommonModule ],
  exports: [ ]
})
export class AngularODataModule {

  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: AngularODataModule
    };
  }

}
