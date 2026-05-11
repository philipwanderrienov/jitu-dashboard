import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import type { ChartData, ChartOptions } from 'chart.js';
import { firstValueFrom } from 'rxjs';

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
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.css',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule, ChartModule, TableModule]
})
export class DashboardHomeComponent implements OnInit {
  loading = true;

  source: DashboardSource = 'payment';

  paymentRows: PaymentRow[] = [];
  paymentHistoryRows: PaymentRow[] = [];

  paymentTotalAmount = 0;
  paymentHistoryTotalAmount = 0;

  pieData: ChartData<'doughnut'> = {
    labels: ['Payment', 'PaymentHistory'],
    datasets: [
      {
        data: [0, 0],
        backgroundColor: ['#0B3D1A', '#7CD67A']
      }
    ]
  };

  pieOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    cutout: '72%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 10,
          boxHeight: 10
        }
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
        // ensure UI matches whichever data finished last
        this.displayedRows = this.source === 'payment' ? this.paymentRows : this.paymentHistoryRows;
        this.loading = false;
      });
  }

  setSource(source: DashboardSource) {
    this.source = source;
    this.displayedRows = source === 'payment' ? this.paymentRows : this.paymentHistoryRows;
  }

  private async loadPayment(): Promise<void> {
    const res = await firstValueFrom(
      this.http.get<ApiResponse<PaymentRow[]>>('/Payment')
    );

    const rows = Array.isArray(res?.result) ? res?.result : [];
    this.paymentRows = rows.map((x: any) => ({
      trn: x.trn ?? x.Trn ?? null,
      relTrn: x.relTrn ?? x.RelTrn ?? null,
      busDate: x.busDate ?? x.BusDate ?? null,
      settleDate: x.settleDate ?? x.SettleDate ?? null,
      amount: (x.amount ?? x.Amount ?? null) as number | null,
      currency: x.currency ?? x.Currency ?? null,
      txCode: x.txCode ?? x.TxCode ?? null,
      txTypeId: x.txTypeId ?? x.TxTypeId ?? null,
      priorityId: (x.priorityId ?? x.PriorityId ?? null) as number | null,
      updUser: x.updUser ?? x.UpdUser ?? null,
      isAltered: x.isAltered ?? x.IsAltered ?? null
    }));

    this.paymentTotalAmount = this.sumAmount(this.paymentRows);
    this.refreshPie();
    if (this.source === 'payment') this.displayedRows = this.paymentRows;
  }

  private async loadPaymentHistory(): Promise<void> {
    const res = await firstValueFrom(
      this.http.get<ApiResponse<PaymentRow[]>>('/PaymentHistory')
    );

    const rows = Array.isArray(res?.result) ? res?.result : [];
    this.paymentHistoryRows = rows.map((x: any) => ({
      trn: x.trn ?? x.Trn ?? null,
      relTrn: x.relTrn ?? x.RelTrn ?? null,
      busDate: x.busDate ?? x.BusDate ?? null,
      settleDate: x.settleDate ?? x.SettleDate ?? null,
      amount: (x.amount ?? x.Amount ?? null) as number | null,
      currency: x.currency ?? x.Currency ?? null,
      txCode: x.txCode ?? x.TxCode ?? null,
      txTypeId: x.txTypeId ?? x.TxTypeId ?? null,
      priorityId: (x.priorityId ?? x.PriorityId ?? null) as number | null,
      updUser: x.updUser ?? x.UpdUser ?? null,
      isAltered: x.isAltered ?? x.IsAltered ?? null
    }));

    this.paymentHistoryTotalAmount = this.sumAmount(this.paymentHistoryRows);
    this.refreshPie();
    if (this.source === 'paymentHistory') this.displayedRows = this.paymentHistoryRows;
  }

  private refreshPie() {
    const payment = this.paymentTotalAmount;
    const history = this.paymentHistoryTotalAmount;

    // Keep the dataset visuals (green palette); only update numeric values.
    this.pieData = {
      ...this.pieData,
      datasets: [
        {
          ...(this.pieData.datasets?.[0] ?? { data: [], backgroundColor: [] }),
          data: [payment, history]
        } as any
      ]
    };
  }

  private sumAmount(rows: PaymentRow[]): number {
    return rows.reduce((acc, r) => acc + (r.amount ?? 0), 0);
  }
}
