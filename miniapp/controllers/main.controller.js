const repo = require('../repository/main.repository.js')

// 

function validateName(string){
  let regex = /^[a-zA-Z\-]+$/
  return regex.test(string)
}

const controller = {
  //Create user
  createUser: function(req,res){
    //check if there are no null fields
    if( !(req.body.firstName && req.body.lastName && req.body.username && req.body.password )){
      res.status(400).send({message:'INCOMPLETE FIELDS'})
      return false
    }else{
      //check if names are valid
      if(!(validateName(req.body.firstName) && validateName(req.body.lastName))){
        res.status(400).send({message:'NAME MUST ONLY HAVE LETTERS or -'})
        return false
      }
      //validate username

      repo.createUserRedis(req.body)
      .then(function(data){
        console.log(data)
        //Insert into users table the new user
        res.status(200).send({message:'USER ' + req.body.firstName + ' ' + req.body.lastName + ' CREATED'})
        //res.json(data)
      }).catch(function(err){
        res.status(500).send({ error: { statusCode: 500, message: err.message, errorCode: '1400'} })
      })
    }
  },

  //Get user (for login)
  getUser: function(req,res){
    repo.getUserRedis(req.body)
    .then(function(data){
      console.log(data)
      if(data.password == req.body.password){
        res.status(200).send(data)
      }else throw new Error('WRONG USERNAME OR PASSWORD')
      //check if the user can be retrieved (not empty array)
      // if(data[0].length == 0){
      //   throw new Error('WRONG USERNAME OR PASSWORD')
      // }
      // else res.status(200).send(data[0])
    }).catch(function(err){
      res.status(403).send({ error: { statusCode: 403, message: err.message, errorCode: '1400'} })
    })
  },

  //Get all users
  getAllUsers: function(req,res){
    repo.getAllUsers().then(function (data){
      //check if the user can be retrieved (not empty array)
      if(data[0].length == 0){
        throw new Error('USERS DO NOT EXIST')
      }
      else res.send(data[0])
    }).catch(function(err){
      res.send({ error: { statusCode: 403, message: err.message, errorCode: '1400'} })
    })
  },

  //Creating a board
  createBoard: function(req,res){
    //create the board
    repo.createBoard(req.body)
    .then(function(data){
      //Insert into board table the new board
      res.status(200).send({success:req.body.name + ' BOARD CREATED', data: data})
    },
    function(error){
      res.status(403).send({ error: { statusCode: 403, message: error.message, errorCode: '1400'} })
    })
  },

  //Get a single board of a user
  getBoard: function(req,res){
    repo.getBoard(req.query.boardID).then(function (data){
      //check if tasks can be retrieved (not empty array)
      if(data[0].length == 0){
        throw new Error('BOARD DOES NOT EXIST')
      }
      else res.send(data[0])
    }).catch(function(err){
      res.send({ error: { statusCode: 403, message: err.message, errorCode: '1400'} })
    })
  },

  //Get all boards of a user
  getBoards: function(req,res){
    repo.getBoards(req.query.userID).then(function (data){
      //check if the user can be retrieved (not empty array)
      if(data[0].length == 0){
        throw new Error('BOARDS DO NOT EXIST')
      }
      else res.send(data[0])
    }).catch(function(err){
      res.send({ error: { statusCode: 403, message: err.message, errorCode: '1400'} })
    })
  },

  //Delete a board
  deleteBoard: function(req,res){
    repo.deleteBoard(req.body)
    .then(function(msg){
      res.send({message:'BOARD DELETED'})
    },
    function(error){
      res.send({error:'BOARD DELETION FAILED'})
    })
  },

  //Invite a member to board
  inviteBoard: function(req,res){
    repo.inviteBoard(req.body)
    .then(function(data){
      res.send({success:'USER ' + req.body.userID + ' WAS INVITED TO ' + req.body.boardID + ' BOARD'})
    },
    function(error){
      res.send({ error: { statusCode: 403, message: 'BOARD INVITATION FAILED', errorCode: '1400'} })
    })
  },

  getBoardMembers: function(req,res){
    repo.getBoardMembers(req.query.boardID)
    .then(function (data){
      //check if users can be retrieved (not empty array)
      if(data[0].length == 0){
        throw new Error('MEMBERS DO NOT EXIST')
      }
      else res.send(data[0])
    }).catch(function(err){
      res.send({ error: { statusCode: 403, message: err.message, errorCode: '1400'} })
    })
  },

  //Create a list
  createList: function(req,res){
    repo.createList(req.body.boardID,req.body.title)
    .then(function(data){
      //Insert into board table the new board
      res.status(200).send({success: req.body.title + ' LIST CREATED'})
    },
    function(error){
      res.status(403).send({ error: { statusCode: 403, message: 'LIST CREATION FAILED', errorCode: '1400'} })
    })
  },

  //Get a single list
  getList: function(req,res){
    repo.getList(req.query.listID).then(function (data){
      //check if tasks can be retrieved (not empty array)
      if(data[0].length == 0){
        throw new Error('LIST DOES NOT EXIST')
      }
      else res.send(data[0])
    }).catch(function(err){
      res.send({ error: { statusCode: 403, message: err.message, errorCode: '1400'} })
    })
  },

  //Get all lists of a board
  getLists: function(req,res){
    repo.getLists(req.query.boardID).then(function (data){
      //check if lists can be retrieved (not empty array)
      if(data[0].length == 0){
        throw new Error('LISTS DO NOT EXIST')
      }
      else res.send(data[0])
    }).catch(function(err){
      res.send({ error: { statusCode: 403, message: err.message, errorCode: '1400'} })
    })
  },

  //Delete a task
  deleteList: function(req,res){
    repo.deleteList(req.body)
    .then(function(msg){
      res.send({message:'LIST DELETED'})
    },
    function(error){
      res.send({error:'LIST DELETION FAILED'})
    })
  },

  //Create a task
  createTask: function(req,res){
    repo.createTaskRedis(req.body.listID,req.body)
    .then(function(data){
      //Insert into board table the new board
      res.status(200).send({success: req.body.title + ' TASK CREATED'})
    },
    function(error){
      res.status(403).send({ error: { statusCode: 403, message: error.message, errorCode: '1400'} })
    })
  },

  //Get a single task of a list
  getTask: function(req,res){
    repo.getTask(req.query.taskID).then(function (data){
      //check if tasks can be retrieved (not empty array)
      if(data[0].length == 0){
        throw new Error('TASK DOES NOT EXIST')
      }
      else res.send(data[0])
    }).catch(function(err){
      res.send({ error: { statusCode: 403, message: err.message, errorCode: '1400'} })
    })
  },

  //Get all tasks of a list
  getTasks: function(req,res){
    repo.getTasks(req.query.listID).then(function (data){
      //check if tasks can be retrieved (not empty array)
      if(data[0].length == 0){
        throw new Error('TASKS DO NOT EXIST')
      }
      else res.send(data[0])
    }).catch(function(err){
      res.send({ error: { statusCode: 403, message: err.message, errorCode: '1400'} })
    })
  },

  //Get a single board of a user
  getTaskMembers: function(req,res){
    repo.getTaskMembers(req.query.taskID).then(function (data){
      //check if members can be retrieved (not empty array)
      if(data[0].length == 0){
        throw new Error('MEMBERS DO NOT EXIST')
      }
      else res.send(data[0])
    }).catch(function(err){
      res.send({ error: { statusCode: 403, message: err.message, errorCode: '1400'} })
    })
  },

  //Delete a task
  deleteTask: function(req,res){
    repo.deleteTaskRedis(req.body)
    .then(function(msg){
      res.send({message:'TASK DELETED'})
    },
    function(error){
      res.send({error: { statusCode: 403, message: error.message, errorCode: '1400'} })
    })
  },

  //Get a due date
  getDueDate: function(req,res){
    repo.getDueDateRedis(req.query.taskID)
    .then(function(data){
      console.log(data)
      let options = { year: 'numeric', month: 'long', day: 'numeric' };
      let date  = new Date((+data.substr(0,10))*1000);
      let dueDate = date.toLocaleDateString("en-US",options);
      res.send({message: "success", "dueDate": dueDate})
    },
    function(error){
      res.send({ error: { statusCode: 403, message: error.message, errorCode: '1400'} })
    })
  },

  //Add a member to a task
  addTaskMember: function(req,res){
    repo.addTaskMember(req.body.taskID,req.body.userID)
    .then(function(data){
      res.send({success: 'member added'})
    },
    function(error){
      console.log(error)
      res.send({ error: { statusCode: 403, message: error.message, errorCode: '1400'} })
    })
  },

  //Delete a member from a task
  delTaskMember: function(req,res){
    repo.delTaskMember(req.body.taskID,req.body.userID)
    .then(function(data){
      res.send({success:'USER ' + req.body.userID + ' WAS DELETED FROM TASK ' + req.body.taskID})
    },
    function(error){
      res.send({ error: { statusCode: 403, message: 'DELETION FAILED', errorCode: '1400'} })
    })
  },

  //Add a label to a task
  addLabel: function(req,res){
    repo.addLabel(req.body)
    .then(function(data){
      res.send({success:req.body.label + ' WAS ADDED TO TASK ' + req.body.taskID})
    },
    function(error){
      res.send({ error: { statusCode: 403, message: 'ADDING FAILED', errorCode: '1400'} })
    })
  },

  //Get all labels of a task
  getLabels: function(req,res){
    repo.getLabels(req.query.taskID).then(function (data){
      //check if tasks can be retrieved (not empty array)
      if(data[0].length == 0){
        throw new Error('LABELS DO NOT EXIST')
      }
      else res.send(data[0])
    }).catch(function(err){
      res.send({ error: { statusCode: 403, message: err.message, errorCode: '1400'} })
    })
  },

  //Delete a label from a task
  delLabel: function(req,res){
    repo.delLabel(req.body.taskID,req.body.label)
    .then(function(data){
      res.send({success:req.body.label + ' WAS DELETED FROM TASK ' + req.body.taskID})
    },
    function(error){
      res.send({ error: { statusCode: 403, message: 'LABEL DELETION FAILED', errorCode: '1400'} })
    })
  },

  //Update title of a label
  updateTaskTitle: function(req,res){
    repo.updateTaskTitle(req.params.id,req.body.title)
    .then(function(data){
      res.send({success:'TASK ' + req.params.id + ' TITLE WAS UPDATED'})
    },
    function(error){
      res.send({ error: { statusCode: 403, message: 'UPDATE FAILED', errorCode: '1400'} })
    })
  },

  //Update description of a label
  updateDesc: function(req,res){
    repo.updateDesc(req.params.id,req.body.description)
    .then(function(data){
      res.send({success:'TASK ' + req.params.id + ' DESCRIPTION WAS UPDATED'})
    },
    function(error){
      res.send({ error: { statusCode: 403, message: 'UPDATE FAILED', errorCode: '1400'} })
    })
  },

  //Update due date of a label
  updateDueDate: function(req,res){
    repo.updateDueDate(req.params.id,req.body.dueDate)
    .then(function(data){
      res.send({success: 'TASK ' + req.params.id + ' DUE DATE WAS UPDATED'})
    },
    function(error){
      res.send({ error: { statusCode: 403, message: 'UPDATE FAILED', errorCode: '1400'} })
    })
  },

  //Update list a task belongs to
  updateListOfTask: function(req,res){
    repo.updateListOfTask(req.params.id,req.body.listID)
    .then(function(){
      return repo.getList(req.body.listID)
    })
    .then(function(data){
      res.send({success: 'TASK ' + req.params.id + ' IS NOW IN THE LIST ' + data[0][0].title})
    },
    function(error){
      res.send({ error: { statusCode: 403, message: 'UPDATE FAILED', errorCode: '1400'} })
    })
  },

  //Get last insert ID
  getLastInsert: function(req,res){
    repo.getLastInsert()
    .then(function(data){
      res.send(data[0])
    },
    function(error){
      res.send({ error: { statusCode: 403, message: 'LABEL DELETION FAILED', errorCode: '1400'} })
    })
  }
}

module.exports = controller