import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface User {
  id: number;
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
  styleUrls: ['./user-management.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe]
})
export class UserManagementComponent implements OnInit {
  users: User[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'Student',
      status: 'Active',
      joinDate: new Date('2023-01-15'),
      courses: 3
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      role: 'Instructor',
      status: 'Active',
      joinDate: new Date('2022-11-20'),
      courses: 2
    },
    {
      id: 3,
      name: 'Michael Brown',
      email: 'm.brown@example.com',
      role: 'Student',
      status: 'Inactive',
      joinDate: new Date('2023-02-05'),
      courses: 1
    },
    {
      id: 4,
      name: 'Emily Wilson',
      email: 'emily.w@example.com',
      role: 'Admin',
      status: 'Active',
      joinDate: new Date('2022-08-12'),
      courses: 0
    },
    {
      id: 5,
      name: 'David Lee',
      email: 'david.lee@example.com',
      role: 'Student',
      status: 'Suspended',
      joinDate: new Date('2023-03-18'),
      courses: 4
    },
    {
      id: 6,
      name: 'Jennifer Taylor',
      email: 'jen.taylor@example.com',
      role: 'Instructor',
      status: 'Active',
      joinDate: new Date('2022-10-30'),
      courses: 5
    },
    {
      id: 7,
      name: 'Robert Martinez',
      email: 'r.martinez@example.com',
      role: 'Student',
      status: 'Active',
      joinDate: new Date('2023-04-02'),
      courses: 2
    },
    {
      id: 8,
      name: 'Lisa Anderson',
      email: 'lisa.a@example.com',
      role: 'Student',
      status: 'Active',
      joinDate: new Date('2023-01-25'),
      courses: 3
    }
  ];

  selectedTab: 'all' | 'students' | 'instructors' | 'admins' = 'all';
  searchQuery: string = '';

  get filteredUsers(): User[] {
    let filtered = this.users;

    // Filter by tab
    if (this.selectedTab !== 'all') {
      filtered = filtered.filter(user => 
        user.role.toLowerCase() === this.selectedTab.slice(0, -1)
      );
    }

    // Filter by search query
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
      );
    }

    return filtered;
  }

  constructor() {}

  ngOnInit(): void {}

  selectTab(tab: 'all' | 'students' | 'instructors' | 'admins'): void {
    this.selectedTab = tab;
  }

  @HostListener('document:click', ['$event'])
  handleClick(event: MouseEvent) {
    const dropdowns = document.querySelectorAll('.actions-dropdown');
    dropdowns.forEach(dropdown => {
      if (!dropdown.contains(event.target as Node)) {
        const userId = Number((dropdown as HTMLElement).closest('tr')?.dataset.userId);
        const user = this.users.find(u => u.id === userId);
        if (user) {
          user.showActions = false;
        }
      }
    });
  }

  toggleActions(user: User, event: Event): void {
    event.stopPropagation();
    // Close all other dropdowns
    this.users.forEach(u => {
      if (u.id !== user.id) {
        u.showActions = false;
      }
    });
    // Toggle the clicked user's dropdown
    user.showActions = !user.showActions;
  }

  editUser(user: User): void {
    console.log('Edit user:', user);
    user.showActions = false;
  }

  suspendUser(user: User): void {
    user.status = user.status === 'Suspended' ? 'Active' : 'Suspended';
    user.showActions = false;
  }

  deleteUser(user: User): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.users = this.users.filter(u => u.id !== user.id);
    }
    user.showActions = false;
  }
}
