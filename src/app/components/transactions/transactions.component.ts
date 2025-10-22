import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Transaction } from '../../models/transaction.model';
import { MatCardModule } from "@angular/material/card";
import { MatListModule } from "@angular/material/list";
import { MatTableModule } from "@angular/material/table";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { TransactionDialog } from '../../transaction-dialog/transaction-dialog';
import { TransactionService } from './transactions.service';
import { MatIconModule } from '@angular/material/icon';
import { MatSort, MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-transactions',
  standalone: true,
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
  imports: [
    CommonModule, // ✅ habilita *ngIf, *ngFor
    MatCardModule, // ✅ habilita <mat-card>
    MatListModule,
    MatIconModule,
    MatSortModule, // ✅ habilita ordenação
    MatTableModule,// ✅ habilita <mat-table>
    MatProgressBarModule // ✅ habilita <mat-progress-bar>
  ]
})

export class TransactionsComponent implements OnInit {
  displayedColumns: string[] = ['id', 'category', 'description', 'date', 'type', 'amount', 'actions', ];
  transactions: Transaction[] = [];
  sortedData: Transaction[];
  loading: boolean = true;
  error: string = '';

  constructor(private apiService: ApiService, private http: HttpClient, private dialog: MatDialog, private transactionService: TransactionService) {
    this.sortedData = this.transactions.slice();
  }

  @ViewChild(MatSort) sort!: MatSort;

  sortData(sort: Transaction) {
    const data = this.transactions.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'id':
          return compare(a.id, b.id, isAsc);
        case 'date':
          return compare(a.date, b.date, isAsc);
        case 'amount':
          return compare(a.amount, b.amount, isAsc);
        default:
          return 0;
      }
    });
  }

  ngOnInit(): void {
    this.http.get<Transaction[]>('http://localhost:8080/api/transactions')
      .subscribe({
        next: res => this.transactions = res,
        error: err => console.error('Erro ao carregar transações', err),
        complete: () => {
          this.loading = false;
        }
    });
  }

  openDialog() {
    this.dialog.open(TransactionDialog).afterClosed().subscribe((newTransaction) => {
      if (newTransaction) {
        this.transactions.push(newTransaction);
      }
    });
  }

  editTransaction(transaction: Transaction) {
    const dialogRef = this.dialog.open(TransactionDialog, {
      data: transaction // envia os dados para o diálogo
    });

    dialogRef.afterClosed().subscribe(editedTransaction => {
      if (editedTransaction) {
        // Atualiza a lista local
        const index = this.transactions.findIndex(t => t.id === editedTransaction.id);
        if (index !== -1) {
          this.transactions[index] = editedTransaction;
        }
        this.ngOnInit(); // atualiza a lista
      }
    });
  }

  delete(id: number) {
    this.transactionService.deleteTransaction({ id } as Transaction).subscribe({
      next: () => {
        console.log('Transação deletada');
        this.ngOnInit(); // atualiza a lista
      },
      error: (erro) => {
        console.error('Erro ao deletar:', erro);
      }
    });
  }
}

function compare(a: number | string | Date | undefined, b: number | string | Date | undefined, isAsc: boolean) {
  if (a === undefined || b === undefined) return 0;
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}