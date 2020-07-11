const express = require("express");

// keys file
const keys = require("./config/keys");

// bringing in stripe with our key
const stripe = require("stripe")(keys.stripeSecretKey);
const bodyparser = require("body-parser");
const exphbs = require("express-handlebars");

const app = express();

// Handlebars Middle
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main",
  })
);
app.set("view engine", "handlebars");

// body Parser
app.use(bodyparser.json());
app.use(
  bodyparser.urlencoded({
    extended: false,
  })
);

// set a static folder
app.use(express.static(`${__dirname}/public`));

// index route
app.get("/", (req, res) => {
  res.render("index", {
    stripePstripePublishableKeys: stripePstripePublish,
  });
});

// app.get("/success", (req, res) => {
//   res.render("success");
// });

// charge route
app.post("/charge", (req, res) => {
  const amount = 2500;
  stripe.customers
    .create({
      email: req.body.stripeEmail,
      source: req.body.stripeToken,
    })
    .then((customer) =>
      stripe.charges.create({
        amount,
        description: "Web Development Ebook",
        currency: "usd",
        customer: customer.id,
      })
    )
    .then((charge) => res.render("success"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
