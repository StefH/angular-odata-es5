import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { AngularODataModule } from '../src';
import { DemoComponent } from './demo.component';
import { EmployeeGridODataComponent } from './employeeGridOData.component';
import { DataTableModule, DialogModule, PaginatorModule, TooltipModule, PanelModule } from 'primeng/primeng';

@NgModule({
  declarations: [ DemoComponent, EmployeeGridODataComponent ],
  exports: [ PanelModule, NoopAnimationsModule ],
  imports: [ BrowserModule, HttpClient, DataTableModule, TooltipModule, PaginatorModule, DialogModule, PanelModule, NoopAnimationsModule, AngularODataModule.forRoot() ],
  bootstrap: [ DemoComponent ]
})
export class DemoModule {}
