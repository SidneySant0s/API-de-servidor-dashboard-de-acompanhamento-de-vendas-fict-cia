# 📌 Minha API

API desenvolvida em **Node.js + Express + MySQL** com autenticação via **JWT**.  
Permite gerenciar usuários, leads e simular dados de vendas, com endpoints protegidos por token.

---

## 🚀 Tecnologias utilizadas
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [MySQL](https://www.mysql.com/)
- [JWT (jsonwebtoken)](https://www.npmjs.com/package/jsonwebtoken)
- [Cors](https://www.npmjs.com/package/cors)

---

## 📚 Endpoints

**Usuários**
- `POST /api/profile/create` → cria usuário
- `POST /api/login` → login e retorna token
- `GET /api/profile` → retorna name, email, phone do usuário logado
- `PUT /api/profile/update` → atualiza nome e telefone
- `DELETE /api/profile/delete` → deleta usuário

**Leads**
- `GET /api/leads` → lista leads
- `POST /api/leads/create` → cria lead
- `DELETE /api/leads/delete/:id` → deleta lead

**Outros**
- `GET /api/news` → notícias simuladas
- `GET /api/sales/highlights` → destaques de vendas
- `GET /api/sales/month` → vendas por dia
- `GET /api/sales/year` → vendas por mês
- `GET /api/sales/stars` → ranking de vendedores

---

## ⚙️ Instalação

Clone o repositório e instale as dependências:

```bash
git clone https://github.com/seu-usuario/minha-api.git
cd minha-api
npm install
