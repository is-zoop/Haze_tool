FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

COPY manage_enterprise_users.py ./

CMD ["python", "manage_enterprise_users.py"]