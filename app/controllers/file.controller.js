var path = require('path');
var fs = require('fs');

const db = require("../models");
const File = db.file;

exports.upload = (req, res) => {
  let filedata = req.file;
  if (!filedata) {
    res.status(422).send("File missing!");
  }
  else {
    File.create({
      originalname: filedata.originalname,
      mimetype: filedata.mimetype,
      size: filedata.size,
      path: filedata.path
    })
      .then(file => {
        res.status(200).send({message: "File loaded successfully!"});
      })
      .catch(err => {
        res.status(500).send({message: err.message});
      });
  }
}

exports.download = (req, res) => {
  File.findOne({
    where: {
      id: req.params.id
    }
  })
    .then(file => {
      if (!file) {
        return res.status(404).send({message: "File Not found!"});
      }
      const _file = path.resolve(file.path);

      res.setHeader('Content-disposition', 'attachment; filename=' + file.originalname);
      res.setHeader('Content-type', file.mimetype);

      const filestream = fs.createReadStream(_file);
      filestream.pipe(res);
    }
    )
    .catch(err => {
      res.status(500).send({message: err.message})
    })
}

exports.info = (req, res) => {
  File.findOne({
    where: {
      id: req.params.id
    }
  })
    .then(file => {
      if (!file) {
        return res.status(404).send({message: "File Not found!"});
      }
      res.status(200).send(file);
    })
    .catch(err => {
      res.status(500).send({message: err.message})
    })
}

exports.delete = (req, res) => {

  File.findOne({
    where: {
      id: req.params.id
    }
  })
    .then(file => {
      if (!file) {
        return res.status(404).send({message: "File Not found!"});
      }
      File.destroy({
        where: {
          id: file.id
        }
      })
        .then(rowDeleted => {
          if (rowDeleted == 1) {
            const _file = path.resolve(file.path);
            fs.unlinkSync(_file);
            return res.status(200).send({message: `File deleted: ${file.originalname}`});
          }
        })
        .catch(err => {
          res.status(500).send({message: err.message})
        })
    })
    .catch(err => {
      res.status(500).send({message: err.message})
    })
}

exports.update = (req, res) => {
  let filedata = req.file;
  if (!filedata) {
    res.status(422).send("File missing!");
  }
  else {
    File.findOne({
      where: {
        id: req.params.id
      }
    })
      .then(file => {
        if (!file) {
          return res.status(404).send({message: "File Not found!"});
        }
        File.update({
          originalname: filedata.originalname,
          mimetype: filedata.mimetype,
          size: filedata.size,
          path: filedata.path,
          uploaddate: new Date()
        },
          {
            where: {
              id: file.id
            }
          })
          .then(rowsUpdated => {
            const _file = path.resolve(file.path);
            fs.unlinkSync(_file);
            res.status(200).send({message: "File updated successfully!"});
          })
          .catch(err => {
            res.status(500).send({message: err.message});
          });
      })
      .catch(err => {
        res.status(500).send({message: err.message})
      })
  }
}

exports.list = (req, res) => {

  const numPage = 1 * req.query.page;
  const numPageSize = 1 * req.query.list_size;

  const pageSize = (numPageSize && numPageSize > 0) ? numPageSize : 10;
  const page = (numPage && numPage > 0) ? numPage : 1;

  File.findAll({
    offset: (page - 1) * pageSize, limit: pageSize,
    order: [
      ['uploaddate', 'DESC']]
  })
    .then(function(result) {
      res.status(200).send(result)
    })
    .catch(err => {
      res.status(500).send({message: err.message})
    })
}