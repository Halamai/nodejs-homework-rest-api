const express = require("express");
const router = express.Router();
const functions = require("../model/contacts");
// const functions = require("../model/contacts.js");
const { validation } = require("../middleware/walidation");
const authValidation = require("../middleware/auth");

router.get("/", authValidation, async (req, res, next) => {
  const { _id } = req.user;
  try {
    const data = await functions.listContacts(_id);
    res.json({
      status: "success",
      code: 200,
      data: data,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", authValidation, async (req, res, next) => {
  const { contactId } = req.params;
  const { _id } = req.user;
  try {
    const data = await functions.getContactById(contactId, _id);
    if (!data) {
      const error = new Error("Not found");
      error.status = 404;
      throw error;
    }
    res.json({
      status: "success",
      code: 200,
      data: data,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/", validation, authValidation, async (req, res, next) => {
  console.log(req);
  const { _id } = req.user;
  try {
    const data = await functions.addContact({ ...req.body, owner: _id });
    res.status(201).json({
      status: "success",
      code: 201,
      data: data,
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", authValidation, async (req, res, next) => {
  const { contactId } = req.params;
  const { _id } = req.user;
  try {
    const data = await functions.removeContact(contactId, _id);
    if (!data) {
      const error = new Error("Not found");
      error.status = 404;
      throw error;
    }
    res.json({
      status: "success",
      code: 200,
      message: "contact deleted",
      data: data,
    });
  } catch (error) {
    next(error);
  }
});

router.put("/:contactId", validation, async (req, res, next) => {
  const { contactId } = req.params;
  // const { name, email, phone } = req.body;
  const { _id } = req.user;
  try {
    const data = await functions.updateContact(contactId, req.body, _id);
    // if (!name || !email || !phone) {
    //   const error = new Error("missing fields");
    //   error.status = 400;
    //   throw error;
    // }
    if (!data) {
      const error = new Error("Not found");
      error.status = 404;
      throw error;
    }
    res.status(200).json({
      status: "success",
      code: 201,
      data: data,
    });
  } catch (error) {
    next(error);
  }
});

// @ PATCH /api/contacts/:contactId/favorite

router.patch(
  "/:contactId/favorite",
  validation,
  authValidation,
  async (req, res, next) => {
    const { contactId } = req.params;
    const { _id } = req.user;
    try {
      if (!Object.keys(req.body).includes("favorite")) {
        const error = new Error("missing field favorite");
        error.status = 400;
        throw error;
      }
      const data = await functions.updateContactStatus(
        contactId,
        req.body,
        _id
      );
      if (!data) {
        const error = new Error("Not found");
        error.status = 404;
        throw error;
      }
      res.status(200).json({
        status: "success",
        code: 201,
        data: data,
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
