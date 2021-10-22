import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from "@angular/material/button";
import {CommonModule} from "@angular/common";
import {AddTradeModalComponent} from "./add-trade-modal/add-trade-modal.component";
import {MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {ReactiveFormsModule} from "@angular/forms";
import {MatIconModule} from "@angular/material/icon";
import {DateFormatPipe} from "./shared/pipes/date.pipe";
import { EditTradeModalComponent } from './edit-trade-modal/edit-trade-modal.component';
import { TradesListComponent } from './trades-list/trades-list.component';
import { TradesChartComponent } from './trades-chart/trades-chart.component';
import {NgxEchartsModule} from "ngx-echarts";

@NgModule({
  declarations: [
    AppComponent,
    AddTradeModalComponent,
    DateFormatPipe,
    EditTradeModalComponent,
    TradesListComponent,
    TradesChartComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatIconModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'), // or import('./path-to-my-custom-echarts')
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
