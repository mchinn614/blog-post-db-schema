const { app, runServer, closeServer } = require("../server");
const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;

// use chai http plugin for integration tests
chai.use(chaiHttp);

// use chai expect test for test API endpoints
describe("Blog integration tests", function() {
  before(function() {
    return runServer;
  });

  it("test get endpoint", function() {
    return chai
      .request(app)
      .get("/blog-post")
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res.body).to.be.a("array");
        expect(res).to.be.json;
      });
  });

  it("test post endpoint", function() {
    const newItem = {
      title: "Title2",
      author: "author2",
      content: "blah blah blah",
      publishDate: "1/2/19"
    };
    return chai
      .request(app)
      .post("/blog-post")
      .set("Content-Type", "application/json")
      .send(newItem)
      .then(function(res) {
        expect(res).to.have.status(201);
        expect(res).to.be.json;
        expect(res.body).to.deep.equal(
          Object.assign(newItem, { id: res.body.id })
        );
      });
  });

  it("test put endpoint", function() {
    // get id from persistence layer
    return chai
      .request(app)
      .get("/blog-post")
      .then(function(res) {
        const editItem = {
          title: "Title3",
          author: "author3",
          content: "blah blah blah",
          publishDate: "1/2/19"
        };
        const id = res.body[0].id;
        return chai
          .request(app)
          .put(`/blog-post/${id}`)
          .set("Content-Type", "application/json")
          .send(editItem)
          .then(function(res) {
            expect(res).to.have.status(202);
            expect(res).to.be.json;
            expect(res.body).to.deep.equal(Object.assign(editItem, { id: id }));
          });
      });
  });

  it("test delete endpoint", function() {
    return chai
      .request(app)
      .get("/blog-post")
      .then(function(res) {
        const id = res.body[0].id;
        return chai
          .request(app)
          .delete(`/blog-post/${id}`)
          .then(function(res) {
            expect(res).to.have.status(204);
          });
      });
  });

  after(function() {
    return closeServer;
  });
});
