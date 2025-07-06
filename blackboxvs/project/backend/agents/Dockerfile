FROM python:3.11-slim-bookworm

# Set Mumbai-specific optimizations
ENV TZ=Asia/Kolkata
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

# Install system dependencies optimized for India
RUN apt-get update && apt-get install -y \
    curl \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies with India mirror
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create non-root user for security
RUN useradd --create-home --shell /bin/bash jhadepilot && \
    chown -R jhadepilot:jhadepilot /app
USER jhadepilot

# Health check optimized for Indian network conditions
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8001/health || exit 1

# Expose port
EXPOSE 8001

# Run with production ASGI server
CMD ["uvicorn", "main_agent:app", "--host", "0.0.0.0", "--port", "8001", "--workers", "2"]