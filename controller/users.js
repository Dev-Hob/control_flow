const user_model = require("../model/user_model");
const otpGenerator = require("otp-generator");

const router = require("express").Router();

router.post("/", async (req, res) => {
  const { name, phone_number } = req.body;
  if (!name || !phone_number) {
    return res
      .status(400)
      .json({ error: "name and phone_number is required!" });
  }
  try {
    const user = await user_model({ name, phone_number }).save();
    res.status(200).json({ success: "User Created Succesfully!" });
  } catch (err) {
    console.log("Error : ", err);
    res.status(400).json({ error: err });
  }
});

router.post("/generateOTP", async (req, res) => {
  console.log("req.body : ", req.body);
  if (!req.body.phone_number) {
    return res.status(400).json({ error: "phone_number is required!" });
  }
  const { phone_number } = req.body;

  const otp = otpGenerator.generate(12, {
    upperCaseAlphabets: true,
    specialChars: false,
  });
  const newTime = Math.floor(Date.now() / 1000) + 300;
  const user = await user_model.findOneAndUpdate(
    { phone_number },
    { otp, otp_expiration_date: newTime },
    { new: true }
  );
  console.log("USER IS : ", user);
  !user
    ? res
        .status(400)
        .json({ error: "Didn't find any user with such phone_number" })
    : res.status(200).json({
        success: "Otp generated for user.",
        id: user._id,
        otp: user.otp,
      });
});

router.get("/:user_id/verifyOTP", async (req, res) => {
  if (!req.query.otp) {
    return res.status(400).json({ error: "OTP code is missing!" });
  }
  const _id = req.params.user_id;
  const { otp } = req.query;

  const user = await user_model.findOne({ _id, otp });
  !user
    ? res.status(400).json({ error: "Cannot find such user with OTP!" })
    : user.otp_expiration_date < Math.floor(Date.now() / 1000)
    ? res.status(200).json({ success: "User and OTP checked and verified!" })
    : res.status(400).json({ error: "OTP expired!" });
});

module.exports = router;
