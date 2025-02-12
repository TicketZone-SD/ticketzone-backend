# Usar imagem oficial do Python
FROM python:3.11

# Definir variável de ambiente para logs
ENV PYTHONUNBUFFERED=1

# Definir diretório de trabalho
WORKDIR /app

# Atualizar pacotes e instalar dependências do PostgreSQL
RUN apt-get update && apt-get install -y \
  libpq-dev gcc && rm -rf /var/lib/apt/lists/*

# Copiar apenas o arquivo de dependências primeiro (melhora cache)
COPY requirements.txt .

# Atualizar pip para evitar problemas
RUN pip install --upgrade pip

# Instalar dependências do Python
RUN pip install --no-cache-dir -r requirements.txt

# Instalar pacote de debug para desenvolvimento
RUN pip install debugpy

# Criar diretórios para arquivos estáticos e de mídia (se necessário)
RUN mkdir -p /app/media /app/static

# Copiar todo o código do Django
COPY . .

# Expor porta padrão do Django e debug (Opcional)
EXPOSE 8000 5678

# Comando para iniciar o servidor no modo de desenvolvimento
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
