# Employee Scheduling Software

A modern web application for managing employee schedules, time-off requests, and shift swaps. Built with React, Django, and PostgreSQL.

## Features

### User Management
- Role-based access control (Admin, Manager, Employee)
- User authentication and authorization
- Profile management

### Shift Management
- Create and manage shifts
- Assign employees to shifts
- Filter shifts by role, location, and date
- Search functionality for shifts

### Availability Management
- Employees can set their availability
- Managers can view team availability
- Filter availability by date and status

### PTO (Paid Time Off) System
- Submit PTO requests
- Request types: Vacation, Sick, Other
- Approval workflow (Pending, Approved, Rejected)
- Filter and search PTO requests

### Shift Swap System
- Request shift swaps with other employees
- View pending swap requests
- Accept or reject swap requests
- Filter swap requests by status

## Technical Stack

### Frontend
- React with TypeScript
- Create React App
- Modern UI components
- Responsive design

### Backend
- Django 4.0
- Django REST Framework
- PostgreSQL database
- Poetry for dependency management

### API Features
- RESTful API endpoints
- JWT authentication
- Filtering and search capabilities
- Pagination
- Role-based permissions

## Project Structure

```
schedule-software/
├── client/                 # React frontend
│   ├── src/               # Source files
│   ├── public/            # Static files
│   └── package.json       # Frontend dependencies
├── server/                # Django backend
│   ├── main/             # Django project settings
│   ├── schedulingDB/     # Main app
│   │   ├── models.py     # Database models
│   │   ├── views.py      # API views
│   │   ├── serializers.py # API serializers
│   │   └── urls.py       # URL routing
│   └── manage.py         # Django management script
├── .venv/                # Python virtual environment
└── pyproject.toml        # Poetry dependencies
```

## API Endpoints

### Users
- `GET /api/users/` - List users (admin only)
- `POST /api/users/` - Create user (admin only)
- `GET /api/users/{id}/` - Get user details
- `PUT /api/users/{id}/` - Update user (admin only)
- `DELETE /api/users/{id}/` - Delete user (admin only)

### Shifts
- `GET /api/shifts/` - List shifts (filtered by user role)
- `POST /api/shifts/` - Create shift (admin/manager)
- `GET /api/shifts/{id}/` - Get shift details
- `PUT /api/shifts/{id}/` - Update shift (admin/manager)
- `DELETE /api/shifts/{id}/` - Delete shift (admin/manager)

### Availability
- `GET /api/availabilities/` - List availability
- `POST /api/availabilities/` - Set availability
- `GET /api/availabilities/{id}/` - Get availability details
- `PUT /api/availabilities/{id}/` - Update availability
- `DELETE /api/availabilities/{id}/` - Delete availability

### PTO Requests
- `GET /api/pto-requests/` - List PTO requests
- `POST /api/pto-requests/` - Create PTO request
- `GET /api/pto-requests/{id}/` - Get PTO request details
- `PUT /api/pto-requests/{id}/` - Update PTO request
- `DELETE /api/pto-requests/{id}/` - Delete PTO request

### Shift Swaps
- `GET /api/shift-swaps/` - List shift swaps
- `POST /api/shift-swaps/` - Create shift swap request
- `GET /api/shift-swaps/{id}/` - Get shift swap details
- `PUT /api/shift-swaps/{id}/` - Update shift swap status
- `DELETE /api/shift-swaps/{id}/` - Delete shift swap request

## Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js and Yarn
- PostgreSQL
- Poetry (Python package manager)

### Backend Setup
1. Create and configure PostgreSQL database
2. Create `.env` file in server directory:
   ```
   SECRET_KEY=your-secret-key
   DEBUG=True
   DB_NAME=your_db_name
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_HOST=localhost
   DB_PORT=5432
   ```
3. Install dependencies:
   ```bash
   poetry install
   ```
4. Run migrations:
   ```bash
   cd server
   poetry shell
   python manage.py migrate
   ```
5. Start the server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup
1. Install dependencies:
   ```bash
   cd client
   yarn install
   ```
2. Start the development server:
   ```bash
   yarn start
   ```

## Development Roadmap

### Phase 1 (Current)
- Basic user management
- Shift creation and management
- Availability tracking
- PTO request system

### Phase 2
- Shift swap marketplace
- Calendar integration
- Email notifications
- Mobile responsiveness

### Phase 3
- Advanced reporting
- Time tracking
- Payroll integration
- API documentation

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details. 
