import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { DashboardService } from '../../services/dashboard.service';
import { PaymentService } from '../../services/payment.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  currentDate = new Date();

  // Statistics
  totalStudents = 0;
  activeStudents = 0;
  totalCourses = 0;
  publishedCourses = 0;
  totalInstructors = 0;
  availableInstructors = 0;
  monthlyRevenue = 0;

  // Recent Transactions
  recentTransactions: any[] = [];

  // Top Performing Courses
  topCourses = [
    { name: 'Web Development', students: 145, completion: 99, duration: '14h', rating: 4.8 },
    { name: 'UX Design', students: 98, completion: 92, duration: '14h', rating: 4.9 },
    { name: 'Data Science', students: 124, completion: 90, duration: '14h', rating: 4.7 },
    { name: 'App Development', students: 96, completion: 90, duration: '14h', rating: 4.6 }
  ];

  // Revenue Chart Configuration
  revenueChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Jan', 'Mar', 'Apr', 'Jun', 'Jul', 'Aug', 'Oct', 'Dec'],
    datasets: [{
      data: [20000, 25000, 30000, 35000, 40000, 45000, 50000, 55000],
      label: 'Revenue',
      backgroundColor: '#4318FF'
    }]
  };

  revenueChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { display: true }
      },
      x: {
        grid: { display: false }
      }
    }
  };

  // Enrollment Trends Chart Configuration
  enrollmentChartData: ChartConfiguration<'line'>['data'] = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        data: [100, 150, 180, 200, 220, 250, 270, 300, 320, 350, 380, 400],
        label: 'Enrollments',
        borderColor: '#4318FF',
        tension: 0.4,
        fill: false
      },
      {
        data: [80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300],
        label: 'Completions',
        borderColor: '#05CD99',
        tension: 0.4,
        fill: false
      }
    ]
  };

  enrollmentChartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: { display: true },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { display: true }
      },
      x: {
        grid: { display: false }
      }
    }
  };

  constructor(
    private dashboardService: DashboardService,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
    this.loadTransactions();
  }

  loadDashboardData(): void {
    this.dashboardService.getDashboardData().subscribe({
      next: (response) => {
        console.log('Dashboard data:', response);
        this.totalStudents = response.data.students.total;
        this.activeStudents = response.data.students.active;
        this.totalCourses = response.data.courses.total;
        this.publishedCourses = response.data.courses.published;
        this.totalInstructors = response.data.instructors.total;
        this.availableInstructors = response.data.instructors.available;
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
      }
    });
  }

  loadTransactions(): void {
    this.paymentService.getAllPayments().subscribe({
      next: (response) => {
        this.recentTransactions = response.map((transaction: any) => ({
          name: `${transaction.user.firstName} ${transaction.user.lastName}`,
          course: transaction.course ? transaction.course.name : 'N/A',
          amount: transaction.amount,
          date: new Date(transaction.paidAt).toLocaleDateString()
        }));

        // Calculate and update revenue data
        this.calculateMonthlyRevenue(response);
      },
      error: (error) => {
        console.error('Error loading transactions:', error);
      }
    });
  }

  calculateMonthlyRevenue(transactions: any[]): void {
    // Initialize monthly revenue data
    const monthlyData = new Array(12).fill(0);
    const currentYear = new Date().getFullYear();

    // Calculate revenue for each month
    transactions.forEach(transaction => {
      const transactionDate = new Date(transaction.paidAt);
      if (transactionDate.getFullYear() === currentYear) {
        const month = transactionDate.getMonth();
        monthlyData[month] += transaction.amount;
      }
    });

    // Update the chart data
    this.revenueChartData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [{
        data: monthlyData,
        label: 'Revenue',
        backgroundColor: '#4318FF'
      }]
    };

    // Calculate total monthly revenue
    this.monthlyRevenue = monthlyData[new Date().getMonth()];
  }
}
