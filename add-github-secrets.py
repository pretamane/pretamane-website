#!/usr/bin/env python3
"""
Add Cloudflare secrets to GitHub repository using GitHub API
"""

import os
import sys
import json
import base64
from urllib.request import Request, urlopen
from urllib.error import HTTPError
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives import hashes

# Configuration
GITHUB_TOKEN = os.getenv('GITHUB_TOKEN')
REPO_OWNER = "pretamane"
REPO_NAME = "pretamane-website"

# Secrets to add
SECRETS = {
    "CLOUDFLARE_API_TOKEN": "owrWwvDMbECEVtA3NTwItOxguTO1Zsb_PiQNeTRe",
    "CLOUDFLARE_ACCOUNT_ID": "d4cce76b1a4f91b589da3c2d627308ff"
}

def make_request(url, method="GET", data=None):
    """Make authenticated GitHub API request"""
    headers = {
        "Authorization": f"token {GITHUB_TOKEN}",
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "GitHub-Secrets-Script"
    }
    
    if data:
        headers["Content-Type"] = "application/json"
        data = json.dumps(data).encode('utf-8')
    
    req = Request(url, data=data, headers=headers)
    req.get_method = lambda: method
    
    try:
        with urlopen(req) as response:
            return json.loads(response.read().decode('utf-8'))
    except HTTPError as e:
        error_body = e.read().decode('utf-8')
        print(f"Error {e.code}: {error_body}")
        return None

def get_public_key():
    """Get repository's public key for encrypting secrets"""
    url = f"https://api.github.com/repos/{REPO_OWNER}/{REPO_NAME}/actions/secrets/public-key"
    return make_request(url)

def encrypt_secret(public_key_str, key_id, secret_value):
    """Encrypt secret using repository's public key"""
    try:
        from nacl import encoding, public
    except ImportError:
        print("Installing PyNaCl...")
        os.system("pip3 install pynacl --quiet")
        from nacl import encoding, public
    
    # Decode public key
    public_key_bytes = base64.b64decode(public_key_str)
    public_key = public.PublicKey(public_key_bytes)
    
    # Encrypt secret
    box = public.SealedBox(public_key)
    encrypted = box.encrypt(secret_value.encode('utf-8'))
    encrypted_b64 = base64.b64encode(encrypted).decode('utf-8')
    
    return encrypted_b64

def add_secret(secret_name, encrypted_value, key_id):
    """Add encrypted secret to repository"""
    url = f"https://api.github.com/repos/{REPO_OWNER}/{REPO_NAME}/actions/secrets/{secret_name}"
    data = {
        "encrypted_value": encrypted_value,
        "key_id": key_id
    }
    return make_request(url, method="PUT", data=data)

def main():
    if not GITHUB_TOKEN:
        print("ERROR: GITHUB_TOKEN environment variable not set")
        sys.exit(1)
    
    print("=== Adding GitHub Secrets ===")
    print(f"Repository: {REPO_OWNER}/{REPO_NAME}\n")
    
    # Get public key
    print("1. Getting repository public key...")
    public_key_data = get_public_key()
    if not public_key_data:
        print("Failed to get public key")
        sys.exit(1)
    
    key_id = public_key_data["key_id"]
    public_key = public_key_data["key"]
    print(f"   Key ID: {key_id}\n")
    
    # Add each secret
    for secret_name, secret_value in SECRETS.items():
        print(f"2. Encrypting and adding {secret_name}...")
        
        encrypted_value = encrypt_secret(public_key, key_id, secret_value)
        
        result = add_secret(secret_name, encrypted_value, key_id)
        if result is None:
            # Check if it's a 204 (success) or actual error
            # GitHub returns 204 No Content on success
            print(f"   Checking if secret exists...")
            # Try to get the secret to verify
            check_url = f"https://api.github.com/repos/{REPO_OWNER}/{REPO_NAME}/actions/secrets/{secret_name}"
            check_result = make_request(check_url)
            if check_result:
                print(f"   ✅ Secret {secret_name} added successfully!")
            else:
                print(f"   ⚠️  Secret {secret_name} may already exist or failed to add")
        else:
            print(f"   ✅ Secret {secret_name} added successfully!")
        print()
    
    print("=== Complete ===")
    print("Secrets have been added to GitHub repository")
    print("Workflow should now be able to run successfully")

if __name__ == "__main__":
    main()








