if (process.env.NODE_ENV === "production") {
  module.exports = {
    mongoURI: "mongodb://gtechera:gtechera@ds115870.mlab.com:15870/vidjot-prod"
  };
} else {
  module.exports = {
    mongoURI: "mongodb://localhost/vidjot-dev"
  };
}
