var knex = require('knex')({
  client: 'mysql',
  connection: {
    host : 'localhost',
    user : 'root',
    password : 'root',
    database : 'miniapp'
  }
});

//redis component
var Redis = require('ioredis');
var redis = new Redis()

module.exports = {
  //CREATE USER
  createUser: function(data) {
    return knex.raw('INSERT INTO users(userID,username,password,firstName,lastName) VALUES(null,?,?,?,?)',
    [data.username,data.password,data.firstName,data.lastName])
  },

  createUserRedis: function(data){
    return knex.raw('INSERT INTO users(userID,username,password,firstName,lastName) VALUES(null,?,?,?,?)',
    [data.username,data.password,data.firstName,data.lastName])
    .then((res) => {
      return redis.hmset(`user:${res[0].insertId}`,{
        'userID': res[0].insertId,
        'firstName' : data.firstName,
        'lastName' : data.lastName,
        'username' : data.username,
        'password' : data.password
      }).then((res1) => {
        console.log(res[0].insertId)
        return redis.set(`user:${data.username}`,res[0].insertId)
      })
    })
  },

  //GET USER (LOGIN)
  getUser: function(data){
    return knex.raw('SELECT * FROM users WHERE username = ? AND password = ?',[data.username,data.password])
    .then(null,function(error){
      console.log(error.message)
    })
  },

  getUserRedis: function(data){
    return redis.get(`user:${data.username}`)
    .then((res) => {
      return redis.hgetall(`user:${res}`)
    })
  },

  //GET ALL USERS
  getAllUsers: function(){
    return knex.raw('SELECT userID, firstName, lastName, username FROM users')
  },

  //CREATE A BOARD
  createBoard: function(data){
    let data2;
    return knex.raw('INSERT INTO boards(boardID,ownerID,name) VALUES(null,?,?)',[data.ownerID,data.name])
    .then( function(){
      return knex.raw('SELECT LAST_INSERT_ID() AS id;')
    }).then( function(data3){
        data2 = data3;
        return knex.raw('INSERT INTO boardAccess(boardID,userID) SELECT boardID, ownerID FROM boards WHERE ownerID = ? AND name = ?', 
        [data.ownerID,data.name])
      }).then(function(){
        return data2;
      })
  },

  //GET A BOARD
  getBoard: function(boardID){
    return knex.raw('SELECT * FROM boards WHERE boardID = ?', [boardID])
  },

  //GET ALL BOARDS OF A USER
  getBoards: function(userID){
    return knex.raw('SELECT b.boardID, b.name FROM boards b, boardAccess ba where b.boardID = ba.boardID AND ba.userID = ?', [userID])
  },

  //INVITE TO BOARD
  inviteBoard: function(data){
    return knex.raw('INSERT INTO boardAccess(boardID,userID) VALUES(?,?)', 
    [data.boardID,data.userID])
  },

  getBoardMembers: function(boardID){
    return knex.raw('SELECT u.userID, u.username, u.firstname, u.lastname FROM users u, boardAccess ba WHERE u.userID = ba.userID AND ba.boardID = ?',[boardID])
  },

  //DELETE A BOARD
  deleteBoard: function(data){
    return knex.raw('DELETE FROM boards WHERE boardID = ?', [data.boardID])
  },

  //CREATE A LIST
  createList: function(boardID,title){
    return knex.raw('INSERT INTO lists(listID,boardID,title) VALUES(null,?,?)',
    [boardID,title])
  },

  //GET A LIST
  getList: function(listID){
    return knex.raw('SELECT * FROM lists WHERE listID = ?', [listID])
  },

  //GET ALL LISTS OF A BOARD
  getLists: function(boardID){
    return knex.raw('SELECT * FROM lists WHERE boardID = ?', [boardID])
  },

  //DELETE A LIST
  deleteList: function(data){
    return knex.raw('DELETE FROM lists WHERE listID = ?', [data.listID])
  },

  //CREATE A TASK
  createTask: function(listID,data){
    //Parse date into miliseconds
    let date = Date.parse(data.dueDate)
    return knex.raw('INSERT INTO tasks(taskID,listID,title,description,dueDate) VALUES(null,?,?,?,?)',
    [listID,data.title,data.description,date])
  },

  createTaskRedis: function(listID,data){
    //Parse date into miliseconds
    let date = Date.parse(data.dueDate)
    return knex.raw('INSERT INTO tasks(taskID,listID,title,description,dueDate) VALUES(null,?,?,?,?)',
    [listID,data.title,data.description,date])
    .then((res) => {
      return redis.hmset(`task:${res[0].insertId}`,{
        'listID': listID,
        'title': data.title,
        'description': data.description,
        'dueDate': date
      })
    })
  },

  //GET A TASK OF A LIST
  getTask: function(taskID){
    return knex.raw('SELECT * FROM tasks WHERE taskID = ?', [taskID])
  },

  //GET ALL TASKS OF A LIST
  getTasks: function(listID){
    return knex.raw('SELECT * FROM tasks WHERE listID = ?', [listID])
  },

  //GET TASK MEMBERS
  getTaskMembers: function(taskID){
    return knex.raw('SELECT u.userID, u.username, u.firstname, u.lastname FROM users u, taskMembers tm WHERE u.userID = tm.userID AND tm.taskID = ?',[taskID])
  },

  //DELETE A TASK
  deleteTask: function(data){
    return knex.raw('DELETE FROM tasks WHERE taskID = ?', [data.taskID])
  },

  deleteTaskRedis: function(data){
    return knex.raw('DELETE FROM tasks WHERE taskID = ?', [data.taskID])
    .then((res) => {
      return redis.del(`task:${data.taskID}`);
    })
  },

  //GET THE DUE DATE
  getDueDate: function(taskID){
    return knex.raw('SELECT FROM_UNIXTIME(SUBSTR(dueDate,1,10), "%M %d %Y") AS "date" FROM tasks WHERE taskID = ?',[taskID])
  },

  getDueDateRedis: function(taskID){
    return redis.hget(`task:${taskID}`, 'dueDate')
  },

  //ADD MEMBER TO TASK
  addTaskMember: function(taskID,userID){
    return knex.raw('SELECT * from boardAccess WHERE userID = ? AND boardID = (SELECT b.boardID FROM boards b,lists l,tasks t WHERE t.taskID = ? AND t.listID = l.listID AND l.boardID = b.boardID)',[userID,taskID])
    .then(function(data){
      console.log(data)
      if(data[0].length == 0) return Promise.reject('User does not have access to the board')
      else return knex.raw('INSERT INTO taskMembers(cmID,taskID,userID) VALUES(null,?,?)',[taskID,userID])})
  },

  //DELETE MEMBER FROM TASK
  delTaskMember: function(taskID,userID){
    return knex.raw('DELETE FROM taskMembers WHERE taskID = ? AND userID = ?', [taskID,userID])
  },

  //ADD A LABEL TO A TASK
  addLabel: function(data){
    return knex.raw('INSERT INTO labels(labelID,taskID,label) VALUES(null,?,?)',
    [data.taskID,data.label])
  },

  //GET ALL LABELS OF A TASK
  getLabels: function(taskID){
    return knex.raw('SELECT * FROM labels WHERE taskID = ?', [taskID])
  },

  //DELETE LABEL FROM TASK
  delLabel: function(id,label){
    return knex.raw('DELETE FROM labels WHERE taskID = ? AND label = ?', [id,label])
  },

  //UPDATE LABEL OF A TASK  
  updateLabel: function(data){
    return knex.raw('UPDATE labels SET label = ? WHERE taskID = ?',[data.label,data.taskID])
  },

  //UPDATE TITLE OF A TASK  
  updateTaskTitle: function(id,title){
    return knex.raw('UPDATE tasks SET title = ? WHERE taskID = ?',[title,id])
    .then((res) => {
      return redis.hset(`task:${id}`,'title',title)
    })
  },

  //UPDATE DESCRIPTION OF A TASK  
  updateDesc: function(id,desc){
    return knex.raw('UPDATE tasks SET description = ? WHERE taskID = ?',[desc,id])
    .then((res) => {
      return redis.hset(`task:${id}`,'description',desc)
    })
  },

  //UPDATE DUE DATE OF A TASK  
  updateDueDate: function(id,dueDate){
    let date = Date.parse(dueDate)
    return knex.raw('UPDATE tasks SET dueDate = ? WHERE taskID = ?',[date,id])
    .then((res) => {
      return redis.hset(`task:${id}`,'dueDate',date)
    })
  },

  //UPDATE LIST A TASK BELONGS TO 
  updateListOfTask: function(taskID,listID){
    return knex.raw('UPDATE tasks SET listID = ? WHERE taskID = ?',[listID,taskID])
    .then((res) => {
      return redis.hset(`task:${taskID}`,'listID',listID)
    })
  },

  //Get last inserted ID
  getLastInsert: function(){
    return knex.raw('SELECT LAST_INSERT_ID() AS id')
  }
}