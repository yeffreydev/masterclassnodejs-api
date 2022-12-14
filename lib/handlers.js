/**
 * Request handlers
 */

//Dependencies
var _data = require("./data");
var helpers = require("./helpers");
var config = require("./config");
//Define the handleres
var handlers = {};

/**
 * HTMLhandlers
 */

//Index Handler
handlers.index = function (data, callback) {
  //Reject anhy req3uest that isn't a GET
  if (data.method == "get") {
    //Prepare data for interpolation
    var templateData = {
      "head.title": "uptime monitoring - Made simple",
      "head.description": "We ofer free, simple uptime monitoring for HTTP/HTTPS sites of all kinds, When your site goes, we'll send you a text to let you know ",
      "body.class": "index",
    };

    //Read in a templates as a string
    helpers.getTemplate("index", templateData, function (err, str) {
      if (!err && str) {
        //Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, function (err, str) {
          if (!err && str) {
            //return that page as HTML
            callback(200, str, "html");
          } else {
            callback(500, undefined, "html");
          }
        });
      } else {
        callback(500, undefined, "html");
      }
    });
  } else {
    callback(405, undefined, "html");
  }
};

//Create Account
handlers.accountCreate = function (data, callback) {
  //Reject anhy req3uest that isn't a GET

  if (data.method == "get") {
    //Prepare data for interpolation
    var templateData = {
      "head.title": "Create an Account",
      "head.description": "Signup is easy and only takes a few seconds. ",
      "body.class": "accountCreate",
    };

    //Read in a templates as a string
    helpers.getTemplate("accountCreate", templateData, function (err, str) {
      if (!err && str) {
        //Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, function (err, str) {
          if (!err && str) {
            //return that page as HTML
            callback(200, str, "html");
          } else {
            callback(500, undefined, "html");
          }
        });
      } else {
        callback(500, undefined, "html");
      }
    });
  } else {
    callback(405, undefined, "html");
  }
};

//Create New Session
handlers.sessionCreate = function (data, callback) {
  //Reject anhy req3uest that isn't a GET

  if (data.method == "get") {
    //Prepare data for interpolation
    var templateData = {
      "head.title": "Login to your Account",
      "head.description": "Please enter your phone number and password to access your account.",
      "body.class": "sessionCreate",
    };

    //Read in a templates as a string
    helpers.getTemplate("sessionCreate", templateData, function (err, str) {
      if (!err && str) {
        //Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, function (err, str) {
          if (!err && str) {
            //return that page as HTML
            callback(200, str, "html");
          } else {
            callback(500, undefined, "html");
          }
        });
      } else {
        callback(500, undefined, "html");
      }
    });
  } else {
    callback(405, undefined, "html");
  }
};

//Session has been deleted
handlers.sessionDeleted = function (data, callback) {
  //Reject anhy req3uest that isn't a GET

  if (data.method == "get") {
    //Prepare data for interpolation
    var templateData = {
      "head.title": "Logged out",
      "head.description": "You have been loggoed out of your acccount",
      "body.class": "sessionDeleted",
    };

    //Read in a templates as a string
    helpers.getTemplate("sessionDeleted", templateData, function (err, str) {
      if (!err && str) {
        //Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, function (err, str) {
          if (!err && str) {
            //return that page as HTML
            callback(200, str, "html");
          } else {
            callback(500, undefined, "html");
          }
        });
      } else {
        callback(500, undefined, "html");
      }
    });
  } else {
    callback(405, undefined, "html");
  }
};

//favicon
handlers.favicon = function (data, callback) {
  //Reject any request that isn't a GET
  if (data.method == "get") {
    //read in the favicon's data
    helpers.getStaticAsset("favicon.ico", function (err, data) {
      if (!err && data) {
        callback(200, data, "favicon");
      } else {
        callback(500);
      }
    });
  } else {
    callback(405);
  }
};

//Public assets
handlers.public = function (data, callback) {
  //Reject any request that isn't a GET
  if (data.method == "get") {
    //Get the filenamebeing requested
    var trimmedAssetname = data.trimePath.replace("public/", "").trim();
    if (trimmedAssetname.length > 0) {
      //Read in the asset's data
      helpers.getStaticAsset(trimmedAssetname, function (err, data) {
        if (!err && data) {
          //Determna the content type (default plain text)
          var contentType = "plain";
          if (trimmedAssetname.indexOf(".css") > -1) {
            contentType = "css";
          }
          if (trimmedAssetname.indexOf(".png") > -1) {
            contentType = "png";
          }
          if (trimmedAssetname.indexOf(".jpg") > -1) {
            contentType = "jpg";
          }
          if (trimmedAssetname.indexOf(".ico") > -1) {
            contentType = "favicon";
          }

          //Callback the data
          callback(200, data, contentType);
        } else {
          callback(404);
        }
      });
    } else {
      callback(404);
    }
  } else {
    callback(405);
  }
};

/**
 *JSON API handlers
 */

//Users
handlers.users = function (data, callback) {
  var acceptaleMethods = ["post", "get", "put", "delete"];
  if (acceptaleMethods.indexOf(data.method) > -1) {
    handlers._users[data.method](data, callback);
  } else {
    callback(405);
  }
};

// Container for the users submethods
handlers._users = {};

//Users - post
//Required data: firstName, lastName, phone, password, tosAgreement
//optional data: none
handlers._users.post = function (data, callback) {
  // Check that all required fieds are filled out
  var firstName = typeof data.payload.firstName === "string" && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
  var lastName = typeof data.payload.lastName === "string" && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
  var phone = typeof data.payload.phone === "string" && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
  var password = typeof data.payload.password === "string" && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
  var tosAgreement = typeof data.payload.tosAgreement === "boolean" && data.payload.tosAgreement == true ? true : false;
  if (firstName && lastName && password && tosAgreement) {
    //Make suere that teh suer doesnt already exist
    _data.read("users", phone, function (err, data) {
      if (err) {
        //Hash the password
        var hashedPassword = helpers.hash(password);

        // Create the user object
        if (hashedPassword) {
          var userObject = {
            firstName,
            lastName,
            phone,
            hashedPassword,
            tosAgreement: true,
          };

          //Store the user
          _data.create("users", phone, userObject, function (err) {
            if (!err) {
              callback(200);
            } else {
              console.log(err);
              callback(500, { Error: "Could not create teh new user" });
            }
          });
        } else {
          callback(500, { Error: "Could not hash the user's password" });
        }
      } else {
        //users already exist
        callback(400, {
          Error: "A user with that phone number already exists",
        });
      }
    });
  } else {
    callback(404, { Error: "Missing required fields" });
  }
};

//Users - get
//Required data: phone
//optional data: none
handlers._users.get = function (data, callback) {
  //Check that the phone number is valid
  var phone = typeof data.queryStringObject.phone == "string" && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false;
  if (phone) {
    //Get the token from the headers
    var token = typeof data.headers.token == "string" ? data.headers.token : false;
    //Verify that the given is valid for the phone number
    handlers._tokens.verifyToken(token, phone, function (tokenIsValid) {
      if (tokenIsValid) {
        //lookup the user
        _data.read("users", phone, function (err, data) {
          if (!err && data) {
            //Remove the hashed password from the user object before returning it to the requester
            delete data.hashedPassword;
            callback(200, data);
          } else {
            callback(404);
          }
        });
      } else {
        callback(403, {
          Error: "Missing required token is header, or token is invalid",
        });
      }
    });
  } else {
    callback(400, { Error: "Missing required field" });
  }
};

//Users - put
//Required data : phone
// Optional data: firstName, lastName, password (at least one must be specified)
handlers._users.put = function (data, callback) {
  //Check for the required field
  var phone = typeof data.payload.phone == "string" && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;

  //check for the optional fields
  var firstName = typeof data.payload.firstName === "string" && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
  var lastName = typeof data.payload.lastName === "string" && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
  var phone = typeof data.payload.phone === "string" && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
  var password = typeof data.payload.password === "string" && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
  //Error if the phone is invalid
  if (phone) {
    //Error if nothing is sent to update
    if (firstName || lastName || password) {
      //Get the token from the headers
      var token = typeof data.headers.token == "string" ? data.headers.token : false;

      //Verify that the given is valid for the phone number
      handlers._tokens.verifyToken(token, phone, function (tokenIsValid) {
        if (tokenIsValid) {
          //looup the user
          _data.read("users", phone, function (err, userData) {
            if (!err && userData) {
              //Update the fields necessary
              if (firstName) {
                userData.firstName = firstName;
              }
              if (lastName) {
                userData.lastName = lastName;
              }
              if (password) {
                userData.hashedPassword = helpers.hash(password);
              }
              //Store the new updates
              _data.update("users", phone, userData, function (err) {
                if (!err) {
                  callback(200);
                } else {
                  console.log(err);
                  callback(500, { Error: "Could not update the user" });
                }
              });
            } else {
              callback(400, { Error: "The specified user does not exist" });
            }
          });
        } else {
          callback(403, {
            Error: "Missing required token is header, or token is invalid",
          });
        }
      });
    } else {
      callback(400, { Error: "missing fields to update" });
    }
  } else {
    callback(400, { Error: "Missing required field" });
  }
};

//Users - delete
//Required field : phone
handlers._users.delete = function (data, callback) {
  //check that  the phone number is valid
  var phone = typeof data.queryStringObject.phone == "string" && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false;

  if (phone) {
    //Get the token from the headers
    var token = typeof data.headers.token == "string" ? data.headers.token : false;

    //Verify that the given is valid for the phone number
    handlers._tokens.verifyToken(token, phone, function (tokenIsValid) {
      if (tokenIsValid) {
        //lookup the user
        _data.read("users", phone, function (err, userData) {
          if (!err && userData) {
            _data.delete("users", phone, function (err) {
              if (!err) {
                //Delete each fo the checks associated with the user
                var userChecks = typeof userData.checks == "object" && userData.checks instanceof Array ? userData.checks : [];
                var checkstoDelete = userChecks.length;
                if (checkstoDelete > 0) {
                  var checksDeleted = 0;
                  var deletionErrors = false;
                  //Loop trough the checks
                  userChecks.forEach(function (checkId) {
                    //Delete the check
                    _data.delete("checks", checkId, function (err) {
                      if (err) {
                        deletionErrors = true;
                      }
                      checksDeleted++;
                      if (checksDeleted === checkstoDelete) {
                        if (!deletionErrors) {
                          callback(200);
                        } else {
                          callback(500, {
                            Error: "errors enconterred while attempting to delete all of the users's checks. All checks may not have been deleted form thes system successfully",
                          });
                        }
                      }
                    });
                  });
                } else {
                  callback(200);
                }
              } else {
                callback(500, {
                  Error: "Could not delete the sepecified user",
                });
              }
            });
          } else {
            callback(400, { Error: "Could not find the specified user" });
          }
        });
      } else {
        callback(403, {
          Error: "Missing required token is header, or token is invalid",
        });
      }
    });
  } else {
    callback(400, { Error: "Missing required field" });
  }
};

//tokens
handlers.tokens = function (data, callback) {
  var acceptaleMethods = ["post", "get", "put", "delete"];
  if (acceptaleMethods.indexOf(data.method) > -1) {
    handlers._tokens[data.method](data, callback);
  } else {
    callback(405);
  }
};
//Container for all the tokens methods
handlers._tokens = {};

//tokens - post
//required data: phone, password
// optional data: none
handlers._tokens.post = function (data, callback) {
  var phone = typeof data.payload.phone === "string" && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
  var password = typeof data.payload.password === "string" && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
  if (phone && password) {
    //lookup the user who matches that phone number
    _data.read("users", phone, function (err, userData) {
      if (!err && userData) {
        //Hash the sent password, and compare it to the password stored in the user object
        var hashedPassword = helpers.hash(password);
        if (hashedPassword == userData.hashedPassword) {
          //if valid, create a new token with a random name, Set expiration date 1 hour in the future
          var tokenId = helpers.createRandomString(20);
          var expires = Date.now() + 1000 * 60 * 60;
          var tokenObject = {
            phone: phone,
            id: tokenId,
            expires: expires,
          };
          //Store the token
          _data.create("tokens", tokenId, tokenObject, function (err) {
            if (!err) {
              callback(200, tokenObject);
            } else {
              callback(500, { Error: "Could not create the new token" });
            }
          });
        } else {
          callback(400, {
            Error: "password did not matched the specified users's stored password",
          });
        }
      } else {
        callback(400, { Error: "Could not find the specified user" });
      }
    });
  } else {
    callback(400, { Error: "missing required field(s)" });
  }
};
//tokens - get
//Required data : id
//optional data: none
handlers._tokens.get = function (data, callback) {
  //check the id is valid
  var id = typeof data.queryStringObject.id == "string" && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
  if (id) {
    //lookup the token
    _data.read("tokens", id, function (err, tokenData) {
      if (!err && tokenData) {
        callback(200, tokenData);
      } else {
        callback(404);
      }
    });
  } else {
    callback(400, { Error: "Missing required field" });
  }
};
//tokens - put
//required data: id, extend
//Optional data: none
handlers._tokens.put = function (data, callback) {
  var id = typeof data.payload.id === "string" && data.payload.id.trim().length == 20 ? data.payload.id.trim() : false;
  var extend = typeof data.payload.extend === "boolean" && data.payload.extend == true ? true : false;
  if (id && extend) {
    //lookup the token
    _data.read("tokens", id, function (err, tokenData) {
      if (!err && tokenData) {
        //check to the make sure the token isn't already expired
        if (tokenData.expires > Date.now()) {
          //set the expiration and hour from now
          tokenData.expires = Date.now() + 1000 * 60 * 60;

          //Store the new updates
          _data.update("tokens", id, tokenData, function (err) {
            if (!err) {
              callback(200);
            } else {
              callback(500, {
                Error: "Could not update the token's expiration",
              });
            }
          });
        } else {
          callback(400, {
            Error: "the token has already expired, and cannot be extended",
          });
        }
      } else {
        callback(400, { Error: "specified token does not exist" });
      }
    });
  } else {
    callback(400, {
      Error: "Missing required field(s or field(s) are invalid",
    });
  }
};
//tokens - delete
//Required data: id
//optional data: none
handlers._tokens.delete = function (data, callback) {
  // Check that the id is valid
  var id = typeof data.queryStringObject.id == "string" && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
  if (id) {
    //lookup the token
    _data.read("tokens", id, function (err, data) {
      if (!err && data) {
        _data.delete("tokens", id, function (err) {
          if (!err) {
            callback(200);
          } else {
            callback(500, { Error: "Could not delete the sepecified token" });
          }
        });
      } else {
        callback(400, { Error: "Could not find the specified token" });
      }
    });
  } else {
    callback(400, { Error: "Missing required field" });
  }
};

//Verify if a given token id is currently valid for a given user.
handlers._tokens.verifyToken = function (id, phone, callback) {
  // Lookup the token
  _data.read("tokens", id, function (err, tokenData) {
    if (!err && tokenData) {
      //Check thaht the token is for the give user and has not expired
      if (tokenData.phone == phone && tokenData.expires > Date.now()) {
        callback(true);
      } else {
        callback(false);
      }
    } else {
      callback(false);
    }
  });
};

//Checks
handlers.checks = function (data, callback) {
  var acceptaleMethods = ["post", "get", "put", "delete"];
  if (acceptaleMethods.indexOf(data.method) > -1) {
    handlers._checks[data.method](data, callback);
  } else {
    callback(405);
  }
};
//Container  for all the checks methods

handlers._checks = {};

//checks - post
//required data: portocol, url, method, successCodes, timeoutSeconds
//optional data: none

handlers._checks.post = function (data, callback) {
  // validate inputs
  var protocol = typeof data.payload.protocol == "string" && ["https", "http"].indexOf(data.payload.protocol) > -1 ? data.payload.protocol : false;
  var url = typeof data.payload.url == "string" && data.payload.url.trim().length > 0 ? data.payload.url.trim() : false;
  var method = typeof data.payload.method == "string" && ["post", "get", "put", "delete"].indexOf(data.payload.method) > -1 ? data.payload.method : false;
  var successCodes = typeof data.payload.successCodes == "object" && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0 ? data.payload.successCodes : false;
  var timeoutSeconds =
    typeof data.payload.timeoutSeconds == "number" && data.payload.timeoutSeconds % 1 === 0 && data.payload.timeoutSeconds >= 1 && data.payload.timeoutSeconds <= 5
      ? data.payload.timeoutSeconds
      : false;
  console.log({ protocol, url, method, successCodes, timeoutSeconds });

  if (protocol && url && method && successCodes && timeoutSeconds) {
    // Get the token from the headers
    var token = typeof data.headers.token == "string" ? data.headers.token : false;

    //Looking the user by reading the token
    _data.read("tokens", token, function (err, tokenData) {
      if (!err && tokenData) {
        var userPhone = tokenData.phone;

        //Lookup the user data
        _data.read("users", userPhone, function (err, userData) {
          if (!err && userData) {
            var userChecks = typeof userData.checks == "object" && userData.checks instanceof Array ? userData.checks : [];
            //verify that the user has less than the number of max-checks-per-user
            if (userChecks.length < config.maxChecks) {
              //create a random id for the check
              var checkId = helpers.createRandomString(20);

              //Create the check object, and include the user's phone
              var checkObject = {
                id: checkId,
                userPhone,
                protocol,
                url,
                method,
                successCodes,
                timeoutSeconds,
              };

              //save the object
              _data.create("checks", checkId, checkObject, function (err) {
                if (!err) {
                  //Add the check id to the user's object
                  userData.checks = userChecks;
                  userData.checks.push(checkId);
                  // Save the new user data
                  _data.update("users", userPhone, userData, function (err) {
                    if (!err) {
                      //return the data about the new checks
                      callback(200, checkObject);
                    } else {
                      callback(500, {
                        Error: "could not update the user with the new check",
                      });
                    }
                  });
                } else {
                  callback(500, { Error: "Could not create the new check" });
                }
              });
            } else {
              callback(400, {
                Error: "the user already has the maxnum number of checks (" + config.maxChecks + ")",
              });
            }
          } else {
            callback(403);
          }
        });
      } else {
        callback(403);
      }
    });
  } else {
    callback(400, { Error: "Missing required inputs, or inputs are invalid" });
  }
};

//Checks - get
//require data: id
//optional data: none
handlers._checks.get = function (data, callback) {
  //Check that the id is valid
  var id = typeof data.queryStringObject.id == "string" && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
  if (id) {
    //Lookup the check
    _data.read("checks", id, function (err, checkData) {
      if (!err && checkData) {
        //Get the token from the headers
        var token = typeof data.headers.token == "string" ? data.headers.token : false;
        //Verify that the given token is valid and belongs to the user who created the check.
        handlers._tokens.verifyToken(token, checkData.userPhone, function (tokenIsValid) {
          if (tokenIsValid) {
            //Return the check data
            callback(200, checkData);
          } else {
            callback(403);
          }
        });
      } else {
        callback(404);
      }
    });
  } else {
    callback(400, { Error: "Missing required field" });
  }
};

//Checks - put
//required data : id
//optional data : protocol, url, method, successCodes, timeoutSeconds (one must be sent)
handlers._checks.put = function (data, callback) {
  //Check for the required field
  var id = typeof data.payload.id == "string" && data.payload.id.trim().length == 20 ? data.payload.id.trim() : false;

  //check for the optional fields
  var protocol = typeof data.payload.protocol == "string" && ["https", "http"].indexOf(data.payload.protocol) > -1 ? data.payload.protocol : false;
  var url = typeof data.payload.url == "string" && data.payload.url.trim().length > 0 ? data.payload.url.trim() : false;
  var method = typeof data.payload.method == "string" && ["post", "get", "put", "delete"].indexOf(data.payload.method) > -1 ? data.payload.method : false;
  var successCodes = typeof data.payload.successCodes == "object" && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0 ? data.payload.successCodes : false;
  var timeoutSeconds =
    typeof data.payload.timeoutSeconds == "number" && data.payload.timeoutSeconds % 1 === 0 && data.payload.timeoutSeconds >= 1 && data.payload.timeoutSeconds <= 5
      ? data.payload.timeoutSeconds
      : false;

  //Check to make sure id is valid
  if (id) {
    //Check to make sure one oro more optional fields has been sent
    if (protocol || url || method || successCodes || timeoutSeconds) {
      // Lookup the check
      _data.read("checks", id, function (err, checkData) {
        if (!err && checkData) {
          //Get the token rom the headers.
          var token = typeof data.headers.token == "string" ? data.headers.token : false;
          //Verify that the given token is valid and belongs to the user who created the check.
          handlers._tokens.verifyToken(token, checkData.userPhone, function (tokenIsValid) {
            if (tokenIsValid) {
              //Update the check where neces
              if (protocol) checkData.protocol = protocol;
              if (url) checkData.url = url;
              if (method) checkData.method = method;
              if (successCodes) checkData.successCodes = successCodes;
              if (timeoutSeconds) checkData.timeoutSeconds = timeoutSeconds;

              //store the new update
              _data.update("checks", id, checkData, function (err) {
                if (!err) {
                  callback(200);
                } else {
                  callback(500, { Error: "could not update the check" });
                }
              });
            } else {
              callback(403);
            }
          });
        } else {
          callback(400, { Error: "check ID did not exist" });
        }
      });
    } else {
      callback(400, { Error: "Missing fileds to update" });
    }
  } else {
    callback(400, { Error: "Missing required field" });
  }
};

//Checks - delete
//Required data: id
//Optional data: none

handlers._checks.delete = function (data, callback) {
  //check that  the id number is valid
  var id = typeof data.queryStringObject.id == "string" && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;

  if (id) {
    //Lookup the check
    _data.read("checks", id, function (err, checkData) {
      if (!err && checkData) {
        //Get the token from the headers
        var token = typeof data.headers.token == "string" ? data.headers.token : false;

        //Verify that the given is valid for the phone number
        handlers._tokens.verifyToken(token, checkData.userPhone, function (tokenIsValid) {
          if (tokenIsValid) {
            //delete the check data
            _data.delete("checks", id, function (err) {
              if (!err) {
                //lookup the user
                _data.read("users", checkData.userPhone, function (err, userData) {
                  if (!err && userData) {
                    var userChecks = typeof userData.checks == "object" && userData.checks instanceof Array ? userData.checks : [];
                    //Remove the delete check from the list of checks
                    var checkPosition = userChecks.indexOf(id);
                    if (checkPosition > -1) {
                      userChecks.splice(checkPosition, 1);
                      //Re-Save the user's data
                      _data.update("users", checkData.userPhone, userData, function (err) {
                        if (!err) {
                          callback(200);
                        } else {
                          callback(500, {
                            Error: "Could not update the user",
                          });
                        }
                      });
                    } else {
                      callback(500, {
                        Error: "Could not find the check on the users object, so could not removed",
                      });
                    }
                  } else {
                    callback(500, {
                      Error: "Could not find the user who created the check, so could not remove the check from the list of checks on the user object",
                    });
                  }
                });
              } else {
                callback(500, { Error: "Could not delete the check data" });
              }
            });
          } else {
            callback(403);
          }
        });
      } else {
        callback(400, { Error: "The specified check ID does not exist" });
      }
    });
  } else {
    callback(400, { Error: "Missing required field" });
  }
};

//ping handler
handlers.ping = function (data, callback) {
  callback(200);
};

//Not found hanlder
handlers.notFound = function (data, callback) {
  callback(404);
};

//Export the module
module.exports = handlers;
