export interface Account {
    id: number;
    accountName: string;
    accountType: string;
    balance: number;
    currency: string;
    lastUpdated: string;
}

export interface AccountSummary {
    accounts: Account[];
    totalBalance: number;
    cashPosition: number;
}

export interface Transaction {
    id: number;
    accountId: number;
    date: string;
    description: string;
    amount: number;
    category: string;
    status: string;
}

export interface TransactionResponse {
    totalItems: number;
    page: number;
    pageSize: number;
    totalPages: number;
    data: Transaction[];
}

export interface Cashflow {
    date: string;
    income: number;
    expenses: number;
}