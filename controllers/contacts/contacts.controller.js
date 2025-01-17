const { Contact } = require("../../models/contact");
const { HttpError } = require("../../helpers");
const { controllerWrap } = require("../../utils");

// Get all contacts
const getAll = async (req, res) => {
  // Pagination
  const { _id: owner } = req.user;
  const { page = 1, limit = 20, favorite } = req.query;
  const skip = (page - 1) * limit;

  // Filter by favorite
  const query = { owner };
  if (favorite) {
    query.favorite = favorite;
  }
  const result = await Contact.find(query)
    .populate("owner", "email")
    .skip(skip)
    .limit(parseInt(limit));
  res.json(result);
};

// Get a single contact by id
const getById = async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const result = await Contact.findById(contactId);
    if (!result) {
      throw HttpError(404);
    }
    res.json(result);
  } catch (error) {
    if (error.name === "CastError") {
      return next(HttpError(404));
    }
    next(error);
  }
};

// Create a new contact
const addNewContact = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Contact.create({ ...req.body, owner });
  res.status(201).json(result);
};

// Delete a contact
const deleteContact = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndDelete(contactId);
  if (!result) {
    throw HttpError(404);
  }
  res.status(200).json({ message: "contact deleted" });
};

// Update a contact
const updateContact = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  if (!result) {
    throw HttpError(404);
  }
  res.status(200).json(result);
};

// Update contact status (favorite)

const updateStatusContact = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  if (!result) {
    throw HttpError(404);
  }
  res.status(200).json(result);
};

module.exports = {
  getAll: controllerWrap(getAll),
  getById: controllerWrap(getById),
  addNewContact: controllerWrap(addNewContact),
  deleteContact: controllerWrap(deleteContact),
  updateContact: controllerWrap(updateContact),
  updateStatusContact: controllerWrap(updateStatusContact),
};
