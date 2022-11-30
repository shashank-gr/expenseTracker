const SibApiV3Sdk = require("sib-api-v3-sdk");
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.SEND_IN_BLUE_KEY;

exports.postForgotPass = (req, res) => {
  // console.log(req.body.email);

  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email

  sendSmtpEmail = {
    to: [
      {
        email: req.body.email,
      },
    ],
    templateId: 1,
    params: {
      name: "Customer",
    },
  };
  apiInstance
    .sendTransacEmail(sendSmtpEmail)
    .then((data) => {
      console.log(data);
      res.status(201).send({ msg: "sucsess" });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send({ msg: "Internal server error" });
    });
};
