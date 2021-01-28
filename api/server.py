import os
import flask
from flask import Flask, jsonify
from scraper import FPLData

# from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_praetorian import Praetorian

db = SQLAlchemy()
guard = Praetorian()
# cors = CORS()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.Text, unique=True)
    password = db.Column(db.Text)
    roles = db.Column(db.Text)

    form = db.Column(db.Text)
    defs = db.Column(db.Text)
    mids = db.Column(db.Text)
    fwds = db.Column(db.Text)
    gkps = db.Column(db.Text)
    bnch = db.Column(db.Text)

    is_active = db.Column(db.Boolean, default=True, server_default='true')

    @property
    def rolenames(self):
        try:
            return self.roles.split(",")
        except Exception:
            return []

    @property
    def formation(self):
        try:
            return self.form.split('-')
        except Exception:
            return []

    @property
    def defenders(self):
        try:
            return self.defs.split(',')
        except Exception:
            return []
    
    @property
    def midfielders(self):
        try:
            return self.mids.split(',')
        except Exception:
            return []

    @property
    def forwards(self):
        try:
            return self.fwds.split(',')
        except Exception:
            return []

    @property
    def goalkeepers(self):
        try:
            return self.gkps.split(',')
        except Exception:
            return []

    @property
    def bench(self):
        try:
            return self.bnch.split(',')
        except Exception:
            return []

    @classmethod
    def lookup(cls, username):
        return cls.query.filter_by(username=username).one_or_none()

    @classmethod
    def identify(cls, id):
        return cls.query.get(id)

    @property
    def identity(self):
        return self.id

    def is_valid(self):
        return self.is_active


app = Flask(__name__)
app.config['SECRET_KEY'] = 'top secret'
app.config['JWT_ACCESS_LIFESPAN'] = {'hours': 24}
app.config['JWT_REFRESH_LIFESPAN'] = {'days': 30}

app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(os.getcwd(), 'database.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

guard.init_app(app, User)
# cors.init_app(app)

fplData = FPLData(useCache=True)

@app.route('/api/data')
def getPlayers():
    return jsonify(fplData.data)

@app.route('/api/players/<pid>')
def getPlayer(pid=0):
    return jsonify(fplData.data['elements'][int(pid)])

@app.route('/api/login', methods=['POST'])
def login():
    '''
    From https://yasoob.me/posts/how-to-setup-and-deploy-jwt-auth-using-react-and-flask/
    '''
    request = flask.request.get_json(force=True)
    print(request)
    username = request.get('username', None)
    password = request.get('password', None)
    user = guard.authenticate(username, password)
    ret = {'access_token': guard.encode_jwt_token(user)}
    return ret, 200

@app.route('/api/refresh', methods=['POST'])
def refresh():
    '''
    From https://yasoob.me/posts/how-to-setup-and-deploy-jwt-auth-using-react-and-flask/
    '''
    old_token = flask.request.get_data()
    new_token = guard.refresh_jwt_token(old_token)
    ret = {'access_token': new_token}
    return ret, 200

if __name__ == "__main__":
    app.run(debug=True, port=5000)