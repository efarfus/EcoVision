@echo off
echo Iniciando Backend...
cd backend
start "" npm start

echo Subindo containers com Docker...
start "" docker-compose up -d

echo Abrindo Prisma Studio...
start "" npx prisma studio

cd ..
echo Iniciando Frontend...
cd frontend
start "" npm start

cd ..
echo Iniciando Backend de IA (Flask)...
cd backend-IA

:: Ativa o ambiente virtual se necessário (descomente a linha abaixo se estiver usando venv)
:: call venv\Scripts\activate.bat

start "" python api.py

cd ..
