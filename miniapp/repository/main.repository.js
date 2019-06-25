var knex = require('knex')({
  client: 'mysql',
  connection: {
    host : 'localhost',
    user : 'root',
    password : 'root',
    database : 'miniapp'
  }
});

module.exports = {
  //CREATE USER
  createUser: function(data) {
    return knex.raw('INSERT INTO users(userID,username,password,firstName,lastName) VALUES(null,?,?,?,?)',
    [data.username,data.password,data.firstName,data.lastName])
  },

  //GET USER (LOGIN)
  getUser: function(data){
    return knex.raw('SELECT * FROM users WHERE username = ? AND password = ?',[data.username,data.password])
  },

  //GET ALL USERS
  getAllUsers: function(){
    return knex.raw('SELECT * FROM users')
  },

  //CREATE A BOARD
  createBoard: function(data){
    return knex.raw('INSERT INTO boards(boardID,ownerID,name) VALUES(null,?,?)',[data.ownerID,data.title])
      .then( function(){
        return knex.raw('INSERT INTO boardAccess(boardID,userID) SELECT boardID, ownerID FROM boards WHERE ownerID = ? AND name = ?', 
        [data.ownerID,data.title])
      })
  },

  //GET A BOARD
  getBoard: function(boardID){
    return knex.raw('SELECT * FROM boards WHERE boardID = ?', [boardID])
  },

  //GET ALL BOARDS OF A USER
  getBoards: function(userID){
    return knex.raw('SELECT * FROM boards WHERE ownerID = ?', [userID])
  },

  //INVITE TO BOARD
  inviteBoard: function(data){
    return knex.raw('INSERT INTO boardAccess(boardID,userID) VALUES(?,?)', 
    [data.boardID,data.userID])
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

  //CREATE A TASK
  createTask: function(listID,data){
    //Parse date into miliseconds
    let date = Date.parse(data.dueDate)
    return knex.raw('INSERT INTO tasks(taskID,listID,title,description,dueDate) VALUES(null,?,?,?,?)',
    [listID,data.title,data.description,date])
  },

  //GET A TASK OF A LIST
  getTask: function(taskID){
    return knex.raw('SELECT * FROM tasks WHERE taskID = ?', [taskID])
  },

  //GET ALL TASKS OF A LIST
  getTasks: function(listID){
    return knex.raw('SELECT * FROM tasks WHERE listID = ?', [listID])
  },

  //GET THE DUE DATE
  getDueDate: function(taskID){
    return knex.raw('SELECT FROM_UNIXTIME(SUBSTR(dueDate,1,10), "%M %d %Y") AS "date" FROM tasks WHERE taskID = ?',[taskID])
  },

  //ADD MEMBER TO TASK
  addTaskMember: function(taskID,userID){
    return knex.raw('INSERT INTO taskMembers(cmID,taskID,userID) VALUES(null,?,?)',[taskID,userID])
    .then( function() {
      return knex.raw('SELECT * FROM users WHERE userID = ?', [userID])
    })
    .catch(function(error){
      console.log(error.message)
    })
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
  },

  //UPDATE DESCRIPTION OF A TASK  
  updateDesc: function(id,desc){
    return knex.raw('UPDATE tasks SET description = ? WHERE taskID = ?',[desc,id])
  },

  //UPDATE DUE DATE OF A TASK  
  updateDueDate: function(id,dueDate){
    let date = Date.parse(dueDate)
    return knex.raw('UPDATE tasks SET dueDate = ? WHERE taskID = ?',[date,id])
  },

  //UPDATE LIST A TASK BELONGS TO 
  updateListOfTask: function(taskID,listID){
    return knex.raw('UPDATE tasks SET listID = ? WHERE taskID = ?',[listID,taskID])
  }
}