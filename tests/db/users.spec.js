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
        role: "user",
      };

      // Act
      const user = await createUser(fakeUserData);

      // Assert
      expect(user).toBeDefined();
      expect(user.name).toBe(fakeUserData.name);
      expect(user.email).toBe(fakeUserData.email);
      expect(user.role).toBe(fakeUserData.role);
    });

    xit('does not return the password', async () => {
     
    const fakeUserData = {
        name: faker.person.fullName(),
        password: faker.internet.password(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: "user"
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
        role: "user",
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
        role: "user",
      };
      await createUser(fakeUserData);
      const user = await getUser({
        name: "Issac Newton",
        password: "Bad Password",
        email: faker.internet.email(),
        role: "user",
      });
      expect(user).toBeNull();
    });

    xit('does not return the password', async () => {
      const fakeUserData = {
        name: "Michael Jordan",
        password: faker.internet.password(),
        email: faker.internet.email(),
        role: "user",
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
        name: 'New Name',
        password: 'newpassword',
        email: 'newemail@example.com',
        role: 'user'
      };
  
      const updatedUser = await updateUser(updatedUserData.userId, updatedUserData, 'admin');
  
      expect(updatedUser).toBeDefined();
      expect(updatedUser.id).toBe(fakeUser.id);
      expect(updatedUser.name).toBe(updatedUserData.name);
      expect(updatedUser.email).toBe(updatedUserData.email);
      expect(updatedUser.role).toBe(updatedUserData.role);
    });
  
    xit('updates the name, password, or email as necessary', async () => {
      const fakeUser = await createFakeUser();

      const updatedUserData = {
        userId: fakeUser.id,
        name: faker.person.fullName(),
        password: faker.internet.password(),
        email: faker.internet.email(), 
      };
  
      const updatedUser = await updateUser(updatedUserData.userId, updatedUserData);

      expect(updatedUser).toBeDefined();
      expect(updatedUser.id).toBe(updatedUserData.userId);
      expect(updatedUser.name).toBe(updatedUserData.name);
      expect(updatedUser.email).toBe(updatedUserData.email);
    });
  
    xit('does not update fields that are not passed in', async () => {
      const fakeUser = await createFakeUser();
  
      const updatedUserData = {
        userId: fakeUser.id,
        name: faker.person.fullName(),
        email: fakeUser.email,
      };
  
      const updatedUser = await updateUser(updatedUserData.userId, updatedUserData);

      expect(updatedUser).toBeDefined();
      expect(updatedUser.id).toBe(updatedUserData.userId);
      expect(updatedUser.name).toBe(updatedUserData.name);
      expect(updatedUser.email).toBe(fakeUser.email); 
    });
  
    xit('only an "admin" can update role', async () => {
      const fakeUser = await createFakeUser();
    
      await expect(
        updateUser(
          fakeUser.id,
          { role: 'admin' }, 
          'user' 
        )
      ).rejects.toThrow("Could not update user: You do not have permission to update this user.");
    });
  
    xit('throws an error if user ID does not exist', async () => {
      const userData = {
        userId: 999999999,
        name: faker.person.fullName(),
        email: faker.internet.email(),
      };
  
      await expect(updateUser(userData.userId, userData)).rejects.toThrowError(
        `Could not update user: User with ID ${userData.userId} not found.`
      );
    });
  });

  describe('deleteUser', () => {
    xit('deletes a user if requester is admin', async () => {
      const adminUser = await createFakeUser({ role: 'admin' });
      const userToDelete = await createFakeUser();
    
      const result = await deleteUser(userToDelete.id, adminUser.role);
    
      expect(result).toBe(true);
    
      const deletedUser = await getUserById(userToDelete.id);
      expect(deletedUser).toBeNull();
    });
  
    xit('throws an error if requester is not an admin', async () => {
      const nonAdminUser = await createFakeUser({ role: 'user' });
      const userToDelete = await createFakeUser();
  
      await expect(deleteUser(userToDelete.id, nonAdminUser.role)).rejects.toThrowError(
        'Only admin users can delete users.'
      );
    });
  
    xit('throws an error if user ID does not exist', async () => {
      const adminUser = await createFakeUser({ role: 'admin' });
  
      await expect(deleteUser(9999999, adminUser.role)).rejects.toThrowError(
        'Could not delete user: User with ID 9999999 not found.'
      );
    });
  });
});