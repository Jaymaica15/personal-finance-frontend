export interface Transaction {
  direction: string;
  active: any;
  category: string;
  id: number;
  description: string;
  amount: number;
  date: string;
  type: 'INCOME' | 'EXPENSE';
}

