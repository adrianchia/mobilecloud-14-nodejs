Video Service with OAuth 2 (using oauth2-server)
==============================================
This example demostrate how to use OAuth 2 for NodeJS.  It covers examples #9 and #10 for the Java example.

**Note**

1. When you run the example, you may see a security warning about the site certificate. This is expected for self signed certificate.
2. Under no circumstances should you use the self-signed (test) certificate in a production environment. This is only for demostration purpose.

Prerequisites
-------------
1. [NodeJS](http://nodejs.org)
2. [MongoDB](https://www.mongodb.org)
3. [OpenSSL](https://www.openssl.org/)

Getting Started
---------------
1. Install NodeJS and MongoDB in your local environment. (see README.md in parent directory installation instruction for NodeJS)
2. Make sure that both NodeJS and MongoDB are accessible via command prompt / terminal by running `node --version` and `mongod --version`
3. create an empty directory to store the database, for example, *db*.
4. Start a MongoDB instance via `mongod --dbpath db --smallfiles --fork --logpath db/log`.
This starts a MongoDB instance with default host **127.0.0.1** and default port **27017** in a daemon mode.
For command line parameter details please visit http://docs.mongodb.org/manual/reference/program/mongod/ for more information.
If you already have a running MongoDB instance, you may reuse existing instance.

**Note**: --fork parameter only works for linux environment. For Windows, user may need to open up another command prompt for separate tasks.

5. Generate Self-Sign Certificate using OpenSSL. see http://www.akadia.com/services/ssh_test_certificate.html for more information.
6. Configure server.js for HTTPS using the generated key and cert above.
7. Generate Seed data from seed.js via `node seed`
8. Run the application on https://localhost:8443/video (default HTTPS port or port 443)
