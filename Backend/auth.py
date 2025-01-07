from flask import Blueprint, jsonify, request
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt,
    current_user,
    get_jwt_identity,
    set_access_cookies,
    set_refresh_cookies
)
from models import User, TokenBlocklist

auth_bp = Blueprint("auth", __name__)

@auth_bp.post("/register")
def register_user():
    data = request.get_json()
    user = User.get_user_by_email(email=data.get("email"))
    if user is not None:
        return jsonify({"error": "User already exists"}), 409
    new_user = User(username=data.get("username"), email=data.get("email"))
    new_user.set_password(password=data.get("password"))
    new_user.save()

    access_token = create_access_token(identity=new_user.username)
    refresh_token = create_refresh_token(identity=new_user.username)

    response = jsonify({
        "message": "User created and logged in",
        "access_token": access_token,
        "refresh_token": refresh_token
    })
    set_access_cookies(response, access_token)
    set_refresh_cookies(response, refresh_token)

    return response, 201

@auth_bp.post("/login")
def login_user():
    data = request.get_json()
    user = User.get_user_by_email(email=data.get("email"))
    if user and user.check_password(password=data.get("password")):
        access_token = create_access_token(identity=user.username)
        refresh_token = create_refresh_token(identity=user.username)
        
        response = jsonify({
            "message": "Logged In",
            "access_token": access_token,
            "refresh_token": refresh_token
        })
        set_access_cookies(response, access_token)
        set_refresh_cookies(response, refresh_token)
        
        return response, 200
    return jsonify({"error": "Invalid username or password"}), 400

@auth_bp.get("/whoami")
@jwt_required()
def whoami():
    return jsonify({
        "message": "User details",
        "user_details": {
            "username": current_user.username,
            "email": current_user.email
        }
    })

@auth_bp.post("/refresh")
@jwt_required(refresh=True)
def refresh_access():
    identity = get_jwt_identity()
    new_access_token = create_access_token(identity=identity)

    response = jsonify({
        "access_token": new_access_token
    })
    set_access_cookies(response, new_access_token)

    return response

@auth_bp.get("/logout")
@jwt_required(verify_type=False)
def logout_user():
    jwt = get_jwt()
    jti = jwt["jti"]
    token_type = jwt["type"]
    token_b = TokenBlocklist(jti=jti)
    token_b.save()
    return jsonify({"message": f"{token_type} token revoked successfully"}), 200
