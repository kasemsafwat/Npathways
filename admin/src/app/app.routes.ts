import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { UserManagementComponent } from './pages/user-management/user-management.component';
import { CourseManagementComponent } from './pages/course-management/course-management.component';
import { EnrollmentManagementComponent } from './pages/enrollment-management/enrollment-management.component';
import { ReportsAnalyticsComponent } from './pages/reports-analytics/reports-analytics.component';

export const routes: Routes = [
  { path: '', redirectTo: 'admin-dashboard', pathMatch: 'full' },
  { path: 'admin-dashboard', component: AdminDashboardComponent },
  { path: 'user-management', component: UserManagementComponent },
  { path: 'course-management', component: CourseManagementComponent },
  { path: 'enrollment-management', component: EnrollmentManagementComponent },
  { path: 'reports-analytics', component: ReportsAnalyticsComponent },
  // { path: '**', component:NotFoundComponent },
];
