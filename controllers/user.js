exports.postSignUp = (req, res) => {
  console.log(req.body);
  res.status(200).send({ msg: "success" });
};
