const express = require("express");
const router = express.Router();
const functions = require("../../model");
const validation = require("../../middleware/walidation");

router.get("/", async (req, res, next) => {
  try {
    const data = await functions.listContacts();
    res.json({
      status: "success",
      code: 200,
      data: data,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const data = await functions.getContactById(contactId);
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

router.post("/", validation, async (req, res, next) => {
  try {
    const data = await functions.addContact(req.body);
    res.status(201).json({
      status: "success",
      code: 201,
      data: data,
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const data = await functions.removeContact(contactId);
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
  const { name, email, phone } = req.body;
  try {
    const data = await functions.updateContact(contactId, req.body);
    if (!name || !email || !phone) {
      const error = new Error("missing fields");
      error.status = 400;
      throw error;
    }
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

module.exports = router;
