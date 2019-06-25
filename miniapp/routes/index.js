var express = require('express');
var router = express.Router();
var controller = require('../controllers/main.controller')

//Get all users page
router.get('/users', controller.getAllUsers)

//Get a user page (login)
router.post('/login', controller.getUser)

//Create a user page
router.post('/register', controller.createUser)

//Create board page
router.post('/board/add', controller.createBoard)

//Get a board of a user
router.get('/board', controller.getBoard)

//Get all boards of a user
router.get('/board/all', controller.getBoards)

//Delete a board
router.post('/board/delete', controller.deleteBoard)

//Invite to board
router.post('/board/invite', controller.inviteBoard)

//Create list page
router.post('/list/add', controller.createList)

//Get a list
router.get('/list', controller.getList)

//Get all lists of a board
router.get('/list/all', controller.getLists)

//Create task page
router.post('/task/add', controller.createTask)

//Get a task
router.get('/task', controller.getTask)

//Get all tasks of a list
router.get('/task/all', controller.getTasks)

//Get the dueDate
router.get('/task/info/dueDate', controller.getDueDate)

//Add member to task
router.post('/task/member/add', controller.addTaskMember)

//Delete a member from a task
router.post('/task/member/delete', controller.delTaskMember)

//Add label to a task
router.post('/task/info/label/add', controller.addLabel)

//Get all labels of a task
router.get('/task/info/labels', controller.getLabels)

//Delete a label from a task
router.post('/task/info/label/delete', controller.delLabel)

//Update title of a task
router.put('/task/info/title/:id', controller.updateTaskTitle)

//Update description of a task
router.put('/task/info/desc/:id', controller.updateDesc)

//Update due date of a task
router.put('/task/info/dueDate/:id', controller.updateDueDate)

//Update list a task belongs to
router.put('/task/info/list/:id', controller.updateListOfTask)

module.exports = router;
