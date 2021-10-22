import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {AddTradeModalComponent} from "./add-trade-modal/add-trade-modal.component";
import {TradesService} from "./services/trades.service";
import {BehaviorSubject} from "rxjs";
import {Trade} from "./shared/models/trades.interfaces";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  public trades$: BehaviorSubject<Trade[]>;
  public balance$: BehaviorSubject<number | undefined>;

  constructor(private dialog: MatDialog, private tradesService: TradesService) {
    this.trades$ = this.tradesService.trades$;
    this.balance$ = this.tradesService.balance$;
  }

  ngOnInit(): void {}

  public openAddDialog(): void {
    this.dialog.open(AddTradeModalComponent)
  }
}
