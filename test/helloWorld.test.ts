import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../src/server';

chai.should();
chai.use(chaiHttp);

describe('root endpoint', () => {
  it('should return a confirmation string', (done) => {
    chai
      .request(server)
      .get('/')
      .end((err, res) => {
        res.should.have.status(200);
        res.text.should.be.a('string');
        done();
      });
  });
});
