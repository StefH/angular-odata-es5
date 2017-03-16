import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { AngularODataModule } from '../src';
import { DemoComponent } from './demo.component';
import { EmployeeGridODataComponent } from './employeeGridOData.component';
import { DataTableModule, DialogModule, PaginatorModule, TooltipModule } from 'primeng/primeng';

@NgModule({
  declarations: [ DemoComponent, EmployeeGridODataComponent ],
  imports: [ BrowserModule, HttpModule, DataTableModule, TooltipModule, PaginatorModule, DialogModule, AngularODataModule.forRoot() ],
  bootstrap: [ DemoComponent ]
})
export class DemoModule {}
