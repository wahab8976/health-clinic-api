require("dotenv").config();
const express = require("express");
const connectToDatabase = require("./api/config/db");
const {
  notFound,
  errorHandler,
} = require("./api/middlewares/error.middleware");

connectToDatabase();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const indexRoutes = require("./api/routes/index.route");
app.use("/api", indexRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
