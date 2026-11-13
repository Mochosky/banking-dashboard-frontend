import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AccountSummary, Cashflow, TransactionResponse } from '../../models/banking.models';

@Injectable({ providedIn: 'root' })
export class BankingService {
    private http = inject(HttpClient);

    // Backend API URL for fetching account summary data.
    private apiUrl = 'https://banking-dashboard-backend.onrender.com/api';

    // This signal holds the fetched data and instantly updates the UI when changed
    summarySignal = signal<AccountSummary | null>(null);
    transactionsSignal = signal<TransactionResponse | null>(null);
    cashflowSignal = signal<Cashflow[] | null>(null);
    errorSignal = signal<string | null>(null);

    // Method to load the account summary data from the backend API.
    loadSummary() {
        this.http.get<AccountSummary>(`${this.apiUrl}/accounts/summary`).subscribe({
            next: (data) => this.summarySignal.set(data),
            error: (err) => {
                console.error('API Error:', err);
                this.errorSignal.set('Unable to connect to the banking services. Summary cannot be loaded. Please try again later.');
            }
        });
    }

    // Method to load the transaction data from the backend API with pagination support.
    loadTransactions(page: number = 1) {
        this.http.get<TransactionResponse>(`${this.apiUrl}/transactions?page=${page}&pageSize=10`).subscribe({
            next: (data) => this.transactionsSignal.set(data),
            error: (err) => {
                console.error('API Error:', err);
                this.errorSignal.set('Unable to connect to the banking services. Transactions cannot be loaded. Please try again later.');
            }
        });
    }

    // Method to load the cashflow data from the backend API.
    loadCashflow() {
        this.http.get<Cashflow[]>(`${this.apiUrl}/analytics/cashflow`).subscribe({
            next: (data) => this.cashflowSignal.set(data),
            error: (err) => {
                console.error('API Error:', err);
                this.errorSignal.set('Unable to connect to the banking services. Cashflow data cannot be loaded. Please try again later.');
            }
        });
    }
}