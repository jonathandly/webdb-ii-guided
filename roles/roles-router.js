const router = require('express').Router();
const knex = require('knex');

const knexConfig = {
  client: 'sqlite3',
  connection: {   
    // string or object
    filename: './data/rolex.db3'
  },
  useNullAsDefault: true
};
const db = knex(knexConfig);

router.get('/', (req, res) => {
  // select * from roles
  db('roles')
  .then(roles => {
    res.status(200).json(roles);
  })
  .catch(err => {
    console.log(err);
  });
  // get the roles from the database
  // res.send('Write code to retrieve all roles');
});

// select * from roles where id = :id;
router.get('/:id', (req, res) => {
  // retrieve a role by id
  db('roles')
    .where({ id: req.params.id })
    .first()
    .then(role => {
      if(role) {
        res.status(200).json(role);
      } else {
        res.status(404).json({ message: 'Role not found' });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.post('/', (req, res) => {
  // insert into roles () values (req.body)
  db('roles')
    .insert(req.body, 'id')
    .then(results => {
      return db('roles')
      .where({ id: results[0] })
      .first()
      .then(role => {
        res.status(200).json(role);
      })
      .catch(err => {
        res.status(500).json(err);
      })
    .catch(err => {
      res.status(500).json(err);
    })
  });
});

router.put('/:id', (req, res) => {
  // update roles
  db('roles')
    .where({ id: req.params.id })
    .update(req.body)
    .then(count => {
      if(count > 0) { 
        res.status(200).json({ message: `${count} ${count > 1 ? 'records' : 'record'} records updated` });
      } else {
        res.status(404).json({ message: 'Role does not exist' });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.delete('/:id', (req, res) => {
  // remove roles (inactivate the role)
  db('roles')
    .where({ id: req.params.id })
    .del()
    .then(count => {
      if(count > 0) { 
        res.status(200).json({ message: `${count} ${count > 1 ? 'records' : 'record'} deleted` });
      } else {
        res.status(404).json({ message: 'Role does not exist' });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

module.exports = router;
