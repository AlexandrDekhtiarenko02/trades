export interface Trade {
  id: string,
  entryDate: number
  exitDate: number,
  entryPrice: number,
  exitPrice: number
  profit: number,
}
export interface FormTrade {
  entryDate: string,
  exitDate: string,
  entryPrice: number,
  exitPrice: number
  profit: number,
}
export interface TradeHistoryItem {
  date: number,
  trades: Trade[],
  balance?: number
}
export interface NEW_TRADE {
  id: string,
  entryDate: string,
  exitDate: string,
  entryPrice: number,
  exitPrice: number,
  profit: number
}
