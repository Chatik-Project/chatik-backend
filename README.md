### Routes (реализацию см. router.js)
- get('/api/getalluser') - получить список всех зарегистрированных пользователей
- get('/api/getallmsg') - получить список всех сообщений
- post('/login') - два поля (email, password)
- post('/register') - три поля (email, username, password) 
- post('/logout')

### Socket .io 
#### (реализацию на стороне сервера см. sockets.js, 
#### реализацию на стороне клиента см. /public/js/auth.js, 
#### со стороны клиента отправлять через socket.emit)
- ('receiveHistory') - получить последние 10 сообщений
- ('changeName', name) - изменить имя
- ('msg', content) - отправить сообщение