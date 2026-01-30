let { people } = require("../people.cjs");

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

  return res.status(200).json({ success: true, data: people });
};

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
  return res.status(200).json({ success: true, data: people });
};

module.exports = {
  getPeople,
  getPerson,
  addPerson,
  updatePerson,
  deletePerson,
};
