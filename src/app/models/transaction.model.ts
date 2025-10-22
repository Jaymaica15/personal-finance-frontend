export interface Transaction {
  category: string;
  id: number;
  description: string;
  amount: number;
  date: string;
  type: 'INCOME' | 'EXPENSE';
}

