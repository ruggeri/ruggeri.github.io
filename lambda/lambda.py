import binascii
from botocore.vendored import requests
import boto3
from boto3.dynamodb.conditions import Key
from datetime import datetime, timezone
import json
import os
import traceback;
import urllib.parse
import uuid

dynamodb = boto3.resource('dynamodb')
comments_table = dynamodb.Table('comments')
users_table = dynamodb.Table('users')

def get_comments(event, context):
    entry_id = event["entry_id"]
    response = comments_table.query(
        KeyConditionExpression=Key('entry_id').eq(entry_id)
    )

    comments = response['Items']
    for comment in comments:
        if ('author_github_name' not in comment) and ('author_name' in comment):
            # The first comments didn't save the Github author's name.
            comment['author_github_name'] = comment['author_name']
            del comment['author_name']

    return {
        "statusCode": 200,
        "comments": comments
    }

def create_comment(event, context):
    entry_id, text, author_github_id, author_secret_code = (
        event["payload"]["entry_id"],
        event["payload"]["comment_text"],
        event["payload"]["author_github_id"],
        event["payload"]["author_secret_code"],
    )

    author_user = users_table.get_item(Key={"github_id": author_github_id})['Item']
    print(author_user)

    if author_user == None:
        return {
            "statusCode": 404,
            "message": f"No user found for this github_id: {author_github_id}.",
        }

    if author_user['secret_code'] != author_secret_code:
        return {
            "statusCode": 403,
            "message": f"That is the wrong secret_code for this github_id: {author_github_id}.",
            "submittedUserSecretCode": author_secret_code,
        }

    author_github_login, author_github_name = author_user['github_login'], author_user['github_name']
    comment_id = str(binascii.b2a_hex(os.urandom(15)), "ascii")
    created_at = datetime.now(timezone.utc)

    comment = {
        "entry_id": entry_id,
        "comment_id": comment_id,
        "created_at": created_at.isoformat(),
        "author_github_id": author_github_id,
        "author_github_login": author_github_login,
        "author_github_name": author_github_name,
        "text": text,
    }

    comments_table.put_item(Item=comment)

    return {
        "statusCode": 200,
        "comment": comment,
    }

def login(event, context):
    code = event["code"]
    params = {
        "code": code,
        "client_id": "MY_CLIENT_ID", # not secret, but whatever
        "client_secret": "MY_CLIENT_SECRET" # yeah this is secret
    }
    r = requests.post('https://github.com/login/oauth/access_token', json=params, headers={"Accept":"application/json"})
    print(r)
    print(r.text)
    github_json_response = r.json()

    if "access_token" not in github_json_response:
        return {
            "statusCode": 500,
            "message": "Invalid token!"
        }
    access_token = github_json_response['access_token']

    r = requests.get(
        "https://api.github.com/user",
        params={'access_token': access_token}
    )
    user = r.json()
    github_id, github_login, github_name = (
        str(user['id']),
        user['login'],
        user['name'],
    )

    user = users_table.get_item(Key={"github_id": github_id})['Item']

    if user is None:
        user = { "github_id": github_id, "secret_code": str(uuid.uuid4()) }
    else:
        # Don't *reset* secret_code, as this will invalidate other logins.
        # Should only reset on *logout*.
        user = { "github_id": github_id, "secret_code": user["secret_code"] }

    user["github_login"] = github_login
    user["github_name"] = github_name
    user["json_user_payload"] = json.dumps(user)
    print(user)

    users_table.put_item(Item=user)

    return {
        "statusCode": 302,
        "headers": {
            f"Location": (
                f"https://blog.self-loop.com/login.html?"
                f"github_id={urllib.parse.quote(user['github_id'])}"
                f"&github_login={urllib.parse.quote(user['github_login'])}"
                f"&github_name={urllib.parse.quote(user['github_name'])}"
                f"&secret_code={urllib.parse.quote(user['secret_code'])}"
            )
        },
    }

def lambda_handler(event, context):
    print(event)

    if event["request"] == "get_comments":
        return get_comments(event, context)
    elif event["request"] == "create_comment":
        return create_comment(event, context)
    elif event["request"] == "login":
        try:
            return login(event, context)
        except Exception as err:
            traceback.print_exception(
                type(err),
                err,
                err.__traceback__,
            )
            print(err)
            return {
                "statusCode": 500,
                "message": "something went wrong"
            }
    else:
        return {
            "statusCode": 500,
            "error": "darn it"
        }
