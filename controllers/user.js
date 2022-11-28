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

exports.postLogin = async (req, res) => {
  try {
    const result = await User.findOne({ where: { email: req.body.email } });
    console.log(result);
    if (!result) {
      return res.status(404).send({ msg: "user not found. Please signup" });
    } else {
      if (result.password === req.body.password) {
        return res.status(200).send({ msg: "login success" });
      }
      return res.status(401).send({ msg: "password incorrect" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Inernal server error" });
  }
};
