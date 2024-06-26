#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc
from models import User, Post, Comment
# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")
        # Seed code goes here!
        user1 = User.query.filter_by(id=3).first()
        user2 = User.query.filter_by(id=4).first()
        post = Post.query.filter_by(id=5).first()
        comment1 = Comment(user=user1,post=post,message=fake.sentence())
        comment2 = Comment(user=user2,post=post,message=fake.sentence())
        comment3 = Comment(user=user1,post=post,message=fake.sentence())
        comments = [comment1,comment2,comment3]
        db.session.add_all(comments)
        db.session.commit()  

        print("Done seeding...")
