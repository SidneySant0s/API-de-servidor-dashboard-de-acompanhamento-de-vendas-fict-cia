const express = require('express');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const SECRET ='minha_chave_secreta';
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

function autenticarToken(req, res, next) { 
    const authHeader = req.headers['authorization']; 
        if (!authHeader) { 
            return res.status(401).json({ message: 'Token não fornecido' }); 
        }

// Garante que começa com "Bearer " 
    if (!authHeader.startsWith('Bearer ')) { 
        return res.status(401).json({ message: 'Formato do token inválido' }); 
    } 
 const token = authHeader.split(' ')[1]; 

    jwt.verify(token, SECRET, (err, user) => { 
        if (err) { console.error('Erro na verificação do token:', err); 
            return res.status(403).json({ message: 'Token inválido' }); } 
            req.user = user; next(); 
    }); 
}

//Conexão com Mysql
const db = mysql.createConnection({
    host: 'localhost',
    user: '-',//coloque seu usuario aqui do *SQL Workbench*
    password: '-', //coloque sua senha aqui *SQL Workbench*
    database: '-', //coloque o nome do seu banco de dados aqui
})

//Endpoint de login

app.post('/api/profile/create', (req, res) => {
    const {name, email, phone, password} = req.body;

    const sql ='INSERT INTO usuarios (name, email, phone, password) VALUES(?, ?, ?, ?)';
    db.query(sql, [name, email, phone, password], (err, result) => {
        if(err) {
            return res.status(500).json({message: 'Erro ao criar usuário', error: err});
        }
        res.status(201).json({
            message: 'Usuario criado com sucess!',
            user: {id: result.insertId, name, email, phone}
        });
    });
});

// Endpoint de Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM usuarios WHERE email = ? AND password = ?';
  db.query(sql, [email, password], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Erro no servidor', error: err });
    }

    if (results.length > 0) {
        //Gerando a chave
         const user = {id: results[0].id, email: results[0].email};
         const token = jwt.sign(user,SECRET, {expiresIn: '1h'});

      res.status(200).json({
        
        jwt_token: token,
        id: user.id
        
      });
    } else {
      res.status(401).json({ message: 'Credenciais inválidas' });
    }
  });
});

app.get('/api/profile', autenticarToken, (req, res) => {
    const userId = req.user.id;

    const sql = 'SELECT name, email, phone FROM usuarios WHERE id = ?'; 
    db.query(sql, [userId], (err, results) => { 
        if (err) { 
            return res.status(500).json({ message: 'Erro no servidor', error: err }); 
        } if (results.length === 0) { 
            return res.status(404).json({ message: 'Usuário não encontrado' }); 
        } 
        const { name, email, phone } = results[0]; 
        res.status(200).json({ 
            name, email, phone
        }); 
    });
});

app.put('/api/profile/update', autenticarToken, (req, res) =>{
    const { name, phone} = req.body;
    const userId = req.user.id;

    const sql = 'UPDATE usuarios SET name = ?, phone = ? WHERE id = ?';
    db.query(sql, [name, phone, userId], (err, result) => {
        if (err){
            return res.status(500).json({ message: 'Erro ao atualizar usuario', error: err});
        
        }
        if (result.affectedRows === 0){
            return res.status(404).json({ message: 'Usuário não encontrado'});
        }

        res.status(200).json({
            message: 'Usuário atualizado com sucesso!',
            user: {userId, name, phone}
        });
    });
});

app.delete('/api/profile/delete', autenticarToken, (req, res) =>{
    const userId = req.user.id;

    const sql = 'DELETE FROM usuarios WHERE id = ?';
    db.query(sql, [userId], (err, result) =>{
        if(err){
            return res.status(500).json({ message: 'Erro ao deletar usuário', error: err});
        }

        if (result.affectedRows === 0){
            return res.status(404).json({ message: 'Usuario não encontrado'});
        }
        res.status(200).json({ message: 'Usuário deletado com sucesso!'});
    });
});

app.get('/api/news', autenticarToken, (req, res) =>{
    const noticias =[
        { 
            title: "Adultização vira pauta nacional após vídeo viral", 
            date: `16:30`
        },  
        { 
            title: "COP30 transforma Belém na capital do Brasil", 
            date: `15:25`
        }, 
        { 
            title: "Violência contra a mulher cresce em 2025", 
            date: `13:45` 
        }, 
            { title: "Retorno de Trump gera impacto global", 
            date: `12:15` 
        }]; 
            res.status(200).json(noticias);
    
});

app.get('/api/sales/highlights', autenticarToken, (req, res) =>{

    const metamoth = Math.floor(Math.random() * 50000);
    const metavalue = Math.floor(Math.random() * 80000);
    const valueLeads = Math.floor(Math.random() * 3000);
   
    const difference = Math.abs (metamoth - metavalue)
    let status; 
        if (metavalue < metamoth && difference < 20000){ 
            status = "warning";
        }else if (metavalue >= metamoth ){ 
            status = "success";
        }else if (difference >= 20000 ){
            status = "alert";
        }else { 
            status = 'normal'}
    const highlights = [
    { value: metavalue , subtitle: `Atualizado em ${new Date().toLocaleString('pt-BR')}` }, 
    { value: metamoth, subtitle: status }, 
    { value: valueLeads, subtitle: "Clique aqui para gerenciar seus leads " }
    ];
    res.status(200).json(highlights);
});
app.get('/api/sales/month', autenticarToken, (req, res) =>{
    const diasDoMes = Array.from({ length: 31}, (_, i) => String(i + 1).padStart(2, '0'));
    
    //Simulando valores de vendas diárias
    const valuesDays = diasDoMes.map(()=> Math.floor((Math.random() * 2000).toFixed(2)));

    const resultado = {
        labels: diasDoMes,
        data: valuesDays,
        type: "line"
    };

    res.status(200).json(resultado);
});

app.get('/api/sales/year', autenticarToken, (req, res) => { 
    const mesesDoAno = [ "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul",   "Ago", "Set", "Out", "Nov", "Dez" ]; 
    // Simulando valores de vendas mensais 
    const valoresMensais = mesesDoAno.map(() => parseFloat((Math.random() * 50000).toFixed(2))); 
    const resultado = { 
    labels: mesesDoAno, 
    data: valoresMensais, 
    type: "bar" }; 
res.status(200).json(resultado); });

app.get('/api/sales/stars', autenticarToken, (req, res) =>{
    const vendedores =[
        { name: "João Silva", value: 45200.75 }, 
        { name: "Maria Souza", value: 38900.50 }, 
        { name: "Carlos Pereira", value: 27500.00 }, 
        { name: "Ana Costa", value: 19800.20 }
    ];

    res.status(200).json(vendedores);
});

app.post('/api/leads/create', autenticarToken, (req, res) => {
    const {name, email, phone} = req.body;
    if(!name || !email || !phone){
        return res.status(400).json({message: 'Todos os campos são obrigatorios: name, email, phone'})
    }
    const sql = 'INSERT INTO leads (name, email, phone) VALUES (?, ?, ?)';

    db.query(sql, [name, email, phone], (err,result) =>{
        if(err){
            return res.status(500).json({message: 'Erro ao criar lead', error: err});
        }

        res.status(201).json({
            message: 'Lead criado com sucesso!', 
            leadId: result.insertId,
             name, 
             email, 
             phone
        });
    });
});

app.get('/api/leads', autenticarToken, (req, res) =>{
    const sql = 'SELECT * FROM leads ORDER BY created_at DESC';
    db.query(sql, (err, results) => {
        if (err) { 
            return res.status(500).json({ message: 'Erro ao buscar leads', error: err }); 
        } 
    res.status(200).json(results);
    });
});

app.delete('/api/leads/delete/:id', autenticarToken, (req, res) => {
    const { id } =req.params;

    const sql = 'DELETE FROM leads WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if(err){
            return res.status(500).json({message: 'Error ao deleta lead', error: err});
        }

        if (result.affectedRows ==0){
            return res.status(404).json({message: 'Lead não encontrado'});
        }

        res.status(200).json({message: 'Lead com ID ${id} deletado com sucesso! '});
    });
});


//Inicia o Servidor
app.listen(3000, () =>{
    console.log('API rodando em http://localhost:3000');
});