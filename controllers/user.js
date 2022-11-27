const User = require("../model/user");

exports.postSignUp = async (req, res) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    res.status(200).send({ user: newUser, msg: "success user registered" });
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
};
