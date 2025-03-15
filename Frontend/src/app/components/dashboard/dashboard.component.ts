import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Chart } from 'chart.js/auto';

interface ServerStatuses {
  [key: string]: boolean;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('performanceChart') private chartCanvas!: ElementRef;
  private chart: Chart | null = null;

  serverTypes: string[] = [];
  serverStatus: ServerStatuses = {
    'Single-Threaded': false,
    'Multi-Threaded': false,
    'Thread-Pool': false
  };
  error: string | null = null;
  selectedPort = 8080;
  numberOfRequests = 100;
  loadTestResults: any = null;
  isLoading = false;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadServerTypes();
    this.refreshStatus();
  }

  ngAfterViewInit() {
    this.initializeChart();
  }

  private initializeChart() {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Test 1', 'Test 2', 'Test 3', 'Test 4', 'Test 5'],
        datasets: [{
          label: 'Response Time (ms)',
          data: [50, 60, 45, 70, 65],
          backgroundColor: 'rgba(148,159,177,0.2)',
          borderColor: 'rgba(148,159,177,1)',
          pointBackgroundColor: 'rgba(148,159,177,1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(148,159,177,0.8)',
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Response Time (ms)'
            }
          }
        },
        plugins: {
          legend: {
            display: true
          }
        }
      }
    });
  }

  loadServerTypes() {
    this.apiService.getAvailableServers().subscribe({
      next: (types) => {
        this.serverTypes = types;
      },
      error: (error) => {
        console.error('Error fetching server types:', error);
        this.error = 'Failed to fetch server types';
      }
    });
  }

  refreshStatus() {
    this.isLoading = true;
    Promise.all(
      Object.keys(this.serverStatus).map(serverType =>
        this.apiService.getServerStatus(serverType).toPromise()
      )
    ).then(results => {
      results.forEach((result, index) => {
        const serverType = Object.keys(this.serverStatus)[index];
        this.serverStatus[serverType] = result?.running || false;
      });
      this.error = null;
      this.isLoading = false;
    }).catch(error => {
      console.error('Error fetching status:', error);
      this.error = 'Failed to fetch server status';
      this.isLoading = false;
    });
  }

  startServer(serverType: string) {
    this.isLoading = true;
    this.apiService.startServer(serverType, this.selectedPort).subscribe({
      next: () => {
        this.refreshStatus();
        this.error = null;
      },
      error: (error) => {
        console.error('Error starting server:', error);
        this.error = `Failed to start ${serverType} server`;
        this.isLoading = false;
      }
    });
  }

  stopServer(serverType: string) {
    this.isLoading = true;
    this.apiService.stopServer(serverType).subscribe({
      next: () => {
        this.refreshStatus();
        this.error = null;
      },
      error: (error) => {
        console.error('Error stopping server:', error);
        this.error = `Failed to stop ${serverType} server`;
        this.isLoading = false;
      }
    });
  }

  runLoadTest(serverType: string) {
    this.isLoading = true;
    this.loadTestResults = null;
    this.apiService.runLoadTest(serverType, this.selectedPort, this.numberOfRequests).subscribe({
      next: (results) => {
        this.loadTestResults = results;
        this.error = null;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error running load test:', error);
        this.error = 'Failed to run load test';
        this.isLoading = false;
      }
    });
  }
}
