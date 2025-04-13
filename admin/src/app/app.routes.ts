import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { UserManagementComponent } from './pages/user-management/user-management.component';
import { CourseManagementComponent } from './pages/course-management/course-management.component';
import { EnrollmentManagementComponent } from './pages/enrollment-management/enrollment-management.component';
import { CertificateComponent } from './pages/certificates/certificates.component';
import { AdminLoginComponent } from './pages/admin-login/admin-login.component';
import { ExamManagementComponent } from './pages/exam-management/exam-management.component';
import { ExamDetailsComponent } from './pages/exam-details/exam-details.component';
import { authGuard } from './guards/auth.guard';
import { PathwaysComponent } from './pages/pathways/pathways.component';

export const routes: Routes = [
  { path: '', redirectTo: 'user-management', pathMatch: 'full' },

  { path: 'admin-login', component: AdminLoginComponent },
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    canActivate: [authGuard],
  },
  {
    path: 'user-management',
    component: UserManagementComponent,
    canActivate: [authGuard],
  },
  {
    path: 'course-management',
    component: CourseManagementComponent,
    canActivate: [authGuard],
  },
  {
    path: 'enrollment-management',
    component: EnrollmentManagementComponent,
    canActivate: [authGuard],
  },
  {
    path: 'certificates',
    component: CertificateComponent,
    canActivate: [authGuard],
  },
  {
    path: 'pathways',
    component: PathwaysComponent,
    canActivate: [authGuard],
  },
  {
    path: 'exam-management',
    component: ExamManagementComponent,
    canActivate: [authGuard],
  },
  {
    path: 'exam-details/:id',
    component: ExamDetailsComponent,
    canActivate: [authGuard],
  },


  // { path: '**', component:NotFoundComponent },

];
