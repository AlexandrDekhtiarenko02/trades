import {Component, OnInit} from '@angular/core';
import {Trade, TradeHistoryItem} from "../shared/models/trades.interfaces";
import {EditTradeModalComponent} from "../edit-trade-modal/edit-trade-modal.component";
import {MatDialog} from "@angular/material/dialog";
import {BehaviorSubject} from "rxjs";
import {TradesService} from "../services/trades.service";

@Component({
  selector: 'app-trades-list',
  templateUrl: './trades-list.component.html',
  styleUrls: ['./trades-list.component.scss']
})
export class TradesListComponent implements OnInit {

  public trades$: BehaviorSubject<Trade[]>;
  public tradesHistory$: BehaviorSubject<TradeHistoryItem[]>

  constructor(private dialog: MatDialog, private tradesService: TradesService) {
    this.trades$ = this.tradesService.trades$;
    this.tradesHistory$ = this.tradesService.tradesHistory$;
  }

  ngOnInit(): void {}

  public openEditTradeDialog(trade: Trade) : void {
    this.dialog.open(EditTradeModalComponent, {
      data: trade,
    })
  }
}
