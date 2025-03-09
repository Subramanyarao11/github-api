# GitHub API Integration Service

A robust NestJS-based REST API service that integrates with GitHub's API to provide profile and repository information, with built-in caching, rate limiting, and analytics.

## Features

- **GitHub Integration**
  - Fetch user profile information
  - Get detailed repository information
  - Create issues in repositories
  - Cached responses for improved performance

- **Security & Performance**
  - Rate limiting to prevent abuse
  - API key authentication for analytics endpoints
  - Response caching with configurable TTL
  - Request analytics and monitoring

- **API Documentation**
  - Swagger/OpenAPI documentation available at `/api-docs`
  - Detailed endpoint descriptions and request/response schemas

## Prerequisites

- Node.js (v18 or later)
- Yarn package manager
- GitHub Personal Access Token
- Docker (optional, for containerized deployment)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=3000
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_USERNAME=your_github_username
THROTTLE_TTL=60
THROTTLE_LIMIT=10
ANALYTICS_API_KEY=your_analytics_api_key
```

## Installation

```bash
# Install dependencies
$ yarn install
```

## Running the Application

```bash
# Development mode
$ yarn start

# Watch mode
$ yarn start:dev

# Production mode
$ yarn start:prod
```

## Docker Deployment

```bash
# Build and run with Docker Compose
$ docker-compose up --build

# Run in detached mode
$ docker-compose up -d
```

## API Endpoints

### GitHub Operations

- `GET /github` - Get user profile information
- `GET /github/:repoName` - Get repository details
- `POST /github/:repoName/issues` - Create an issue in a repository

### Analytics

- `GET /analytics` - Get API usage metrics (requires API key)
- `DELETE /admin/cache/clear` - Clear cache (localhost only)

## Cache Management

The application implements a caching system with the following features:

- Profile cache TTL: 2 minutes
- Repository cache TTL: 2 minutes
- Automatic cache invalidation on issue creation
- Manual cache clearing endpoint for administrators

## Rate Limiting

Rate limiting is implemented to prevent API abuse:

- Default limit: 10 requests per minute
- Configurable through environment variables
- Custom error responses with retry-after headers

## Analytics

The service includes built-in analytics that track:

- Total request count
- Endpoint usage statistics
- Response times
- Status code distribution
- Hourly metrics summaries

## Project Structure

```
src/
├── analytics/       # Analytics module and services
├── cache/           # Cache management
├── common/          # Shared components (guards, interceptors, middleware)
├── github/          # GitHub integration module
├── config/          # Configuration management
└── main.ts          # Application entry point
```

## Technical Stack

- NestJS - Progressive Node.js framework
- @octokit/rest - GitHub API client
- cache-manager - Caching implementation
- class-validator - DTO validation
- @nestjs/swagger - API documentation
- Docker - Containerization
