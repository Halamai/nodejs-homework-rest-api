// const fs = require('fs/promises')
// const contacts = require("./contacts.json");
// const fs = require("fs/promises");
const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const contactsPath = path.join(__dirname, "contacts.json");

const listContacts = async () => {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.log(error.message);
  }
};

const getContactById = async (contactId) => {
  // console.log(contactId);
  try {
    const contacts = await listContacts();
    const contact = await contacts.find((i) => i.id.toString() === contactId);
    return contact;
  } catch (error) {
    console.log(error.message);
  }
};

const removeContact = async (contactId) => {
  try {
    const contacts = await listContacts();
    const newContacts = contacts.filter(
      (i) =>
        i.id.toString().toLowerCase().trim() !==
        contactId.toString().toLowerCase().trim()
    );
    await fs.writeFile(contactsPath, JSON.stringify(newContacts));
    return newContacts;
  } catch (error) {
    console.log(error.message);
  }
};

const addContact = async (body) => {
  try {
    const contacts = await listContacts();
    const id = uuidv4();

    const newContact = { id, ...body };
    contacts.push(newContact);

    await fs.writeFile(contactsPath, JSON.stringify(contacts));
    return newContact;
  } catch (error) {
    console.log(error.message);
  }
};

const updateContact = async (contactId, body) => {
  try {
    const contacts = await listContacts();
    const contact = contacts.filter(
      (item) =>
        item.id.toString().toLowerCase().trim() !==
        contactId.toString().toLowerCase().trim()
    );
    if (!contact) return null;
    const changeContact = { id: contactId, ...body };
    contact.push(changeContact);
    await fs.writeFile(contactsPath, JSON.stringify(contact));
    return changeContact;
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
};
