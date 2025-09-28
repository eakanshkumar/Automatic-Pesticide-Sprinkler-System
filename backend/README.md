# KrishiNetra Backend

A complete MERN stack backend for the KrishiNetra Precision Agriculture Dashboard.

## Features

- User authentication and authorization
- Farm management
- Spray event tracking
- Analytics and reporting
- Notifications system
- Image upload with Cloudinary
- Email and SMS notifications

## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables in `.env`
4. Start the server: `npm run dev`

## Environment Variables

Create a `.env` file with the following variables:

NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smartspray
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
SENDGRID_API_KEY=your_sendgrid_api_key
EMAIL_FROM=noreply@smartspray.com
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
CLIENT_URL=http://localhost:3000


## API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/updatedetails` - Update user details
- `PUT /api/auth/updatepassword` - Update password
- `GET /api/auth/logout` - Logout user

### Farm Endpoints

- `GET /api/farms` - Get all farms for user
- `POST /api/farms` - Create new farm
- `GET /api/farms/:id` - Get single farm
- `PUT /api/farms/:id` - Update farm
- `DELETE /api/farms/:id` - Delete farm

### Spray Event Endpoints

- `GET /api/spray` - Get all spray events
- `POST /api/spray` - Create new spray event
- `GET /api/spray/:id` - Get single spray event
- `PUT /api/spray/:id` - Update spray event
- `DELETE /api/spray/:id` - Delete spray event

### Analytics Endpoints

- `GET /api/analytics` - Get analytics data
- `GET /api/analytics/efficiency` - Get efficiency comparison
- `GET /api/analytics/infection-trends` - Get infection trends
- `POST /api/analytics/generate-report` - Generate analytics report

### Notification Endpoints

- `GET /api/notifications` - Get all notifications
- `POST /api/notifications` - Create notification
- `GET /api/notifications/:id` - Get single notification
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification

## Security Features

- JWT authentication
- Password hashing with bcrypt
- Rate limiting
- XSS protection
- NoSQL injection prevention
- Helmet.js for security headers
- CORS enabled

## Deployment

1. Set environment variables in production
2. Build the application: `npm start`
3. Use process manager like PM2 for production
4. Set up reverse proxy with Nginx
5. Configure SSL certificate

## License

