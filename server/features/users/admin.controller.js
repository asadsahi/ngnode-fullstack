let path = require('path'),
  DB = require('../../db/models'),
  User = DB.User,
  Role = DB.Role,
  UserImage = DB.UserImage,
  errorHandler = require('../core/errorHandler');

/**
 * List of Users
 */
exports.list = (req, res) => {
  User
    .findAll({
      attributes: ['firstName', 'lastName', 'username', 'email', 'updatedAt'],
      include: [
        { model: Role, attributes: ['id', 'name'] },
        { model: UserImage, attributes: ['id'] }
      ],
      order: ['updatedAt'],
    })
    .then(users => res.json(users))
    .catch(err => res.status(400).send(errorHandler.formatMessage(err)));
};

/**
 * Show the current user
 */
exports.read = (req, res) => {
  res.json(req.model);
};

/**
 * Update a User
 */
exports.update = (req, res) => {
  let user = req.model;

  // For security purposes only merge these parameters

  user.update({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    roles: req.body.roles,
    roleNames: req.body.roleNames
  }, {
      where: {
        id: req.user.id
      }
    })
    .then(user => res.json(user))
    .catch(err => res.status(400).send(errorHandler.formatMessage(err)));
};

/**
 * Delete a user
 */
exports.delete = (req, res) => {
  let user = req.model;

  user.destroy()
    .then(u => res.json(u))
    .catch(err => res.status(400).send(errorHandler.formatMessage(err)));
};

/**
 * User middleware
 */
// exports.userByID = (req, res, next, id) => {
//   if (!+id) {
//     return res.status(400).send('User is invalid');
//   }

//   User.findById(id, '-salt -password -providerData').exec((err, user) => {
//     if (err) {
//       return next(err);
//     } else if (!user) {
//       return next(new Error('Failed to load user ' + id));
//     }

//     req.model = user;
//     next();
//   });
// };
