import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {Trade, TradeHistoryItem} from "../shared/models/trades.interfaces";
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

  public addTrade(trade: { entryDate: string, exitDate: string, entryPrice: number, exitPrice: number, profit: number }): void {
    let newTradeHistory = this.tradesHistory$.getValue();
    const newTrade = {
      id: Date.now().toString(),
      entryDate: Date.parse(trade.entryDate),
      exitDate: Date.parse(trade.exitDate),
      entryPrice: +trade.entryPrice,
      exitPrice: +trade.exitPrice,
      profit: trade.profit
    }
    const newTrades = [...this.trades$.getValue(), newTrade];
    if (newTradeHistory.length === 0) {
      newTradeHistory.push({
        date: +newTrade.exitDate,
        trades: [newTrade],
        balance: newTrade.profit
      })
    }
    else{
      const tradesDates = newTradeHistory.map(item => item.date)
      if(tradesDates.includes(newTrade.exitDate)){
        newTradeHistory = newTradeHistory.map((item, index) => {
          return {
            ...item,
            trades: [
              ...item.trades,
              newTrade
            ],
          }
        })
      }
      else {
        newTradeHistory.push({
          date: +newTrade.exitDate,
          trades: [newTrade],
        })
      }
    }
    newTradeHistory = this.sortTradesHistory(newTradeHistory).map((item, index) => ({...item, balance: this.calculateTradesHistoryItemBalance(item.trades, newTradeHistory[index - 1]?.balance)}))
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
    this.trades$.next(newTrades)
    let newTradeHistory = this.tradesHistory$.getValue().map(item => {
      const tradesIds = item.trades.map(item => item.id)
      if (tradesIds.includes(trade.id)) {
        return {
          ...item,
          trades: item.trades.map(item => item.id === trade.id ? trade : item),
        }
      } else {
        return item
      }
    })
    newTradeHistory = this.sortTradesHistory(newTradeHistory).map((item, index) => ({...item, balance: this.calculateTradesHistoryItemBalance(item.trades, newTradeHistory[index - 1]?.balance)}))
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
    this.balance$.next(this.calculateBalance(newTradeHistory))
  }

  private calculateTradesHistoryItemBalance(trades: Trade[], balance: number | undefined): number {
    return trades.reduce((sum, trade) => sum += trade.profit, balance || 0)
  }

  private calculateBalance(tradeHistory: TradeHistoryItem[]): number | undefined {
    return tradeHistory[tradeHistory.length-1]?.balance
  }

  private sortTradesHistory(tradesHistory: TradeHistoryItem[]): TradeHistoryItem[] {
    return tradesHistory.sort((a, b) => {
      if (a.date < b.date) {
        return -1;
      }
      if (a.date > b.date) {
        return 1;
      }
      return 0;
    })
  }

}
