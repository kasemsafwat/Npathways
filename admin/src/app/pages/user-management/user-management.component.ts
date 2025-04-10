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
  showEditModal: boolean = false;
  userToEdit: any = null;
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
    // Load users data
    this.loadUsers();
    
    // When query params change, we update the page number
    this.route.queryParams.subscribe((params) => {
      const page = +params['page'] || 1;
      if (page !== this.currentPage) {
        this.currentPage = page;
      }
    });
  }

  loadUsers(): void {
    // Load students
    this.studentService.getAllStudents().subscribe((students) => {
      const studentUsers: User[] = students.map((student) => ({
        id: student._id,
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
          const adminUsers: User[] = admins.map((admin: { _id: string; firstName: string; lastName: string; email: string }) => ({
            id: admin._id || '',
            name: `${admin.firstName} ${admin.lastName}`,
            email: admin.email,
            role: 'Admin',
            status: 'Active',
            joinDate: new Date(),
            courses: 0,
            showActions: false,
          }));

          // Combine all lists
          this.users = [...studentUsers, ...instructorUsers, ...adminUsers];
          
          // Update pagination if needed
          if (this.currentPage > this.totalPages) {
            this.currentPage = this.totalPages;
            this.updateUrlWithoutReload(this.currentPage);
          }
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

  createAdmin(form: any): void {
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
    // Split the name into first and last name
    const nameParts = user.name.split(' ');
    this.userToEdit = {
      id: user.id,
      firstName: nameParts[0] || '',
      lastName: nameParts.slice(1).join(' ') || '',
      email: user.email || '',
      role: user.role,
      password: '' // For password change
    };
    this.showEditModal = true;
  }

  updateUser(form: any): void {
    if (!this.validateForm()) {
      return;
    }

    const updateData: any = {};
    
    // Only add fields that have values
    if (this.userToEdit.firstName) {
      updateData.firstName = this.userToEdit.firstName;
    }
    if (this.userToEdit.lastName) {
      updateData.lastName = this.userToEdit.lastName;
    }
    if (this.userToEdit.email) {
      updateData.email = this.userToEdit.email;
    }
    if (this.userToEdit.password) {
      updateData.password = this.userToEdit.password;
    }

    // Only proceed if there are changes
    if (Object.keys(updateData).length === 0) {
      this.showEditModal = false;
      return;
    }

    if (this.userToEdit.role === 'Student') {
      this.studentService.updateUserByAdmin(this.userToEdit.id, updateData)
        .subscribe({
          next: () => {
            this.loadUsers();
            this.showEditModal = false;
          },
          error: (error) => {
            console.error('Error updating student:', error);
          }
        });
    } else if (this.userToEdit.role === 'Instructor') {
      this.instructorService.updateInstructor(this.userToEdit.id, updateData)
        .subscribe({
          next: () => {
            this.loadUsers();
            this.showEditModal = false;
          },
          error: (error) => {
            console.error('Error updating instructor:', error);
          }
        });
    } else if (this.userToEdit.role === 'Admin') {
      this.authService.updateAdminById(this.userToEdit.id, updateData)
        .subscribe({
          next: () => {
            this.loadUsers();
            this.showEditModal = false;
          },
          error: (error) => {
            console.error('Error updating admin:', error);
          }
        });
    }
  }

  private validateForm(): boolean {
    // Email validation
    if (this.userToEdit.email && !this.isValidEmail(this.userToEdit.email)) {
      return false;
    }

    // Password validation
    if (this.userToEdit.password && (this.userToEdit.password.length < 6 || this.userToEdit.password.length > 50)) {
      return false;
    }

    // Name validation
    if (this.userToEdit.firstName && !this.isValidName(this.userToEdit.firstName)) {
      return false;
    }

    if (this.userToEdit.lastName && !this.isValidName(this.userToEdit.lastName)) {
      return false;
    }

    return true;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  private isValidName(name: string): boolean {
    const nameRegex = /^[a-zA-Z\s]*$/;
    return nameRegex.test(name) && name.length <= 50;
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
  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updateUrlWithoutReload(page);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
  }

  get paginatedUsers(): User[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredUsers.slice(startIndex, endIndex);
  }

  // Update the page number in the URL without reloading
  private updateUrlWithoutReload(page: number): void {
    const url = new URL(window.location.href);
    url.searchParams.set('page', page.toString());
    window.history.pushState({}, '', url.toString());
  }
}
