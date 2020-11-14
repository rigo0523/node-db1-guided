const express = require("express");
const db = require("../data/config");

const router = express.Router();

//CRUD WITH JSON MAURER

//GET /api/messages
router.get("/", async (req, res, next) => {
  try {
    //SELECT * FROM messages
    const messages = await db.select("*").from("messages");
    res.status(200).json({ data: messages });
  } catch (err) {
    next(err);
  }
});

//GET BY ID /api/messages/:id
router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    //SELECT * FROM messages WHERE id = ? limit 1 by destruction message inside[""]
    const [message] = await db
      .select("*")
      .from("messages")
      .where({ id })
      .limit(1);
    res.json({ data: message });
  } catch (err) {
    next(err);
  }
});

//POST /api/messages
router.post("/", async (req, res, next) => {
  const newPost = req.body;
  try {
    //SELECT * FROM messages
    // const message = await db
    //   .select("*")
    //   .from("messages")
    //   //other databases require returning("id") or you can add "id"
    //   //inside insert after newPost
    //   .insert(newPost, "id")
    //   .then((ids) => {
    //     db("messages")
    //       .where({ id: ids })
    //       .first()
    //       .then((post) => {
    //         res.json({ data: post });
    //       });
    //   });

    ///Destructuring method instead, much shorter
    const [id] = await db
      .insert({ title: req.body.title, contents: req.body.contents })
      .into("messages");

    const message = await db("messages").where({ id: id }).first();
    res.status(201).json({ data: message });
  } catch (err) {
    next(err);
  }
});

//UPDATE /api/messages/:id
router.put("/:id", async (req, res, next) => {
  const { id } = req.params;
  const title = req.body;
  const contents = req.body;
  try {
    //SELECT * FROM messages

    let messages = await db("messages")
      .update(title, contents)
      .where({ id: id })
      .then((ids) => {
        db("messages")
          .where({ id: ids })
          .first()
          .then((changes) => {
            res.status(200).json({ newUPDATE: changes });
          });
      });
  } catch (err) {
    next(err);
  }
});

//DELETE /api/messages/:id
router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    //SELECT * FROM messages
    let messages = await db("messages").where({ id }).del();

    res.status(204).json({ data: messages });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

// //CRUD with Luis Hernandez without ASYNC
// router.get("/", (req, res) => {
//   db("messages")
//     .then((message) => {
//       res.json(message);
//     })
//     .catch((err) => {
//       res.json({ message: "error" });
//     });
// });

// router.get("/:id", (req, res) => {
//   const { id } = req.params;
//   db("messages")
//     .where({ id: id })

//     .then((result) => {
//       res.json({ data: result });
//     })
//     .catch((erro) => {
//       res.json({ message: " can't find by ID" });
//     });
// });

// router.post("/", (req, res) => {
//   const newPost = req.body;
//   db("messages")
//     // OR .insert(newPost).returning("id").then().catch(); <<<works too
//     //Whenever you insert always pass a second argument
//     .insert(newPost, "id")
//     .then((ids) => {
//       db("messages")
//         .where({ id: ids })
//         .then((post) => {
//           res.json({ data: post });
//         })
//         .catch((err) => res.json({ message: "cant post" }));
//     })
//     .catch((err) => {
//       res.json(err);
//     });
// });

// router.put("/:id", (req, res, next) => {
//   const change = req.body;
//   const { id } = req.params;
//   db("messages")
//     .update(change)
//     .where({ id: id })
//     .then((ids) => {
//       db("messages")
//         .where({ id: ids })
//         .then((changes) => {
//           res.json({ data: changes });
//         })
//         .catch((err) => res.json({ message: "can't update ID ", id }));
//     })
//     .catch((err) => {
//       res.json({ message: "error posting" });
//     });
// });

// router.delete("/:id", (req, res, next) => {
//   const { id } = req.params;
//   db("messages")
//     .where({ id: id })
//     .del()
//     .then((deleted) => {
//       if (deleted > 0) {
//         res.json({ message: `Id of ${id} deleted`, data: deleted });
//       } else {
//         res.json({ message: `can't deleted by that id of ${id}` });
//       }
//     })

//     .catch((err) => res.json({ message: `ID of ${id} NOT FOUND` }));
// });

// module.exports = router
