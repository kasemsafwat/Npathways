# Backend Documentation

## Socket.io Documentation

### Emit

---

#### `sendMessageToGeneral`

Emits a message to the server which will then be sent to all users in the 'general' chat.

Example:

- `socket.emit('sendMessageToGeneral', { message: 'Hello World' });`

---

#### `joinChat`

Emits the chat ID to the server which will then add the user to that chat.

Example:

- `socket.emit('joinChat', { chatId: '5f9f1c5b9b6f335a0cebcc9e' });`

---

#### `sendMessage`

Emits a message to the server which will then be sent to all users in the same chat.

Example:

- `socket.emit('sendMessage', { chatId: '5f9f1c5b9b6f335a0cebcc9e', message: 'Hello World' });`

### Receive

---

#### `receiveMessageFromGeneral`

Receives a message from the server which was sent by another user in the same chat.

Example:

- `socket.on('receiveMessageFromGeneral', ({ senderId, userName, content, time }) => { console.log(`${userName} sent message: ${content}`); });`

---

#### `receiveMessage`

Receives a message from the server which was sent by another user in the same chat.

Example:

- `socket.on('receiveMessage', ({ senderId, userName, content, time }) => { console.log(`${userName} sent message: ${content}`); });`

## Endpoints

### Admin

#### `POST /api/admin/signup`

WIP

#### `POST /api/admin/login`

WIP

#### `GET /api/admin/all`

WIP

#### `GET /api/admin/search`

WIP

#### `POST /api/admin/createNewInstructor`

WIP

#### `POST /api/admin/create-NewStudent`

WIP

#### `PUT /api/admin/updateData/:adminId`

WIP

#### `PUT /api/admin/updateData/:userId`

WIP

#### `GET /api/admin/dashboard`

WIP

### Chat

#### `POST /api/chat/:id`

- **Description**: Access a chat using the user ID.
- **Authentication Required**: Yes
- **Request Parameters**:
  - `id`: User ID (must be a valid MongoDB ObjectId)
- **Request Headers**:
  - `Authorization`: Bearer token
- **Responses**:
  - `200 OK`: Returns the chat details.
  - `201 Created`: Chat created successfully.
  - `400 Bad Request`: Invalid chat ID format.
  - `404 Not Found`: User not found.

#### `POST /api/chat/sendMessage/:id`

- **Description**: Send a message to a chat using the chat ID.
- **Authentication Required**: Yes
- **Request Parameters**:
  - `id`: Chat ID (must be a valid MongoDB ObjectId)
- **Request Body**:
  - `message`: The message content to send.
- **Request Headers**:
  - `Authorization`: Bearer token
- **Responses**:
  - `201 Created`: Message sent successfully.
  - `400 Bad Request`: Invalid chat ID or message format.
  - `404 Not Found`: Chat not found.

#### `GET /api/chat/messages/:id`

- **Description**: Retrieve all messages from a chat using the chat ID.
- **Authentication Required**: Yes
- **Request Parameters**:
  - `id`: Chat ID (must be a valid MongoDB ObjectId)
- **Request Headers**:
  - `Authorization`: Bearer token
- **Responses**:
  - `200 OK`: Returns an array of messages.
  - `400 Bad Request`: Invalid chat ID format.
  - `404 Not Found`: Chat not found.

### Courses

#### `GET /api/course/`

- **Description**: Retrieve all courses.
- **Authentication Required**: No
- **Request Headers**: None
- **Responses**:
  - `200 OK`: Returns an array of courses.
  - `500 Internal Server Error`: Internal server error.

#### `GET /api/course/:id`

- **Description**: Retrieve a single course using the course ID.
- **Authentication Required**: No
- **Request Parameters**:
  - `id`: Course ID (must be a valid MongoDB ObjectId)
- **Request Headers**: None
- **Responses**:
  - `200 OK`: Returns a course object.
  - `400 Bad Request`: Invalid course ID format.
  - `404 Not Found`: Course not found.

#### `POST /api/course/createCourse`

- **Description**: Create a new course.
- **Authentication Required**: No
- **Request Headers**: None
- **Request Body**:
  - `name`: The course name.
  - `requiredExams`: An array of exam IDs.
  - `instructors`: An array of instructor IDs.
  - `lessons`: An array of lessons. (WIP)
- **Responses**:
  - `201 Created`: Course created successfully.
  - `400 Bad Request`: Invalid course name, required exams, instructors, or lessons format.

#### `PUT /api/course/updateCourse/:id`

- **Description**: Update a course using the course ID.
- **Authentication Required**: No
- **Request Parameters**:
  - `id`: Course ID (must be a valid MongoDB ObjectId)
- **Request Headers**: None
- **Request Body**:
  - `name`: The course name.
  - `requiredExams`: An array of exam IDs.
  - `instructors`: An array of instructor IDs.
  - `lessons`: An array of lessons. (WIP)
- **Responses**:
  - `200 OK`: Course updated successfully.
  - `400 Bad Request`: Invalid course ID, name, required exams, instructors, or lessons format.
  - `404 Not Found`: Course not found.

#### `DELETE /api/course/deleteCourse/:id`

(WIP)

- **Description**: Delete a course using the course ID.
- **Authentication Required**: No
- **Request Parameters**:
  - `id`: Course ID (must be a valid MongoDB ObjectId)
- **Request Headers**: None
- **Responses**:
  - `200 OK`: Course deleted successfully.
  - `400 Bad Request`: Invalid course ID format.
  - `404 Not Found`: Course not found.

### Exams

#### `GET /api/exam/`

- **Description**: Retrieve all exams.
- **Authentication Required**: No
- **Request Parameters**: None
- **Request Headers**: None
- **Responses**:
  - `200 OK`: Returns a list of all exams.

#### `GET /api/exam/:id`

- **Description**: Retrieve an exam using the exam ID.
- **Authentication Required**: No
- **Request Parameters**:
  - `id`: Exam ID (must be a valid MongoDB ObjectId)
- **Request Headers**: None
- **Responses**:
  - `200 OK`: Returns the exam details.
  - `400 Bad Request`: Invalid exam ID format.
  - `404 Not Found`: Exam not found.

#### `POST /api/exam/createExam`

- **Description**: Create a new exam.
- **Authentication Required**: No
- **Request Body**:
  - `name`: The exam name.
  - `questions`: An array of questions.
  - `timeLimit`: The time limit for the exam.
- **Request Headers**: None
- **Responses**:
  - `201 Created`: Exam created successfully.
  - `400 Bad Request`: Invalid exam data.

#### `PUT /api/exam/updateExam/:id`

- **Description**: Update an exam using the exam ID.
- **Authentication Required**: No
- **Request Parameters**:
  - `id`: Exam ID (must be a valid MongoDB ObjectId)
- **Request Headers**: None
- **Request Body**:
  - `name`: The exam name.
  - `questions`: An array of questions.
  - `timeLimit`: The time limit for the exam.
- **Responses**:
  - `200 OK`: Exam updated successfully.
  - `400 Bad Request`: Invalid exam ID or data.
  - `404 Not Found`: Exam not found.

#### `DELETE /api/exam/deleteExam/:id`

(WIP)

- **Description**: Delete an exam using the exam ID.
- **Authentication Required**: No
- **Request Parameters**:
  - `id`: Exam ID (must be a valid MongoDB ObjectId)
- **Request Headers**: None
- **Responses**:
  - `200 OK`: Exam deleted successfully.
  - `400 Bad Request`: Invalid exam ID format.
  - `404 Not Found`: Exam not found.

### Students

#### `DELETE /api/student/:id`

WIP

#### `GET /api/student/`

WIP

#### `PATCH /api/student/`

WIP

#### `POST /api/student/update/password`

WIP

#### `POST /api/student/upgrade/:userId`

WIP

#### `POST /api/student/add-course/:userId`

WIP

### Users

#### `POST /api/user/signup`

WIP

#### `POST /api/user/login`

WIP

#### `GET /api/user/all`

WIP

#### `GET /api/user/search`

WIP

#### `GET /api/user/:id`

WIP
