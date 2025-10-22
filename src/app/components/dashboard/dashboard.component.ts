import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  message: string = '';
  error: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.http.get('http://localhost:8080/api/transactions', { responseType: 'text' })
      .subscribe({
        next: res => this.message = res,
        error: err => this.error = 'Erro ao carregar dados protegidos'
      });
  }
  
  goToTransactions(): void {
    console.log('Card clicado!');
    this.router.navigate(['/transactions']);
  }
}