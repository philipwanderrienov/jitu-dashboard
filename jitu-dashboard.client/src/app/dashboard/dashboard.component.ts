import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { ChartData, ChartOptions } from 'chart.js';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
type PaymentRow = {
  trn: string | null;
  amount: number | null;
  currency: string | null;
  relTrn: string | null;
  busDate: string | null;
  settleDate: string | null;
  txCode: string | null;
  txTypeId: string | null;
  priorityId: number | null;
  updUser: string | null;
  isAltered: string | null;
};

type ApiResponse<T> = {
  success: boolean;
  exception: boolean;
  code: string;
  message: string;
  result: T;
};

type DashboardSource = 'payment' | 'paymentHistory';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  standalone: true,
  imports: [ButtonModule, CardModule, ChartModule, TableModule]
})
export class DashboardComponent implements OnInit {
  loading = true;

  source: DashboardSource = 'payment';

  paymentRows: PaymentRow[] = [];
  paymentHistoryRows: PaymentRow[] = [];

  paymentTotalAmount = 0;
  paymentHistoryTotalAmount = 0;

  pieData: ChartData<'pie'> = {
    labels: ['Payment', 'PaymentHistory'],
    datasets: [
      {
        data: [0, 0],
        backgroundColor: ['#1e90ff', '#ff4d6d']
      }
    ]
  };

  pieOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      },
      tooltip: {
        callbacks: {}
      }
    }
  };

  displayedRows: PaymentRow[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    Promise.all([this.loadPayment(), this.loadPaymentHistory()])
      .finally(() => {
        this.loading = false;
      });
  }

  setSource(source: DashboardSource) {
    this.source = source;
    this.displayedRows = source === 'payment' ? this.paymentRows : this.paymentHistoryRows;
  }

  private async loadPayment(): Promise<void> {
    const res = await this.http
      .get<ApiResponse<PaymentRow[]>>('/Payment')
      .toPromise();

    this.paymentRows = (res?.result ?? []).map((x: any) => ({
      trn: x.trn,
      relTrn: x.relTrn,
      busDate: x.busDate,
      settleDate: x.settleDate,
      amount: x.amount,
      currency: x.currency,
      txCode: x.txCode,
      txTypeId: x.txTypeId,
      priorityId: x.priorityId,
      updUser: x.updUser,
      isAltered: x.isAltered
    }));

    this.paymentTotalAmount = this.sumAmount(this.paymentRows);
    this.refreshPie();
    if (this.source === 'payment') this.displayedRows = this.paymentRows;
  }

  private async loadPaymentHistory(): Promise<void> {
    const res = await this.http
      .get<ApiResponse<PaymentRow[]>>('/PaymentHistory')
      .toPromise();

    this.paymentHistoryRows = (res?.result ?? []).map((x: any) => ({
      trn: x.trn,
      relTrn: x.relTrn,
      busDate: x.busDate,
      settleDate: x.settleDate,
      amount: x.amount,
      currency: x.currency,
      txCode: x.txCode,
      txTypeId: x.txTypeId,
      priorityId: x.priorityId,
      updUser: x.updUser,
      isAltered: x.isAltered
    }));

    this.paymentHistoryTotalAmount = this.sumAmount(this.paymentHistoryRows);
    this.refreshPie();
    if (this.source === 'paymentHistory') this.displayedRows = this.paymentHistoryRows;
  }

  private refreshPie() {
    const payment = this.paymentTotalAmount;
    const history = this.paymentHistoryTotalAmount;

    this.pieData = {
      ...this.pieData,
      datasets: [
        {
          ...(this.pieData.datasets?.[0] ?? { data: [] }),
          data: [payment, history]
        } as any
      ]
    };
  }

  private sumAmount(rows: PaymentRow[]): number {
    return rows.reduce((acc, r) => acc + (r.amount ?? 0), 0);
  }
}
