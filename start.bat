@echo off
cd backend
start npm start
start docker-compose up -d
start npx prisma studio
cd ..
cd frontend
start npm start