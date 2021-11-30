const Contacts = require("../schema/schema.js.js");

const listContacts = async () => {
  try {
    const data = await Contacts.find({});
    return data;
  } catch (error) {
    console.log(error.message);
  }
};

const getContactById = async (contactId) => {
  // console.log(contactId);
  try {
    const contacts = await Contacts.findById(contactId);
    return contacts;
  } catch (error) {
    console.log(error.message);
  }
};

const removeContact = async (contactId) => {
  try {
    const data = await Contacts.findByIdAndDelete(contactId);
    return data;
  } catch (error) {
    console.log(error.message);
  }
};

const addContact = async (body) => {
  try {
    const data = await Contacts.create(body);
    return data;
  } catch (error) {
    console.log(error.message);
  }
};

const updateContact = async (contactId, body) => {
  try {
    const data = await Contacts.findByIdAndUpdate(contactId, body, {
      new: true,
    });
    return data;
  } catch (error) {
    console.log(error.message);
  }
};

const updateContactStatus = async (contactId, body) => {
  try {
    const { favorite } = body;
    const data = await Contact.findByIdAndUpdate(
      contactId,
      { favorite },
      {
        new: true,
      }
    );
    return data;
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateContactStatus,
};
