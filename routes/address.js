const express = require("express");
const router = express.Router();
const Address = require("../schemas/address");
router.get("/address", async (req, res) => {
  const email = req.headers.email;
  const address = await Address.find({ email: email });
  if (address.length !== 0) {
    res.json(address);
  } else {
    res.json([]);
  }
});
router.post("/address", async (req, res) => {
  const email = req.headers.email;
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
  const exsistsAddress = await Address.find({ email: email });
  if (exsistsAddress.length !== 0) {
    await Address.deleteOne({ email: email });
  }
  await Address.create({
    email,
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
module.exports = router;
