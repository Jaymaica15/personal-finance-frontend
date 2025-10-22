import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Transaction } from '../../models/transaction.model';
import { MatCardModule } from "@angular/material/card";
import { MatListModule } from "@angular/material/list";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { TransactionDialog } from '../../transaction-dialog/transaction-dialog';
import { TransactionService } from './transactions.service';
import { MatIconModule } from '@angular/material/icon';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { After } from 'v8';
import { LiveAnnouncer } from '@angular/cdk/a11y';

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
    MatPaginatorModule,
    MatSortModule, // ✅ habilita ordenação
    MatTableModule, // ✅ habilita <mat-table>
    MatProgressBarModule // ✅ habilita <mat-progress-bar>
  ]
})

export class TransactionsComponent implements OnInit{

  private _liveAnnouncer = inject(LiveAnnouncer);

  displayedColumns: string[] = ['id', 'category', 'description', 'date', 'type', 'amount', 'actions'];
  dataSource = new MatTableDataSource<Transaction>();
  transactions: Transaction[] = [];
  loading: boolean = true;
  error: string = '';

  constructor(private apiService: ApiService, private http: HttpClient, private dialog: MatDialog, private transactionService: TransactionService) {}

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.http.get<Transaction[]>('http://localhost:8080/api/transactions')
      .subscribe({
        next: res => {
          this.transactions = res;
          this.atualizarTabela(res)
        },
        error: err => console.error('Erro ao carregar transações', err),
        complete: () => this.loading = false
    });
  }

  atualizarTabela(transactions: Transaction[]) {
    this.dataSource.data = transactions;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  openDialog() {
    this.dialog.open(TransactionDialog).afterClosed().subscribe((newTransaction) => {
      if (newTransaction) {
        this.transactions.push(newTransaction);
        this.dataSource.data = this.transactions;
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
        this.dataSource.data = this.transactions;
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
  
  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}