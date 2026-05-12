import { Component, OnInit, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { priorityLabels, statusLabels } from '../../shared/labels';
import { DashboardMetrics, MetricBucket, RequestPriority, RequestStatus } from '../../shared/models';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard-page',
  imports: [MatIconModule, MatProgressBarModule],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss'
})
export class DashboardPage implements OnInit {
  private readonly dashboard = inject(DashboardService);
  readonly metrics = signal<DashboardMetrics | null>(null);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly statusLabels = statusLabels;
  readonly priorityLabels = priorityLabels;

  ngOnInit(): void {
    this.dashboard.getMetrics().subscribe({
      next: (metrics) => {
        this.metrics.set(metrics);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Não foi possivel carregar o dashboard.');
        this.loading.set(false);
      }
    });
  }

  labelForStatus(bucket: MetricBucket): string {
    return this.statusLabels[bucket.key as RequestStatus] ?? bucket.key;
  }

  labelForPriority(bucket: MetricBucket): string {
    return this.priorityLabels[bucket.key as RequestPriority] ?? bucket.key;
  }

  percent(bucket: MetricBucket, buckets: MetricBucket[]): number {
    const max = Math.max(...buckets.map((item) => item.total), 1);
    return Math.round((bucket.total / max) * 100);
  }
}
