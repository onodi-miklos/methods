let db;

const { connectToDb, getDb } = require("../db.cjs");
const { ObjectId } = require("mongodb");

connectToDb((err) => {
  if (!err) {
    db = getDb();
  }
});

const getBooks = (req, res) => {
  // current page
  const page = req.query.p || 0;
  const booksPerPage = 2;

  let books = [];

  db.collection("books")
    .find()
    .sort({ author: 1 })
    .skip(page * booksPerPage)
    .limit(booksPerPage)
    .forEach((book) => books.push(book))
    .then(() => {
      return res.status(200).json(books);
    })
    .catch(() => {
      return res.status(500).json({ error: "Could not fetch the documents" });
    });
};

const getBook = (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    db.collection("books")
      .findOne({ _id: new ObjectId(req.params.id) })
      .then((doc) => {
        return res.status(200).json({ doc });
      })
      .catch((err) => {
        return res.status(500).json({ error: "Could not fetch the document" });
      });
  } else {
    return res.status(500).json({ error: "Not valid doc id" });
  }
};

const addBook = (req, res) => {
  const book = req.body;

  db.collection("books")
    .insertOne(book)
    .then((result) => {
      return res.status(201).json(result);
    })
    .catch((err) => {
      return res.status(500).json({ err: "Could not create a new document" });
    });
};

const deleteBook = (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    db.collection("books")
      .deleteOne({ _id: new ObjectId(req.params.id) })
      .then((result) => {
        return res.status(200).json(result);
      })
      .catch((err) => {
        return res.status(500).json({ error: "Could not delete the document" });
      });
  } else {
    return res.status(500).json({ error: "Not a valid doc id" });
  }
};

const patchBook = (req, res) => {
  const updates = req.body;

  if (ObjectId.isValid(req.params.id)) {
    db.collection("books")
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: updates })
      .then((result) => {
        return res.status(200).json(result);
      })
      .catch((err) => {
        return res.status(500).json({ error: "Could not update the document" });
      });
  } else {
    return res.status(500).json({ eror: "Not a valid doc id" });
  }
};

module.exports = { getBooks, getBook, addBook, deleteBook, patchBook };
