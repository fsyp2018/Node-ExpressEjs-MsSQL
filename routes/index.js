var express = require('express');
var router = express.Router();
var db = require('../config/db')
var sql = require('mssql')

/* GET home page. */
router.get('/', function(req, res, next) {
  sql.connect(db, function (err) {
    if (err) {
      console.log(err)
    }
    var requset = new sql.Request();
    requset.query("SELECT * FROM UserList order by id", function (err, result) {
      if (err) {
        console.log(err)
        res.send(err)
      }
      sql.close();
      // res.send(result)
      res.render('index', { data: result.recordset });
    })
  })
});

router.get('/edit/:id', function (req, res, next) {
  sql.connect(db, function (err) {
    if (err) {
      console.log(err)
    }
    var requset = new sql.Request();
    requset.input('id', sql.Int, req.params.id)
    requset.query("SELECT * FROM UserList where id = @id", function (err, result) {
      if (err) {
        console.log(err)
        res.send(err)
      }
      sql.close();
      res.render('edit', { data: result.recordset[0] });
    })
  })
})

router.post('/update', function (req, res, next) {

  sql.connect(db, function (err) {
    if (err)
      console.log(err);

    var request = new sql.Request();
    request.input('id', sql.Int, req.body.id)
      .input('username', sql.NVarChar(50), req.body.username)
      .input('pwd', sql.NVarChar(50), req.body.pwd)
      .input('email', sql.NVarChar(50), req.body.email)
      .query('update UserList set username=@username,pwd=@pwd,email=@email where id=@id', function (err, result) {

        if (err) {
          console.log(err);
          res.send(err);
        }
        sql.close();
        res.redirect('/');
      });
  });
});

router.get('/add', function (req, res, next) {
  res.render('add', {
    route: 'add',
  });
});

router.post('/add', function (req, res, next) {

  sql.connect(db, function (err) {
    if (err)
      console.log(err);

    var request = new sql.Request();
    request.input('userid', sql.NVarChar(50), req.body.userid)
      .input('pwd', sql.NVarChar(50), req.body.pwd)
      .input('username', sql.NVarChar(50), req.body.username)
      .input('email', sql.NVarChar(50), req.body.email)
      .query('insert into UserList (userid, pwd, username, email) values (@userid, @pwd, @username, @email)', function (err, result) {

        if (err) {
          console.log(err);
          res.send(err);
        }
        sql.close();
        res.redirect('/');
      });
  });
});

router.get('/delete/:id', function (req, res, next) {  
  sql.connect(db, function (err) {
    if (err)
      console.log(err);

    var request = new sql.Request();
    request.input('id', sql.Int, req.params.id)
      .query('delete from UserList where id=@id', function (err, result) {

        if (err) {
          console.log(err);
          res.send(err);
        }
        sql.close();
        res.redirect('/');
      });
  });
});

module.exports = router;
