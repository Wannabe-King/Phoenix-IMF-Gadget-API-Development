const express = require("express");
const prisma = require("../utils/prisma");
const authenticate = require("../middlewares/auth");
const gadgetRouter = express.Router();

const validStatuses = ["Available", "Deployed", "Destroyed", "Decommissioned"];

const codenames = [
  "The Kraken",
  "The Phoenix",
  "The Black Widow",
  "The Viper",
  "The Ghost",
  "The Sentinel",
  "The Hawk",
  "The Barracuda",
  "The Cobra",
  "The Night Stalker",
];

const romanNumerals = [
  "",
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
  "X",
];

function toRoman(num) {
  if (num <= 10) return romanNumerals[num];
  return num.toString(); // Fallback to numeric if beyond supported range
}

async function generateUniqueCodename() {
  let codename,
    suffix = Math.floor(Math.random() * 11); //Generate a rondom number between 0-10

  do {
    const baseCodename =
      codenames[Math.floor(Math.random() * codenames.length)];
    const romanSuffix = toRoman(suffix);
    codename = `${baseCodename} ${romanSuffix}`.trim();

    // Check if the codename already exists in the database
    const existingGadget = await prisma.gadget.findFirst({
      where: { name: codename },
    });
    if (!existingGadget) break; // Codename is unique
  } while (true);

  return codename;
}

function generateCode() {
  return Math.random().toString(36).substr(2, 6).toUpperCase();
}

//  Retrieve all gadgets 
gadgetRouter.get("/", authenticate, async (req, res) => {
  try {
    const gadgets = await prisma.gadget.findMany();
    if (gadgets.length == 0) {
      return res.json({
        message: "There are no gadgets availabel presently.",
      });
    }
    const gadgetsWithProbability = gadgets.map((gadget) =>
      gadget.status === "Destroyed" || gadget.status === "Decommissioned"
        ? { ...gadget }
        : {
            ...gadget,
            successProbability: `${Math.floor(
              Math.random() * 101
            )}% success probability`,
          }
    );
    res.json(gadgetsWithProbability);
  } catch (e) {
    res.json("There was an error while getting gadget list");
  }
});

//  Add a new gadget
gadgetRouter.post("/", authenticate, async (req, res) => {
  const codename = await generateUniqueCodename();
  const gadget = await prisma.gadget.create({
    data: { name: codename },
  });
  res.status(201).json(gadget);
});

//  Update a gadget
gadgetRouter.patch("/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  const { name, status } = req.body;

  try {
    if (status) {
      if (!validStatuses.includes(status)) {
        return res.json({
          message: `Invalid status. Valid statuses are: ${validStatuses.join(
            ", "
          )}`,
        });
      }
    }
    const gadget = await prisma.gadget.update({
      where: { id },
      data: { name, status },
    });
    res.json(gadget);
  } catch (e) {
    res.status(404).json({ error: `Gadget not found. ${e}` });
  }
});

// DELETE: Decommission a gadget
gadgetRouter.delete("/:id", authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const gadget = await prisma.gadget.update({
      where: { id },
      data: { status: "Decommissioned", decommissionedAt: new Date() },
    });
    res.json(gadget);
  } catch {
    res.status(404).json({ error: "Gadget not found." });
  }
});

// POST: Trigger self-destruct
gadgetRouter.post("/:id/self-destruct", authenticate, async (req, res) => {
  const { id } = req.params;

  const gadget = await prisma.gadget.findUnique({ where: { id } });
  if (!gadget) return res.status(404).json({ error: "Gadget not found." });

  const confirmationCode = generateCode();
  res.json({
    message: `Self-destruct sequence initiated for ${gadget.name}.`,
    confirmationCode,
  });
});

module.exports = gadgetRouter;
