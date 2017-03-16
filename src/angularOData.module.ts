import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HelloWorldComponent } from './helloWorld.component';
import { ODataService } from './ODataService';
import { ODataConfiguration } from './ODataConfiguration';
import { PagedResult } from './pagedResult';
import { ODataQuery } from './query';
import { ODataServiceFactory } from './odataservicefactory';

@NgModule({
  declarations: [ HelloWorldComponent ],
  imports: [ CommonModule ],
  exports: [ HelloWorldComponent ]
})
export class AngularODataModule {

  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: AngularODataModule
    };
  }

}
