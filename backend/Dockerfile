FROM python:3.10-slim

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PORT=7860

WORKDIR /code

# Install build dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install
COPY requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Set up a new user named "user" with UID 1000
RUN useradd -m -u 1000 user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH

WORKDIR $HOME/app

# Copy the rest of the application files and set ownership to user
COPY --chown=user . $HOME/app

# Ensure database is writable for SQLite
RUN chmod -R 777 $HOME/app

USER user

EXPOSE 7860

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7860"]
