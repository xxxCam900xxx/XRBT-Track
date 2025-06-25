export interface BookingEntry {
  Name: string;
  Typ: string;
  Betrag: number;
}

export interface MonthEntry {
  Month: string;
  Income: number;
  Outcome: number;
  Overall: number;
  Bookings: BookingEntry[];
}

export interface BudgetStats {
  Budgetname: string;
  Income: number;
  Outcome: number;
  Overall: number;
  Year: number;
  Months: MonthEntry[];
}