# JHADEPILOT Backend API

A production-ready FastAPI backend for the JHADEPILOT AI code generation platform.

## Features

- ✅ **FastAPI Framework** - Modern, fast web framework for building APIs
- ✅ **Blackbox.ai Integration** - AI-powered code generation
- ✅ **Async HTTP Requests** - Non-blocking API calls with httpx
- ✅ **Pydantic Models** - Type-safe request/response validation
- ✅ **Error Handling** - Comprehensive error handling and logging
- ✅ **CORS Support** - Cross-origin resource sharing for frontend integration
- ✅ **OpenAPI Documentation** - Automatic API documentation at `/docs`
- ✅ **Health Checks** - Service health monitoring endpoints
- ✅ **Agent Simulation** - Build, Test, Deploy agent status simulation

## Quick Start

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Set Environment Variables

```bash
export BLACKBOX_API_KEY="your-actual-blackbox-api-key"
```

### 3. Run the Server

```bash
python main.py
```

Or using uvicorn directly:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 4. Access the API

- **API Base URL**: http://localhost:8000
- **Interactive Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### POST /generate

Generate code based on a prompt.

**Request Body:**
```json
{
  "prompt": "Build a chatbot using FastAPI"
}
```

**Response:**
```json
{
  "code": "# Generated code here...",
  "statuses": [
    {
      "agent": "BuildAgent",
      "status": "success",
      "message": "Completed successfully"
    },
    {
      "agent": "TestAgent", 
      "status": "success",
      "message": "Completed successfully"
    },
    {
      "agent": "DeployAgent",
      "status": "success", 
      "message": "Completed successfully"
    }
  ],
  "timestamp": "2025-01-04T10:30:00"
}
```

### GET /

Health check endpoint.

### GET /health

Detailed health check with service status.

## Configuration

### Environment Variables

- `BLACKBOX_API_KEY`: Your Blackbox.ai API key (required for AI code generation)

### CORS Configuration

By default, CORS is configured to allow all origins (`*`). In production, update the `allow_origins` list in `main.py` to include only your frontend domain:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-frontend-domain.com"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)
```

## Error Handling

The API includes comprehensive error handling:

- **400 Bad Request**: Invalid input data
- **502 Bad Gateway**: External API errors
- **503 Service Unavailable**: External service unavailable
- **500 Internal Server Error**: Unexpected server errors

## Logging

The application uses Python's built-in logging module. Logs include:

- Request information
- API call details
- Error messages and stack traces
- Performance metrics

## Testing the API

### Using curl

```bash
# Health check
curl http://localhost:8000/

# Generate code
curl -X POST http://localhost:8000/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Create a simple REST API with FastAPI"}'
```

### Using the Interactive Docs

Visit http://localhost:8000/docs to test the API using the built-in Swagger UI.

## Production Deployment

### Using Docker

Create a `Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Environment Variables for Production

```bash
BLACKBOX_API_KEY=your-production-api-key
CORS_ORIGINS=https://your-frontend-domain.com
LOG_LEVEL=info
```

## Integration with Frontend

Your JHADEPILOT frontend can call this API:

```javascript
const response = await fetch('http://localhost:8000/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    prompt: userPrompt
  })
});

const data = await response.json();
console.log('Generated code:', data.code);
console.log('Agent statuses:', data.statuses);
```

## Support

For issues or questions, please check the API documentation at `/docs` or review the error messages in the API responses.