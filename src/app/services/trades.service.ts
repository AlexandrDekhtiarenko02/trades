import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {NEW_TRADE, Trade, TradeHistoryItem} from "../shared/models/trades.interfaces";
import * as moment from "moment";
import {EChartsOption} from "echarts";

@Injectable({
  providedIn: 'root'
})

export class TradesService {

  public balance$ = new BehaviorSubject<number | undefined>(0);
  public trades$ = new BehaviorSubject<Trade[]>([]);
  public tradesHistory$ = new BehaviorSubject<TradeHistoryItem[]>([]);
  public chartOption$ = new BehaviorSubject<EChartsOption>({
    xAxis: {
      type: 'category',
      data: [],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: [],
        type: 'line',
      },
    ],
  })

  constructor() {}

  public addTrade(trade: NEW_TRADE): void {
    const newTrade = {
      id: Date.now().toString(),
      entryDate: Date.parse(trade.entryDate),
      exitDate: Date.parse(trade.exitDate),
      entryPrice: +trade.entryPrice,
      exitPrice: +trade.exitPrice,
      profit: trade.profit
    }
    const newTrades = [...this.trades$.getValue(), newTrade];
    let newTradeHistory = this.createTradeHistory(newTrades);
    newTradeHistory = this.sortTradesHistory(newTradeHistory);

    newTradeHistory.forEach((item, index, arr) => {
      newTradeHistory[index].balance = this.calculateTradesHistoryItemBalance(item.trades, arr[index - 1]?.balance || 0)
    })

    const balances = [...newTradeHistory.map(item => item.balance? item.balance : 0)]
    const dates = newTradeHistory.map(item => moment(new Date(item.date)).format("DD-MM-YYYY"))

    this.chartOption$.next({
      xAxis: {
        type: 'category',
        data: dates,
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: balances,
          type: 'line',
        },
      ],
    })

    this.tradesHistory$.next(newTradeHistory)
    this.trades$.next(newTrades);
    this.balance$.next(this.calculateBalance(newTradeHistory))
  }

  public editTrade(trade: Trade): void {
    const newTrades = this.trades$.getValue().map(item => item.id === trade.id ? trade : item);
    let newTradeHistory = this.createTradeHistory(newTrades)

    newTradeHistory = this.sortTradesHistory(newTradeHistory);
    newTradeHistory.forEach((item, index, arr) => {
      newTradeHistory[index].balance = this.calculateTradesHistoryItemBalance(item.trades, arr[index - 1]?.balance || 0);
    })

    const balances = [...newTradeHistory.map(item => item.balance? item.balance : 0)];
    const dates = newTradeHistory.map(item => moment(new Date(item.date)).format("DD-MM-YYYY"));
    this.chartOption$.next({
      xAxis: {
        type: 'category',
        data: dates,
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: balances,
          type: 'line',
        },
      ],
    })
    this.tradesHistory$.next(newTradeHistory)
    this.trades$.next(newTrades);
    this.balance$.next(this.calculateBalance(newTradeHistory))
  }

  private createTradeHistory(trades: Trade[]) : TradeHistoryItem[]{
    const tradesHistory: TradeHistoryItem[] = [];
    trades.forEach((item) => {
      const foundIndex = tradesHistory.findIndex(tradeHistoryItem => item.exitDate === tradeHistoryItem.date)
      if(foundIndex === -1){
        tradesHistory.push({
          date: item.exitDate,
          trades: trades.filter(trade => trade.exitDate === item.exitDate),
        })
      }
    })
    return tradesHistory;
  }

  private calculateTradesHistoryItemBalance(trades: Trade[], balance: number): number {
    return trades.reduce((sum, trade) => sum += trade.profit, balance | 0)
  }

  private calculateBalance(tradeHistory: TradeHistoryItem[]): number | undefined {
    return tradeHistory.reduce((acc, item) => acc += item.trades.reduce((acc, item) => acc += item.profit, 0), 0)
  }

  private sortTradesHistory(tradesHistory: TradeHistoryItem[]): TradeHistoryItem[] {
    return tradesHistory.sort((a, b) => a.date - b.date )
  }
}
