A real-time multiplayer quiz application frontend built using React, Context API, and Socket.io.  
Users can create or join quiz rooms, answer live questions, chat in real time, and view results instantly.

-----------------------------------------------------------------------------------------------------------
 Tech Stack

- React
- React Router DOM
- Context API
- Socket.io Client
- Axios
- Bootstrap
-----------------------------------------------------------------------------------------------------------

Authentication Flow

1. User register or login
2. JWT token is stored in localStorage
3. `/auth/getme` fetches user profile
4. Auth state is managed via Context API
5. Protected routes restrict access

-----------------------------------------------------------------------------------------------------------

 Real-Time Quiz Flow

- Create / Join quiz room
- Real-time player updates
- Quiz starts manually
- Timer per question
- Answer submission with scoring
- Live chat during quiz
- Results page after quiz ends

-----------------------------------------------------------------------------------------------------------

 Features

- JWT Authentication
- Protected Routes
- Real-time multiplayer quiz
- Live chat
- Timer-based questions
- Dynamic score calculation
- create room and join room 

