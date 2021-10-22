import {Component, OnInit} from '@angular/core';
import { EChartsOption } from 'echarts';
import {BehaviorSubject, } from "rxjs";
import {TradesService} from "../services/trades.service";

@Component({
  selector: 'app-trades-chart',
  templateUrl: './trades-chart.component.html',
  styleUrls: ['./trades-chart.component.scss']
})
export class TradesChartComponent implements OnInit {

  public chartOption$: BehaviorSubject<EChartsOption>;

  constructor(private tradesService: TradesService) {
    this.chartOption$ = tradesService.chartOption$;
  }

  ngOnInit(): void {
  }
}
