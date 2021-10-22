import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {TradesService} from "../services/trades.service";
import {Subscription} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {FormTrade} from "../shared/models/trades.interfaces";

@Component({
  selector: 'app-add-trade-modal',
  templateUrl: './add-trade-modal.component.html',
  styleUrls: ['./add-trade-modal.component.scss']
})
export class AddTradeModalComponent implements OnInit, OnDestroy {

  public addTradeForm = new FormGroup({
    entryDate: new FormControl(''),
    exitDate: new FormControl(''),
    entryPrice: new FormControl('', [
      Validators.min(0)
    ]),
    exitPrice: new FormControl('', [
      Validators.min(0)
    ]),
  })

  public profit: number = 0;
  public dateError: boolean = false;
  public formSubscription: Subscription;

  constructor(public dialog: MatDialog, private tradeService: TradesService) {
    this.formSubscription = this.addTradeForm.valueChanges.subscribe((res: FormTrade) => {
      this.profit = +res.exitPrice - +res.entryPrice
      if(Date.parse(res.entryDate) > Date.parse(res.exitDate)){
        this.dateError = true;
      }
      else {
        this.dateError = false;
      }
    })
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.formSubscription.unsubscribe()
  }

  public addTrade():void {
    this.tradeService.addTrade({
      ...this.addTradeForm.value,
      profit: this.profit
    })
    this.closeModal();
  }

  public closeModal(): void{
    this.dialog.closeAll()
  }
}
