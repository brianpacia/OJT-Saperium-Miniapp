const repo = require('../repository/main.repository.js')

function validateUsername(string){
  let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return regex.test(string.toLowerCase())
}

function validateName(string){
  let regex = /^[a-zA-Z\-]+$/
  return regex.test(string)
}

const controller = {
  //Create user
  createUser: function(req,res){
    //check if there are no null fields
    if( !(req.body.firstName && req.body.lastName && req.body.username && req.body.password )){
      res.send('INCOMPLETE FIELDS')
      return false
    }else{
      //check if names are valid
      if(!(validateName(req.body.firstName) && validateName(req.body.lastName))){
        res.send('NAME MUST ONLY HAVE LETTERS or -')
      }



      // repo.createUser(req.body)
      // .then(function(data){
      //   //Insert into users table the new user
      //   res.send('USER ' + req.body.firstName + ' ' + req.body.lastName + ' CREATED')
      //   res.json(data)
      // }, 
      // //
      // function(error){
      //   res.send('USER CREATION FAILED')
      // })
    }
  },

  //Get user (for login)
  getUser: function(req,res){
    repo.getUser(req.body)
    .then(function(data){
      //check if the user can be retrieved (not empty array)
      if(data[0].length == 0){
        res.send('WRONG USERNAME OR PASSWORD')
      }
      else res.send(data[0])
    }) 
  },

  //Get all users
  getAllUsers: function(req,res){
    repo.getAllUsers().then(function (data){
      //check if the user can be retrieved (not empty array)
      if(data[0].length == 0){
        res.send('USERS DO NOT EXIST')
      }
      else res.send(data[0])
    })
  },

  //Creating a board
  createBoard: function(req,res){
    //create the board
    repo.createBoard(req.body)
    .then(function(data){
      //Insert into board table the new board
      res.send(req.body.title + ' BOARD CREATED')
    },
    function(error){
      console.log(error.message)
      res.send('BOARD CREATION FAILED')
    })
  },

  //Get a single board of a user
  getBoard: function(req,res){
    repo.getBoard(req.query.boardID).then(function (data){
      //check if tasks can be retrieved (not empty array)
      if(data[0].length == 0){
        res.send('BOARD DOES NOT EXIST')
      }
      else res.send(data[0])
    })
  },

  //Get all boards of a user
  getBoards: function(req,res){
    repo.getBoards(req.query.userID).then(function (data){
      //check if the user can be retrieved (not empty array)
      if(data[0].length == 0){
        res.send('BOARDS DO NOT EXIST')
      }
      else res.send(data[0])
    })
  },

  //Delete a board
  deleteBoard: function(req,res){
    repo.deleteBoard(req.body)
    .then(function(){
      res.send('BOARD DELETED')
    },
    function(error){
      res.send('BOARD DELETION FAILED')
    })
  },

  //Invite a member to board
  inviteBoard: function(req,res){
    repo.inviteBoard(req.body)
    .then(function(data){
      res.send('USER ' + req.body.userID + ' WAS INVITED TO ' + req.body.boardID + ' BOARD')
    },
    function(error){
      console.log(error.message)
      res.send('BOARD INVITATION FAILED')
    })
  },

  //Create a list
  createList: function(req,res){
    repo.createList(req.body.boardID,req.body.title)
    .then(function(data){
      //Insert into board table the new board
      res.send(req.body.title + ' LIST CREATED')
    },
    function(error){
      res.send('LIST CREATION FAILED')
    })
  },

  //Get a single list
  getList: function(req,res){
    repo.getList(req.query.listID).then(function (data){
      //check if tasks can be retrieved (not empty array)
      if(data[0].length == 0){
        res.send('LIST DOES NOT EXIST')
      }
      else res.send(data[0])
    })
  },

  //Get all lists of a board
  getLists: function(req,res){
    repo.getLists(req.query.boardID).then(function (data){
      //check if lists can be retrieved (not empty array)
      if(data[0].length == 0){
        res.send('LISTS DO NOT EXIST')
      }
      else res.send(data[0])
    })
  },

  //Create a task
  createTask: function(req,res){
    repo.createTask(req.body.listID,req.body)
    .then(function(data){
      //Insert into board table the new board
      res.send(req.body.title + ' TASK CREATED')
    },
    function(error){
      res.send('TASK CREATION FAILED')
    })
  },

  //Get a single task of a list
  getTask: function(req,res){
    repo.getTask(req.query.taskID).then(function (data){
      //check if tasks can be retrieved (not empty array)
      if(data[0].length == 0){
        res.send('TASK DOES NOT EXIST')
      }
      else res.send(data[0])
    })
  },

  //Get all tasks of a list
  getTasks: function(req,res){
    repo.getTasks(req.query.listID).then(function (data){
      //check if tasks can be retrieved (not empty array)
      if(data[0].length == 0){
        res.send('TASKS DO NOT EXIST')
      }
      else res.send(data[0])
    })
  },

  //Get a due date
  getDueDate: function(req,res){
    repo.getDueDate(req.query.id)
    .then(function(data){
      res.send('DUE DATE IS: ' + data[0][0].date)
    },
    function(error){
      res.send('DATE RETRIEVAL FAILED')
    })
  },

  //Add a member to a task
  addTaskMember: function(req,res){
    repo.addTaskMember(req.body.taskID,req.body.userID)
    .then(function(data){
      res.send(data[0][0].firstName + ' ' + data[0][0].lastName + ' WAS ADDED TO TASK ' + req.body.taskID)
    },
    function(error){
      res.send('ADDING FAILED')
    })
  },

  //Delete a member from a task
  delTaskMember: function(req,res){
    repo.delTaskMember(req.body.taskID,req.body.userID)
    .then(function(data){
      res.send('USER ' + req.body.userID + ' WAS DELETED FROM TASK ' + req.body.taskID)
    },
    function(error){
      res.send('DELETION FAILED')
    })
  },

  //Add a label to a task
  addLabel: function(req,res){
    repo.addLabel(req.body)
    .then(function(data){
      res.send(req.body.label + ' WAS ADDED TO TASK ' + req.body.taskID)
    },
    function(error){
      res.send('ADDING FAILED')
    })
  },

  //Get all labels of a task
  getLabels: function(req,res){
    repo.getLabels(req.query.taskID).then(function (data){
      //check if tasks can be retrieved (not empty array)
      if(data[0].length == 0){
        res.send('LABELS DO NOT EXIST')
      }
      else res.send(data[0])
    })
  },

  //Delete a label from a task
  delLabel: function(req,res){
    repo.delLabel(req.body.taskID,req.body.label)
    .then(function(data){
      res.send(req.body.label + ' WAS DELETED FROM TASK ' + req.body.taskID)
    },
    function(error){
      res.send('LABEL DELETION FAILED')
    })
  },

  //Update title of a label
  updateTaskTitle: function(req,res){
    repo.updateTaskTitle(req.params.id,req.body.title)
    .then(function(data){
      res.send('TASK ' + req.params.id + ' TITLE WAS UPDATED')
    },
    function(error){
      console.log(error.message)
      res.send('UPDATE FAILED')
    })
  },

  //Update description of a label
  updateDesc: function(req,res){
    repo.updateDesc(req.params.id,req.body.description)
    .then(function(data){
      res.send('TASK ' + req.params.id + ' DESCRIPTION WAS UPDATED')
    },
    function(error){
      console.log(error.message)
      res.send('UPDATE FAILED')
    })
  },

  //Update due date of a label
  updateDueDate: function(req,res){
    repo.updateDueDate(req.params.id,req.body.dueDate)
    .then(function(data){
      res.send('TASK ' + req.params.id + ' DUE DATE WAS UPDATED')
    },
    function(error){
      res.send('UPDATE FAILED')
    })
  },

  //Update list a task belongs to
  updateListOfTask: function(req,res){
    repo.updateListOfTask(req.params.id,req.body.listID)
    .then(function(){
      return repo.getList(req.body.listID)
    })
    .then(function(data){
      res.send('TASK ' + req.params.id + ' IS NOW IN THE LIST ' + data[0][0].title)
    },
    function(error){
      console.log(error.message)
      res.send('UPDATE FAILED')
    })
  }
}

module.exports = controller