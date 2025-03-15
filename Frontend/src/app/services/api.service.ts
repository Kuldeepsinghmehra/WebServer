import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

export interface ServerStatus {
  running: boolean;
}

export interface LoadTestResult {
  totalRequests: number;
  totalTime: number;
  averageTime: number;
  requestsPerSecond: number;
  successRate: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8080/api/servers';
  private loadTestResults = new BehaviorSubject<LoadTestResult | null>(null);

  constructor(private http: HttpClient) {}

  startServer(serverType: string, port: number = 8080): Observable<any> {
    return this.http.post(`${this.apiUrl}/${serverType}/start?port=${port}`, {});
  }

  stopServer(serverType: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${serverType}/stop`, {});
  }

  getServerStatus(serverType: string): Observable<ServerStatus> {
    return this.http.get<ServerStatus>(`${this.apiUrl}/${serverType}/status`);
  }

  getAvailableServers(): Observable<string[]> {
    return this.http.get<string[]>(this.apiUrl);
  }

  runLoadTest(serverType: string, port: number, numberOfRequests: number): Observable<LoadTestResult> {
    return this.http.post<LoadTestResult>(`${this.apiUrl}/${serverType}/test`, {
      port,
      numberOfRequests
    });
  }

  getLoadTestResults(): Observable<LoadTestResult | null> {
    return this.loadTestResults.asObservable();
  }

  setLoadTestResults(results: LoadTestResult) {
    this.loadTestResults.next(results);
  }
} 