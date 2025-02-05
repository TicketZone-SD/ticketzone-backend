# 🎟 TicketZone - Backend (Django + NestJS)

Este repositório contém o backend do sistema **TicketZone**, construído com **Django** para gerenciamento de usuários e **NestJS** para eventos e pedidos.

## 🚀 Tecnologias Usadas
- **Django (Python 3.11)**
- **NestJS (Node.js 20)**
- **PostgreSQL (Banco na Nuvem)**
- **Docker + Docker Compose**

---

## 📌 **Pré-requisitos**
Antes de começar, certifique-se de ter instalado:
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

Caso queira rodar localmente sem Docker:
- [Python 3.11](https://www.python.org/downloads/)
- [Node.js 20+](https://nodejs.org/en/)

---

## ⚙️ **Passo a passo para rodar o backend**

### **1️⃣ Clonar o Repositório**
```bash
git clone https://github.com/TicketZone-SD/ticketzone-backend.git
cd ticketzone-backend
```

### **2️⃣ Configurar as Variáveis de Ambiente**
Crie os arquivos `.env` nas pastas `django/` e `nestjs/` com o seguinte conteúdo:

📂 **`django/.env`**
```ini
DATABASE_URL=postgres://USUARIO:SENHA@HOST:5432/NOME_DO_BANCO
DEBUG=True
SECRET_KEY=sua_chave_secreta_super_segura
ALLOWED_HOSTS=*
```

📂 **`nestjs/.env`**
```ini
DATABASE_URL=postgres://USUARIO:SENHA@HOST:5432/NOME_DO_BANCO
PORT=3003
```

### **3️⃣ Rodar o Backend com Docker**
```bash
docker-compose up --build
```
Isso irá:
- ✅ **Criar e rodar o Django na porta 8000**
- ✅ **Criar e rodar o NestJS na porta 3003**  
- ✅ **Conectar ambos ao PostgreSQL na nuvem**  

Se quiser rodar os containers em segundo plano:
```bash
docker-compose up -d
```

### **4️⃣ Acessar os Serviços**
- **Django API:** `http://localhost:8000`
- **NestJS API:** `http://localhost:3003`
- **Logs do Django:**  
  ```bash
  docker logs -f django_app
  ```
- **Logs do NestJS:**  
  ```bash
  docker logs -f nestjs_app
  ```

---

## 🎯 **Rodando o Backend sem Docker**
Caso prefira rodar localmente:

### **Django (Backend de Usuários)**
```bash
cd django
python -m venv venv
source venv/bin/activate  # No Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### **NestJS (Eventos e Pedidos)**
```bash
cd nestjs
npm install
npm run start:dev
```

---

## 🔄 **Como atualizar o backend**
Se houver mudanças no código, basta rodar:
```bash
docker-compose down
docker-compose up --build
```

Se precisar apenas reiniciar os serviços:
```bash
docker-compose restart
```

---
