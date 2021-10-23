import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {TradesService} from "../services/trades.service";
import {Subscription} from "rxjs";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {FormTrade, Trade} from "../shared/models/trades.interfaces";

@Component({
  selector: 'app-edit-trade-modal',
  templateUrl: './edit-trade-modal.component.html',
  styleUrls: ['./edit-trade-modal.component.scss']
})
export class EditTradeModalComponent implements OnInit {

  public editTradeForm = new FormGroup({
    entryDate: new FormControl(''),
    exitDate: new FormControl(0),
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

  constructor(@Inject(MAT_DIALOG_DATA) private data: Trade, private dialog: MatDialog, private tradeService: TradesService) {

    this.profit = this.data.profit
    this.editTradeForm.patchValue({
      ...data,
      entryDate: new Date(this.data.entryDate),
      exitDate: new Date(this.data.exitDate),
    })

    this.formSubscription = this.editTradeForm.valueChanges.subscribe((res: FormTrade) => {
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

  public editTrade():void {
    this.tradeService.editTrade({
      ...this.data,
      ...this.editTradeForm.value,
      entryDate: Date.parse(this.editTradeForm.controls['entryDate'].value),
      exitDate: Date.parse(this.editTradeForm.controls['exitDate'].value),
      profit: this.profit
    })
    this.closeModal();
  }
  public closeModal(): void{
    this.dialog.closeAll()
  }
}
