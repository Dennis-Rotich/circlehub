#!/usr/bin/env python3

# Standard library imports

# Remote library imports
import os
from flask import Flask, flash, request, redirect, url_for, make_response, jsonify, render_template
from werkzeug.utils import secure_filename
from flask_restful import Resource
from datetime import datetime
import os
from flask_jwt_extended import  jwt_required, create_access_token, JWTManager, get_jwt_identity

# Local imports and model imports
from models import app, api, User, Comment, Post, db

UPLOAD_FOLDER = './static/images'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

app.config['JWT_SECRET_KEY'] = 'buh_elcirc'
app.config['SECRET_KEY'] = 'buh_elcirc'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
jwt = JWTManager(app)

#------------------------------------Displaying images uploaded to static/images------------------
img = os.path.join('static','images')

@app.route('/<name>')
def images(name):
    file = os.path.join(img,str(name + datetime.now()))
    return render_template('image_render.html', image=file)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/image', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)
        file = request.files['file']
        # If the user does not select a file, the browser submits an
        # empty file without a filename.
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            return make_response({"message":"file uploaded successfully","path":f"{filename}"}, 201)

#----------------------------------Logging into the app-------------------------------------
class Login(Resource):
    def post(self):
        username = request.json.get('username', None)
        password = request.json.get('password', None)
        user = User.query.filter_by(username=username).first()
        if not user:
            return make_response({"Message":"Invalid username or password" },401)
        if user.password != password:
            return make_response({"Message": "Invalid username or password"},401)
        access_token = create_access_token(identity=user.username)
        return make_response({"message":"Logged in successfully","access_token": access_token,'id':user.id,'username':user.username,'first_name':user.first_name,'last_name':user.last_name},200)
        pass

#------------------------------------Comment Routes---------------------------
class CommentResource(Resource):
    def post(self, post_id):
        data = request.json
        if 'user_id' not in data or 'message' not in data:
            return jsonify({'message': 'Missing required fields'})

        # Check if the post exists
        post = Post.query.get(post_id)
        if not post:
            return jsonify({'message': 'Post not found'})

        # # Convert the string to a datetime object
        # created_at = datetime.fromisoformat(data['created_at'])

        comment = Comment(user_id=data.get('user_id'), post_id=post_id, message=data.get('message'))
        db.session.add(comment)
        db.session.commit()
        return jsonify({'message': 'Comment created successfully', 'comment_id': comment.id})


## Get Post Comments
    def get(self, post_id, comment_id=None):
        if comment_id is not None:
            comment = Comment.query.get(comment_id)
            if not comment:
                return jsonify({'message': 'Comment not found'})
            if comment.post_id != post_id:
                return jsonify({'message': 'Comment does not belong to this post'})

            return jsonify({
                'id': comment.id,
                'username':comment.user.username,
                'user_id': comment.user_id,
                'post_id': comment.post_id,
                'message': comment.message,
                'created_at': comment.created_at.isoformat()
            })
        else:
            comments = Comment.query.filter_by(post_id=post_id).all()
            return jsonify([{
                'id': comment.id,
                'user_id': comment.user_id,
                'username':comment.user.username,
                'post_id': comment.post_id,
                'message': comment.message, 
                'created_at': comment.created_at.isoformat()
            } for comment in comments])
## Edit Post Comments
    def patch(self, post_id, comment_id):
        data = request.json
        comment = Comment.query.get(comment_id)
        if not comment:
            return jsonify({'message': 'Comment not found'})
        if 'message' in data:
            comment.content = data['content']
        db.session.commit()
        return jsonify({'message': 'Comment updated successfully'})

## Delete Post Comments
    def delete(self, post_id, comment_id):
        comment = Comment.query.get(comment_id)
        if not comment:
            return jsonify({'message': 'Comment not found'})
        if comment.post_id != post_id:
            return jsonify({'message': 'Comment does not belong to this post'})

        db.session.delete(comment)
        db.session.commit()
        return jsonify({'message': 'Comment deleted successfully'})

####-------------------API RESOURCE FOR COMMENTS------------------------------------------
api.add_resource(CommentResource, '/posts/<int:post_id>/comments', '/posts/<int:post_id>/comments/<int:comment_id>')

##-------------------------------POST routes-----------------------------------
class Posts(Resource):
    def get(self):
        category_filter = request.args.get('category')
        title_filter = request.args.get('title') 

        if category_filter:
            if title_filter: 
                posts = Post.query.filter_by(category=category_filter, title=title_filter).all()
            else:
                posts = Post.query.filter_by(category=category_filter).all()
        elif title_filter: 
            posts = Post.query.filter_by(title=title_filter).all()
        else:
            posts = Post.query.all()
        response_dict = [{
            'id': post.id,
            'title': post.title,
            'content': post.content,
            'category': post.category,
            "image":post.image,
            'username':post.user.username,
            "created":post.created_at.isoformat(),
            "upvotes":post.upvotes,
            "downvotes":post.downvotes
            } for post in posts]
        return response_dict, 200

    # def post(self):
    #     data = request.json
    #     print(data)
    #     title=data.get('title'),
    #     content=data.get('content'),
    #     category=data.get('category'),
    #     user_id = data.get('user_id')
    #     new_post = Post(title=title,content=content,category=category,user_id=user_id)
    #     db.session.add(new_post)
    #     db.session.commit()
    #     response_dict = new_post.to_dict()
    #     return make_response({"message":"post created successfully"}, 201)

#-----------------------------Post Route endpoint-------------------------------------
api.add_resource(Posts, '/posts')

#-----------------------------Post by ID routes----------------------------------------
class PostByID(Resource):
    def get(self, id):
        post = Post.query.filter_by(id=id).first()
        comments = Comment.query.filter(Comment.post_id==id).all()
        if post is None:
            return {'message': 'Post not found'}, 404
        if comments:
            comments_data = [{'id': comment.id, 'message': comment.message, 'username': comment.user.username,"created":comment.created_at} for comment in comments]
        else:
            comments_data = []    
        response_dict = {'id': post.id,
            'title': post.title,
            'content': post.content,
            'category': post.category,
            "username":post.user.username,
            "created":post.created_at,
            "image":post.image,
            'comments': comments_data,
            "upvotes":post.upvotes,
            "downvotes":post.downvotes
            }
        response = make_response(
            response_dict, 200
        )

        return response

    def patch(self, id):
        data = request.json
        post = Post.query.filter_by(id = id).first()
        title=data.get('title', post.title)
        content=data.get('content', post.content)
        category=data.get('category', post.category)
        user_id = data.get('user_id', post.user_id)
        image = data.get('image', post.image)
        upvotes = data.get('upvotes', post.upvotes)
        downvotes = data.get('downvotes', post.downvotes)
        post.title = title
        post.content = content
        post.category = category
        post.user_id = user_id
        post.image = image
        post.upvotes = upvotes
        post.downvotes = downvotes
        db.session.commit()
        response_dict = {'id': post.id,
            'title': post.title,
            'content': post.content,
            'category': post.category,
            "username":post.user.username,
            "created":post.created_at,
            "image":post.image,
            "upvotes":post.upvotes,
            "downvotes":post.downvotes
            }

        response = make_response(
            response_dict,
            200
        )

        return response

    def delete(self, id):
        post = Post.query.filter(Post.id == id).first()

        db.session.delete(post)
        db.session.commit()

        response_dict = {"message": "post successfully deleted"}
        response = make_response(response_dict, 200)

        return response

#-------------------------Post Route endpoint--------------------------
api.add_resource(PostByID, '/posts/<int:id>')

#---------------------------Upvotes and downvotes feature---------------------------
class PostAction(Resource):
    def put(self, post_id):

        post = Post.query.get_or_404(post_id)
        vote = request.args.get('vote')
        if vote == 'upvote':
            post.upvotes += 1

        elif vote == 'downvote':
            post.downvotes += 1


        db.session.commit()
        return make_response({'id': post.id,
            'title': post.title,
            'content': post.content,
            'category': post.category,
            "username":post.user.username,
            "created":post.created_at,
            "image":post.image,
            "upvotes":post.upvotes,
            "downvotes":post.downvotes
            }, 201)
api.add_resource(PostAction, '/posts/<int:post_id>/post_action')

#---------------------------------USER routes------------------------------------
class UserResource(Resource):
    @jwt_required()  # Requires the user to be logged in
    def get(self, user_id):
        # Retrieve the user with the specified ID
        user = User.query.filter_by(id=user_id).first()
        if not user:
            return make_response({"message": "User not found"}, 404)

        # Convert the user to a dictionary and return it as JSON
        response_dict = {"username":user.username,"first_name":user.first_name,"last_name":user.last_name,"bio":user.bio,"id":user.id,"password":user.password}
        return make_response(response_dict, 200)

    # @jwt_required()  # Requires the user to be logged in
    def patch(self, user_id):
        # Retrieve the user with the specified ID
        user = User.query.filter_by(id=user_id).first()
        if not user:
            return make_response({"message": "User not found"}, 404)

        data = request.json

        # Update the user details from the request data
        if data.get('username') is not None:
            user.username = data.get('username', user.username)
        if data.get('password') is not None:
            user.password = data.get('password', user.password)
        if data.get('first_name') is not None:
            user.first_name = data.get('first_name', user.first_name)
        if data.get('last_name') is not None:
            user.last_name = data.get('last_name', user.last_name)


        # Commit the changes to the database
        db.session.commit()
        return make_response({"message": "User updated successfully"}, 200)

    @jwt_required()  # Requires the user to be logged in
    def delete(self, user_id):
        # Retrieve the user with the specified ID
        user = User.query.get(user_id)
        if not user:
            return make_response({"message": "User not found"}, 404)

        # Delete the user and commit the changes
        db.session.delete(user)
        db.session.commit()
        return make_response({"message": "User deleted successfully"}, 200)

#--------------------------UPDATED USER post route-----------------------------------------------
@app.route('/user',methods=['POST'])
def user():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    first_name =data.get('first_name')
    last_name = data.get('last_name')
    user = User(username=username, password=password, first_name=first_name, last_name=last_name)
    db.session.add(user)
    db.session.commit()
    access_token = create_access_token(identity=user.username)
    return make_response({"message":"User created successfully!","access_token":access_token,"id":user.id},201)

#-----------------------------------UPDATED POST post route------------------------------------
@app.route('/post', methods=['POST'])
def post():
    data = request.json
    title= data.get('title')
    content= data.get('content')
    category= data.get('category')
    user_id = data.get('user_id')
    image = data.get('image')
    new_post = Post(title=title,content=content,category=category,user_id=user_id,image=image)
    db.session.add(new_post)
    db.session.commit()
    return make_response({"message":"Post created successfully","id":new_post.id},201)

#---------------------------------User route endpoint------------------------------
# Register the UserResource with the API
api.add_resource(UserResource, '/users/<int:user_id>')


# Add resource to API

api.add_resource(Login, '/login')


# Views go here!

@app.route('/')
def index():
    return '<h1>Project Server</h1>'


if __name__ == '__main__':
    app.run(port=5555, debug=True)
