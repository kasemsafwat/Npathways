import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, ChartOptions, registerables } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

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
  totalStudents = 2854;
  activeCourses = 145;
  totalEnrollments = 4652;
  monthlyRevenue = 48395;

  // Recent Transactions
  recentTransactions = [
    { name: 'John Doe', course: 'Advanced Web Development', amount: 350, date: 'Jan 15, 2023' },
    { name: 'Sarah Johnson', course: 'UX Design Fundamentals', amount: 195, date: 'Jan 14, 2023' },
    { name: 'Michael Brown', course: 'Data Science Bootcamp', amount: 250, date: 'Jan 14, 2023' },
    { name: 'Emily Wilson', course: 'Mobile App Development', amount: 175, date: 'Jan 13, 2023' },
    { name: 'David Lee', course: 'AI & Machine Learning', amount: 220, date: 'Jan 13, 2023' }
  ];

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

  revenueChartOptions: ChartOptions = {
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

  enrollmentChartOptions: ChartOptions = {
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

  constructor() {
    Chart.register(...registerables);
  }

  ngOnInit(): void {}
}
