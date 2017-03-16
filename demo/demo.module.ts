import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularODataModule } from '../src';
import { DemoComponent } from './demo.component';

@NgModule({
  declarations: [DemoComponent],
  imports: [BrowserModule, AngularODataModule.forRoot()],
  bootstrap: [DemoComponent]
})
export class DemoModule {}