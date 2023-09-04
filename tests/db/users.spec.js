/*

DO NOT CHANGE THIS FILE

*/
if (typeof TextEncoder === 'undefined') {
    global.TextEncoder = require('util').TextEncoder;
}
require("dotenv").config();
const { faker } = require('@faker-js/faker');
const bcrypt = require("bcrypt");
const {
    createUser,
    getUser,
    getUserById,
    getUserByName,
    getUserByEmail,
    updateUser,
    deleteUser
  } = require("../../db/models");
const { createFakeUser } = require("../helpers");

describe('User Database Functions', () => {
  describe('createUser', () => {
    xit('creates and returns a new user', async () => {
      // Arrange
      const fakeUserData = {
        name: "Horace Johnson",
        password: faker.internet.password(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      // Act
      const user = await createUser(fakeUserData);

      // Assert
      expect(user).toBeDefined();
      expect(user.name).toBe(fakeUserData.name);
      expect(user.email).toBe(fakeUserData.email);
    });

    xit('does not return the password', async () => {
     
    const fakeUserData = {
        name: faker.person.fullName(),
        password: faker.internet.password(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      const user = await createUser(fakeUserData);

      expect(user.password).toBeFalsy(); 
    });
  });

  describe('getUser', () => {
    xit('returns the user when the password verifies', async () => {
      const fakeUserData = {
        name: "Nicole Smith",
        password: faker.internet.password(),
        email: faker.internet.email(),
      };
      await createUser(fakeUserData);

      const user = await getUserByName(fakeUserData.name);

      expect(user).toBeDefined();
      expect(user.name).toBe(fakeUserData.name);
    });

    xit("does not return the user if the password doesn't verify", async () => {
      const fakeUserData = {
        name: "Issac Newton",
        password: faker.internet.password(),
        email: faker.internet.email(),
      };
      await createUser(fakeUserData);
      const user = await getUser({
        name: "Issac Newton",
        password: "Bad Password",
        email: faker.internet.email(),
      });
      expect(user).toBeNull();
    });

    xit('does not return the password', async () => {
      const fakeUserData = {
        name: "Michael Jordan",
        password: faker.internet.password(),
        email: faker.internet.email(),
      };
      await createUser(fakeUserData);

      const user = await getUser(fakeUserData);

      expect(user.password).toBeFalsy();
    });
  });

  describe('getUserById', () => {
    xit('returns the user with matching ID', async () => {
      
      const fakeUser = await createFakeUser("Jacob Hail");

      const user = await getUserById(fakeUser.id);

      expect(user).toBeDefined();
      expect(user.id).toBe(fakeUser.id);
    });

    xit('returns null if user ID does not exist', async () => {
      
      const user = await getUserById(12345);
      
      expect(user).toBeNull();
    });

    xit('does not return the password', async () => {
      
      const fakeUser = await createFakeUser("Jonathan Snell");
      const user = await getUserById(fakeUser.id);
      expect(user).toBeDefined();
      expect(user.password).toBeUndefined();
    });
  });

  describe('getUserByEmail', () => {
    xit('returns the user with matching email', async () => {
      const fakeUser = await createFakeUser({email: "jonathan.snell@example.com"});

      const user = await getUserByEmail(fakeUser.email);

      expect(user).toBeDefined();
      expect(user.email).toBe(fakeUser.email);
    });

    xit('returns null if email does not exist', async () => {
      
      const user = await getUserByEmail('nonexistingemail@example.com');

      expect(user).toBeNull();
    });

    xit("Does NOT return the password", async () => {
      const fakeUser = await createFakeUser({email: "tim.snell@example.com"});
      const user = await getUserByEmail(fakeUser.email);
      expect(user.password).toBeFalsy();
    });    
  });

  describe('updateUser', () => {
    xit('returns the updated user', async () => {
      const fakeUser = await createFakeUser();
      
      const updatedUserData = {
        userId: fakeUser.id,
        updatedFields: {
          name: 'New Name',
          password: 'newpassword',
          email: 'newemail@example.com',
        },
      };
  
      const updatedUser = await updateUser(updatedUserData);
  
      expect(updatedUser).toBeDefined();
      expect(updatedUser.id).toBe(fakeUser.id);
      expect(updatedUser.name).toBe(updatedUserData.updatedFields.name);
      expect(updatedUser.email).toBe(updatedUserData.updatedFields.email);
    });
  
    xit('updates the name, password, or email as necessary', async () => {
      const fakeUser = await createFakeUser();
      const updatedUserData = {
        userId: fakeUser.id,
        updatedFields: {
          name: faker.person.fullName(),
          password: faker.internet.password(),
          email: faker.internet.email(),
        } 
      };
    
      const updatedUser = await updateUser(updatedUserData);
      expect(updatedUser).toBeDefined();
      expect(updatedUser.id).toBe(fakeUser.id);
      expect(updatedUser.name).toBe(updatedUserData.updatedFields.name);
      expect(updatedUser.email).toBe(updatedUserData.updatedFields.email);
    });
  
    xit('does not update fields that are not passed in', async () => {
      const fakeUser = await createFakeUser();
  
      const updatedUserData = {
        userId: fakeUser.id,
        updatedFields: {
          name: faker.person.fullName(),
          email: faker.internet.email(),
        } 
      };
  
      const updatedUser = await updateUser(updatedUserData);

      expect(updatedUser).toBeDefined();
      expect(updatedUser.id).toBe(fakeUser.id);
      expect(updatedUser.name).toBe(updatedUserData.updatedFields.name);
      expect(updatedUser.email).toBe(updatedUserData.updatedFields.email); 
    });
  
    xit('throws an error if user ID does not exist', async () => {
      const userData = {
        userId: 999999999,
        updatedFields: {
          name: faker.person.fullName(),
          email: faker.internet.email(),
        } 
      };
  
      await expect(updateUser(userData)).rejects.toThrowError(
        `Could not update user: User with ID ${userData.userId} not found.`
      );
    });
  });

  describe('deleteUser', () => {
    xit('deletes a user', async () => {
      const userToDelete = await createFakeUser();
      const deletedUser = await deleteUser(userToDelete.id);
    
      expect(deletedUser).toBeDefined();
      expect(deletedUser.id).toBe(userToDelete.id);
      expect(deletedUser.name).toBe(userToDelete.name);
      expect(deletedUser.email).toBe(userToDelete.email);
    
      const getUser = await getUserById(userToDelete.id);
      expect(getUser).toBeNull();
    });
    
  
    xit('throws an error if user ID does not exist', async () => {
  
      await expect(deleteUser(9999999)).rejects.toThrowError(
        'Could not delete user: User with ID 9999999 not found.'
      );
    });
  });
});