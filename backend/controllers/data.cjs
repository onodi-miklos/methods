let people = require("../people.cjs");
const { writeFile } = require("fs");
const path = require("path");

const getPeople = (req, res) => {
  let { search, limit } = req.query;
  let sortedPeople = [...people];
  search = search?.trim().toLowerCase();
  if (search) {
    sortedPeople = sortedPeople.filter((person) => {
      return person.name.startsWith(search);
    });
  }
  if (limit) {
    sortedPeople = sortedPeople.slice(0, Number(limit));
  }
  if (sortedPeople.length < 1) {
    return res.status(200).json({ success: true, data: [] });
  }
  res.status(200).json({ success: true, data: sortedPeople });
};

const getPerson = (req, res) => {
  const { personId } = req.params;
  const person = people.find((person) => person.id === Number(personId));
  if (!person) {
    return res
      .status(404)
      .json({ success: false, msg: `no person found with id ${personId}` });
  }

  return res.status(200).json({ success: true, data: person });
};

const addPerson = (req, res) => {
  const { name } = req.body;

  const ids = people.map((e) => {
    return e.id;
  });
  let newId;
  for (let i = 1; i <= ids.length + 1; i++) {
    if (!ids.includes(i)) {
      newId = i;
      break;
    }
  }
  let newPerson = { id: newId, name };

  if (!name) {
    return res.status(400).json({ success: false, msg: "please provide name" });
  }
  people.push(newPerson);
  updatePeopleFile(people)

  return res.status(201).json({
    success: true,
    data: people,
  });
};

const updatePerson = (req, res) => {
  const { personId } = req.params;
  const { name } = req.body;

  const isPerson = people.find((person) => person.id === Number(personId));
  if (!isPerson) {
    return res
      .status(404)
      .json({ success: false, msg: `no person found with id ${personId}` });
  }
  people.forEach((person) => {
    if (person.id === Number(personId)) {
      person.name = name;
    }
    return person;
  });
  updatePeopleFile(people)

  return res.status(200).json({ success: true, data: people });
};

// AI GENERATED!!
const patchPerson = (req, res) => {
  const { personId } = req.params;
  const updates = req.body;

  const person = people.find((p) => p.id === Number(personId));
  if (!person) {
    return res
      .status(404)
      .json({ success: false, msg: `no person found with id ${personId}` });
  }

  // Allow partial updates to 'name' and 'id' (id must be a positive integer and unique)
  const allowedFields = ["name", "id"];
  const keys = Object.keys(updates || {});
  if (keys.length < 1) {
    return res
      .status(400)
      .json({ success: false, msg: "no fields provided for update" });
  }

  let updated = false;
  for (const key of keys) {
    if (!allowedFields.includes(key)) continue;

    if (key === "name") {
      if (typeof updates.name === "string" && updates.name.trim().length > 0) {
        person.name = updates.name.trim();
        updated = true;
      }
    }

    if (key === "id") {
      const newId = Number(updates.id);
      if (!Number.isInteger(newId) || newId < 1) {
        return res
          .status(400)
          .json({ success: false, msg: "id must be a positive integer" });
      }

      // If the id is different, ensure no other person already uses it
      if (newId !== person.id && people.some((p) => p.id === newId)) {
        return res
          .status(400)
          .json({ success: false, msg: `id ${newId} is already in use` });
      }

      person.id = newId;
      updated = true;
    }
  }

  if (!updated) {
    return res
      .status(400)
      .json({ success: false, msg: "no valid fields provided for update" });
  }
  updatePeopleFile(people)

  return res.status(200).json({ success: true, data: people });
};

// not AI generated
const deletePerson = (req, res) => {
  const person = people.find(
    (person) => person.id === Number(req.params.personId),
  );
  if (!person) {
    return res.status(404).json({
      success: false,
      msg: `no person found with id ${req.params.personId}`,
    });
  }

  people = people.filter((person) => person.id !== Number(req.params.personId));
  updatePeopleFile(people)

  return res.status(200).json({ success: true, data: people });
};

function updatePeopleFile(content) {
  const filePath = path.join(__dirname, "..", "people.cjs");
  const fileData = `const people = ${JSON.stringify(content, null, 2)}\n\nmodule.exports = people`;
  writeFile(filePath, fileData, (err) => {
    if (err) {
      console.error(err);
    }
  });
}

module.exports = {
  getPeople,
  getPerson,
  addPerson,
  updatePerson,
  patchPerson,
  deletePerson,
};
