## Questions

1. :question: What do we do in the `Server` and `UserController` constructors
to set up our connection to the development database?
2. :question: How do we retrieve a user by ID in the `UserController.getUser(String)` method?
3. :question: How do we retrieve all the users with a given age 
in `UserController.getUsers(Map...)`? What's the role of `filterDoc` in that
method?
4. :question: What are these `Document` objects that we use in the `UserController`? 
Why and how are we using them?
5. :question: What does `UserControllerSpec.clearAndPopulateDb` do?
6. :question: What's being tested in `UserControllerSpec.getUsersWhoAre37()`?
How is that being tested?
7. :question: Follow the process for adding a new user. What role do `UserController` and 
`UserRequestHandler` play in the process?

## Your Team's Answers

1. The server file sets up the mongo server. UserController manages any requests made for the
users.

2. The UserController.getUser(String) method looks in the Json file for a user theat matches
with the id given.

3. The UserController.getUsers(Map...) will look for the age box and see if anything is there.
If there is an int in the box UserController.getUsers(Map...) will look through the documents
for any files mathing that int. filterDoc is used to first create a new document, the once the
int for age is found it will paste the results on filterDoc.

4. The Document objects will take Json files and turn them into something java can read.
It is being used as a single location to put information like filter by name and age so java
looks at one spot.

5. This function testing populated people in function before testing it all.

6..getUsersWhoAre37 testing and find the user who is 37 with using HashMap and print out all the users who is 37,

7. addNewUser in UserController will get the information of the new user and just insert it
into the file of users. addNewUser in UserRequestHndler will turn the information given
into a visible format.
