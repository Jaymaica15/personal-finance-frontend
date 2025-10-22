import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from "@angular/material/card";
import { MatListModule } from "@angular/material/list";
import { MatTableModule } from "@angular/material/table";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import {ChangeDetectionStrategy} from '@angular/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';  
import { TransactionService } from '../components/transactions/transactions.service';
import { Transaction } from '../models/transaction.model';


@Component({
  standalone: true,
  selector: 'app-transaction-dialog',
  templateUrl: './transaction-dialog.html',
  styleUrls: ['./transaction-dialog.scss'],
  providers: [provideNativeDateAdapter(), TransactionService],
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatListModule,
    MatTableModule,
    MatProgressBarModule,
    MatDatepickerModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionDialog {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TransactionDialog>,
    private transactionService: TransactionService,
    @Inject(MAT_DIALOG_DATA) public data: Transaction
  ) {
    this.form = this.fb.group({
      id: new FormControl(data?.id),
      category: new FormControl(data?.category, Validators.required),
      description: new FormControl(data?.description),
      date: new FormControl(data?.date, Validators.required),
      type: new FormControl(data?.type, Validators.required),
      amount: new FormControl(data?.amount, [Validators.required, Validators.min(0.01)])
    });
  }

  dataForm = new FormControl<Date | null>(null);

  submit(): void {

    if (this.form.invalid) {
      this.form.markAllAsTouched(); // exibe os erros no template
      return; // impede envio
    }

    const transaction = this.form.value;

    const request = transaction.id
      ? this.transactionService.updateTransaction(transaction)
      : this.transactionService.createTransaction(transaction);

    request.subscribe({
      next: (resposta) => {
        this.dialogRef.close(resposta); // envia de volta ao componente pai
      },
      error: (erro) => {
        console.error('Erro ao salvar transação:', erro);
      }
    });
  }
}

