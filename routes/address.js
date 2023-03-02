const express = require("express");
const router = express.Router();
const Address = require("../schemas/address");
const authenticateAccessToken = require("../middleware/authAccessToken");
router.get("/address", authenticateAccessToken, async (req, res) => {
  const { user } = res.locals;
  const userId = user.id;
  const address = await Address.find({ userId });
  if (address.length !== 0) {
    res.json(address);
  } else {
    res.json();
  }
});
router.post("/address", authenticateAccessToken, async (req, res) => {
  const { user } = res.locals;
  const userId = user.id;
  const {
    place,
    receiver,
    postCode,
    address,
    addressDetail,
    phoneNumber1,
    phoneNumber2,
    phoneNumber3,
  } = req.body;
  const exsistsAddress = await Address.find({ userId });
  if (exsistsAddress.length !== 0) {
    await Address.deleteOne({ userId });
  }
  await Address.create({
    userId,
    place,
    receiver,
    postCode,
    address,
    addressDetail,
    phoneNumber1,
    phoneNumber2,
    phoneNumber3,
  });
  res.json({ place, receiver, postCode, address, addressDetail, phoneNumber1 });
});
router.delete("/address", authenticateAccessToken, async (req, res) => {
  const { user } = res.locals;
  const userId = user.id;
  const address = await Address.deleteOne({ userId });
  res.json(address);
});
module.exports = router;
