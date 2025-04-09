import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentService } from '../../services/student.service';
import { InstructorService } from '../../services/instructor.service';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'Student' | 'Instructor' | 'Admin';
  status: 'Active' | 'Inactive' | 'Suspended';
  joinDate: Date;
  courses: number;
  avatar?: string;
  showActions?: boolean;
}

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  selectedTab: 'all' | 'students' | 'instructors' | 'admins' = 'all';
  searchQuery: string = '';
  showCreateAdminModal: boolean = false;
  newAdmin = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  };

  constructor(
    private studentService: StudentService,
    private instructorService: InstructorService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // When query params change, we update the page number
    this.route.queryParams.subscribe((params) => {
      this.currentPage = +params['page'] || 1;
      this.loadUsers();
    });
  }

  loadUsers(): void {
    // Load students
    this.studentService.getAllStudents().subscribe((students) => {
      const studentUsers: User[] = students.map((student) => ({
        id: student._id, // أو student.id لو متأكدة إنه موجود كده
        name: `${student.firstName} ${student.lastName}`,
        email: student.email,
        role: 'Student',
        status: 'Active',
        joinDate: new Date(student.createdAt || new Date()),
        courses: student.courses?.length || 0,
        showActions: false,
      }));

      // Load instructors
      this.instructorService.getAllInstructors().subscribe((instructors) => {
        const instructorUsers: User[] = instructors.map((instructor) => ({
          id: instructor._id || '',
          name: `${instructor.firstName} ${instructor.lastName}`,
          email: instructor.email,
          role: 'Instructor',
          status: 'Active',
          joinDate: new Date(),
          courses: 0,
          showActions: false,
        }));

        // Load admins
        this.authService.getAllAdmins().subscribe((admins) => {
          const adminUsers: User[] = admins.map(
            (admin: {
              _id: string;
              firstName: string;
              lastName: string;
              email: string;
            }) => ({
              id: admin._id || '',
              name: `${admin.firstName} ${admin.lastName}`,
              email: admin.email,
              role: 'Admin',
              status: 'Active',
              joinDate: new Date(),
              courses: 0,
              showActions: false,
            })
          );

          // Combine all lists
          this.users = [...studentUsers, ...instructorUsers, ...adminUsers];
        });
      });
    });
  }

  get filteredUsers(): User[] {
    let filtered = this.users;

    // Filter by tab
    if (this.selectedTab !== 'all') {
      filtered = filtered.filter(
        (user) => user.role.toLowerCase() === this.selectedTab.slice(0, -1)
      );
    }

    // Filter by search query
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
      );
    }

    return filtered;
  }

  selectTab(tab: 'all' | 'students' | 'instructors' | 'admins'): void {
    this.selectedTab = tab;
  }

  @HostListener('document:click', ['$event'])
  handleClick(event: MouseEvent) {
    const dropdowns = document.querySelectorAll('.actions-dropdown');
    dropdowns.forEach((dropdown) => {
      if (!dropdown.contains(event.target as Node)) {
        const userId = (dropdown as HTMLElement).closest('tr')?.dataset[
          'userId'
        ];
        const user = this.users.find((u) => u.id === userId);
        if (user) {
          user.showActions = false;
        }
      }
    });
  }

  toggleActions(user: User, event: Event): void {
    event.stopPropagation();
    // Close all other dropdowns
    this.users.forEach((u) => {
      if (u.id !== user.id) {
        u.showActions = false;
      }
    });
    // Toggle the clicked user's dropdown
    user.showActions = !user.showActions;
  }

  createAdmin(): void {
    this.authService.createAdmin(this.newAdmin).subscribe({
      next: () => {
        this.showCreateAdminModal = false;
        this.newAdmin = {
          firstName: '',
          lastName: '',
          email: '',
          password: '',
        };
        this.loadUsers(); // Reload users to show the new admin
      },
      error: (error) => {
        console.error('Error creating admin:', error);
      },
    });
  }

  editUser(user: User): void {
    if (user.role === 'Admin') {
      const adminData = {
        firstName: user.name.split(' ')[0],
        lastName: user.name.split(' ')[1],
        email: user.email,
      };
      this.authService.updateAdminById(user.id, adminData).subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (error) => {
          console.error('Error updating admin:', error);
        },
      });
    }
    user.showActions = false;
  }

  suspendUser(user: User): void {
    user.status = user.status === 'Suspended' ? 'Active' : 'Suspended';
    user.showActions = false;
  }

  userToDelete: User | null = null;
  showDeleteConfirmationModal: boolean = false;

  confirmDeleteUser(user: User): void {
    this.userToDelete = user;
    this.showDeleteConfirmationModal = true;
  }

  deleteConfirmedUser(): void {
    if (!this.userToDelete) return;

    const user = this.userToDelete;

    if (user.role === 'Student') {
      this.studentService.deleteStudent(user.id).subscribe(() => {
        this.users = this.users.filter((u) => u.id !== user.id);
      });
    } else if (user.role === 'Instructor') {
      this.instructorService.deleteInstructor(user.id).subscribe(() => {
        this.users = this.users.filter((u) => u.id !== user.id);
      });
    } else if (user.role === 'Admin') {
      this.authService.deleteAdmin(user.id).subscribe(() => {
        this.users = this.users.filter((u) => u.id !== user.id);
      });
    }

    this.showDeleteConfirmationModal = false;
    this.userToDelete = null;
  }

  // pagination variables
  currentPage: number = 1;
  itemsPerPage: number = 10;
  // pagination for user page
  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return; // تأكد من أن الصفحة ضمن الحدود
    this.currentPage = page;
  }

  get totalPages(): number {
    return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
  }

  // Update the page number in the URL
  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return; // Ensure valid page number
    this.router.navigate([], {
      queryParams: { page },
      queryParamsHandling: 'merge', // Merge with existing query params
    });
  }
}
