const { app, runServer, closeServer } = require("../server");
const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
const databaseUrl = require("../config");

// use chai http plugin for integration tests
chai.use(chaiHttp);

// use chai expect test for test API endpoints
describe("Blog integration tests", function() {
  before(function() {
    return runServer(databaseUrl);
  });

  it("test get endpoint", function() {
    return chai
      .request(app)
      .get("/blog-post")
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res.body).to.be.a("object");
        expect(res).to.be.json;
      });
  });

  it("test post endpoint", function() {
    const newItem = {
      title: "Title2",
      author: { firstName: "authorFirst", lastName: "authorLast" },
      content: "blah blah blah"
    };
    return chai
      .request(app)
      .post("/blog-post")
      .set("Content-Type", "application/json")
      .send(newItem)
      .then(function(res) {
        expect(res).to.have.status(201);
        expect(res).to.be.json;
      });
  });

  it("test put endpoint", function() {
    // get id from persistence layer
    return chai
      .request(app)
      .get("/blog-post")
      .then(function(res) {
        const id = res.body.blogs[0].created;
        const editItem = {
          title: "Title3",
          id: id,
          content: "blah blah blah"
        };

        return chai
          .request(app)
          .put(`/blog-post/${id}`)
          .set("Content-Type", "application/json")
          .send(editItem)
          .then(function(res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
          });
      });
  });

  it("test delete endpoint", function() {
    return chai
      .request(app)
      .get("/blog-post")
      .then(function(res) {
        const id = res.body.blogs[0].created;
        return chai
          .request(app)
          .delete(`/blog-post/${id}`)
          .then(function(res) {
            expect(res).to.have.status(204);
          });
      });
  });

  after(function() {
    return closeServer();
  });
});
