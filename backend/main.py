import asyncio
import logging
from typing import List, Optional
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import httpx
import os
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="JHADEPILOT Backend API",
    description="AI-powered code generation platform backend",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend domain
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# Pydantic models
class PromptRequest(BaseModel):
    prompt: str = Field(..., min_length=1, max_length=1000, description="The code generation prompt")

class AgentStatus(BaseModel):
    agent: str = Field(..., description="Agent name (BuildAgent, TestAgent, DeployAgent)")
    status: str = Field(..., description="Agent status (pending, running, success, failed)")
    message: Optional[str] = Field(None, description="Optional status message")

class GenerateResponse(BaseModel):
    code: str = Field(..., description="Generated code")
    statuses: List[AgentStatus] = Field(..., description="Agent execution statuses")
    timestamp: datetime = Field(default_factory=datetime.now, description="Generation timestamp")

class ErrorResponse(BaseModel):
    error: str = Field(..., description="Error message")
    detail: Optional[str] = Field(None, description="Detailed error information")

# Configuration
BLACKBOX_API_URL = "https://api.blackbox.ai/v1/chat/completions"
BLACKBOX_API_KEY = os.getenv("BLACKBOX_API_KEY", "your-blackbox-api-key-here")

class BlackboxService:
    """Service class for interacting with Blackbox.ai API"""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
    
    async def generate_code(self, prompt: str) -> str:
        """Generate code using Blackbox.ai API"""
        payload = {
            "model": "blackbox-code",
            "messages": [
                {
                    "role": "system",
                    "content": "You are an expert software developer. Generate clean, production-ready code based on the user's requirements. Include comments and follow best practices."
                },
                {
                    "role": "user",
                    "content": f"Generate code for: {prompt}"
                }
            ],
            "max_tokens": 2000,
            "temperature": 0.7
        }
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            try:
                response = await client.post(
                    BLACKBOX_API_URL,
                    json=payload,
                    headers=self.headers
                )
                response.raise_for_status()
                
                data = response.json()
                generated_code = data["choices"][0]["message"]["content"]
                return generated_code
                
            except httpx.HTTPStatusError as e:
                logger.error(f"Blackbox API HTTP error: {e.response.status_code} - {e.response.text}")
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail=f"External API error: {e.response.status_code}"
                )
            except httpx.RequestError as e:
                logger.error(f"Blackbox API request error: {str(e)}")
                raise HTTPException(
                    status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                    detail="External API service unavailable"
                )
            except KeyError as e:
                logger.error(f"Unexpected API response format: {str(e)}")
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail="Invalid response from external API"
                )

class AgentSimulator:
    """Simulates the build, test, and deploy agents"""
    
    @staticmethod
    async def simulate_agents() -> List[AgentStatus]:
        """Simulate agent execution with realistic timing"""
        agents = ["BuildAgent", "TestAgent", "DeployAgent"]
        statuses = []
        
        for agent in agents:
            # Simulate processing time
            await asyncio.sleep(0.5)
            
            # Simulate success/failure (90% success rate)
            import random
            success = random.random() > 0.1
            
            status = AgentStatus(
                agent=agent,
                status="success" if success else "failed",
                message="Completed successfully" if success else "Process encountered an error"
            )
            statuses.append(status)
        
        return statuses

# Initialize services
blackbox_service = BlackboxService(BLACKBOX_API_KEY)
agent_simulator = AgentSimulator()

@app.get("/", tags=["Health"])
async def root():
    """Health check endpoint"""
    return {
        "message": "JHADEPILOT Backend API is running",
        "version": "1.0.0",
        "status": "healthy",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/health", tags=["Health"])
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "services": {
            "blackbox_api": "configured" if BLACKBOX_API_KEY != "your-blackbox-api-key-here" else "not_configured",
            "agents": "operational"
        },
        "timestamp": datetime.now().isoformat()
    }

@app.post("/generate", response_model=GenerateResponse, tags=["Code Generation"])
async def generate_code(request: PromptRequest):
    """
    Generate code based on the provided prompt using Blackbox.ai API
    
    - **prompt**: The description of what code to generate
    
    Returns generated code and agent execution statuses
    """
    try:
        logger.info(f"Received code generation request: {request.prompt[:100]}...")
        
        # Validate API key configuration
        if BLACKBOX_API_KEY == "your-blackbox-api-key-here":
            logger.warning("Blackbox API key not configured, using fallback")
            # Fallback to mock response
            generated_code = f"""# Generated code for: {request.prompt}

import asyncio
from typing import List, Dict, Any

class GeneratedSolution:
    \"\"\"
    Auto-generated solution based on your requirements:
    {request.prompt}
    \"\"\"
    
    def __init__(self):
        self.initialized = True
        print("Solution initialized successfully")
    
    async def execute(self) -> Dict[str, Any]:
        \"\"\"Execute the main functionality\"\"\"
        try:
            # Implementation based on your prompt
            result = await self._process_request()
            return {{
                "status": "success",
                "data": result,
                "message": "Operation completed successfully"
            }}
        except Exception as e:
            return {{
                "status": "error",
                "error": str(e),
                "message": "Operation failed"
            }}
    
    async def _process_request(self) -> Any:
        \"\"\"Process the specific request\"\"\"
        # TODO: Implement specific logic for: {request.prompt}
        await asyncio.sleep(0.1)  # Simulate processing
        return "Generated solution ready"

# Usage example
if __name__ == "__main__":
    solution = GeneratedSolution()
    result = asyncio.run(solution.execute())
    print(f"Result: {{result}}")
"""
        else:
            # Use Blackbox.ai API
            generated_code = await blackbox_service.generate_code(request.prompt)
        
        # Simulate agent execution
        agent_statuses = await agent_simulator.simulate_agents()
        
        response = GenerateResponse(
            code=generated_code,
            statuses=agent_statuses
        )
        
        logger.info("Code generation completed successfully")
        return response
        
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"Unexpected error during code generation: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error during code generation"
        )

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Custom HTTP exception handler"""
    return {
        "error": exc.detail,
        "status_code": exc.status_code,
        "timestamp": datetime.now().isoformat()
    }

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """General exception handler"""
    logger.error(f"Unhandled exception: {str(exc)}")
    return {
        "error": "Internal server error",
        "detail": "An unexpected error occurred",
        "timestamp": datetime.now().isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )