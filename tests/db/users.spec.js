/*

DO NOT CHANGE THIS FILE

*/
if (typeof TextEncoder === 'undefined') {
    global.TextEncoder = require('util').TextEncoder;
}
require("dotenv").config();
const bcrypt = require("bcrypt");
const faker = require("faker");
const client = require("../../db/client");
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
      const fakeUserData = createFakeUser();

      // Act
      const newUser = await createUser(fakeUserData);

      // Assert
      expect(newUser).toBeDefined();
      expect(newUser.name).toBe(fakeUserData.name);
      expect(newUser.email).toBe(fakeUserData.email);
      expect(newUser.role).toBe(fakeUserData.role);
    });

    xit('does not return the password', async () => {
     
      const fakeUserData = createFakeUser();

      const newUser = await createUser(fakeUserData);

      expect(newUser.password).toBeFalsy(); 
    });
  });

  describe('getUser', () => {
    xit('returns the user when the password verifies', async () => {
      
      const password = 'testPassword';
      const fakeUserData = createFakeUser({ password });
      await createUser(fakeUserData);

      const user = await getUser({ username: fakeUserData.username, password });

      expect(user).toBeDefined();
      expect(user.name).toBe(fakeUserData.name);
      expect(user.email).toBe(fakeUserData.email);
      expect(user.role).toBe(fakeUserData.role);
    });

    xit("does not return the user if the password doesn't verify", async () => {
    
      const correctPassword = 'testPassword';
      const incorrectPassword = 'wrongPassword';
      const fakeUserData = createFakeUser({ password: correctPassword });
      await createUser(fakeUserData);

      const user = await getUser({ username: fakeUserData.username, password: incorrectPassword });

      expect(user).toBeNull();
    });

    xit('does not return the password', async () => {

      const password = 'testPassword';
      const fakeUserData = createFakeUser({ password });
      await createUser(fakeUserData);

      const user = await getUser({ username: fakeUserData.username, password });

      expect(user.password).toBeFalsy();
    });
  });

  describe('getUserById', () => {
    xit('returns the user with matching ID', async () => {
      
      const fakeUserData = createFakeUser();
      const newUser = await createUser(fakeUserData);

      const user = await getUserById(newUser.id);

      expect(user).toBeDefined();
      expect(user.id).toBe(newUser.id);
    });

    xit('returns null if user ID does not exist', async () => {
      
      const user = await getUserById(12345);
      
      expect(user).toBeNull();
    });

    xit('does not return the password', async () => {
      
      const fakeUserData = createFakeUser();
      const newUser = await createUser(fakeUserData);

      const user = await getUserById(newUser.id);

      expect(user).toBeDefined();
      expect(user.password).toBeUndefined();
    });
  });

  describe('getUserByName', () => {
    xit('returns the user with matching name', async () => {
      
      const fakeUserData = createFakeUser();
      await createUser(fakeUserData);

      const user = await getUserByName(fakeUserData.name);

      expect(user).toBeDefined();
      expect(user.name).toBe(fakeUserData.name);
    });

    xit('returns null if username does not exist', async () => {
      const user = await getUserByName('nonexistinguser');

      expect(user).toBeNull();
    });

    xit('does not return the password', async () => {
        
      const fakeUserData = createFakeUser();
      await createUser(fakeUserData);
  
      const user = await getUserByName(fakeUserData.username);
  
      expect(user).toBeDefined();
      expect(user.password).toBeUndefined();
    });
  });

  describe('getUserByEmail', () => {
    xit('returns the user with matching email', async () => {
      
      const fakeUserData = createFakeUser();
      await createUser(fakeUserData);

      const user = await getUserByEmail(fakeUserData.email);

      expect(user).toBeDefined();
      expect(user.email).toBe(fakeUserData.email);
    });

    xit('returns null if email does not exist', async () => {
      
      const user = await getUserByEmail('nonexistingemail@example.com');

      expect(user).toBeNull();
    });
  });

  describe('updateUser', () => {
    xit('returns the updated user', async () => {
      
      const fakeUserData = createFakeUser();
      const newUser = await createUser(fakeUserData);

      const updatedUserData = {
        id: newUser.id,
        name: 'Updated Name',
        password: 'newPassword',
        email: 'updated@example.com',
        role: 'user'
      };

      const updatedUser = await updateUser(updatedUserData);

      expect(updatedUser).toBeDefined();
      expect(updatedUser.id).toBe(newUser.id);
      expect(updatedUser.name).toBe(updatedUserData.name);
      expect(updatedUser.email).toBe(updatedUserData.email);
      expect(updatedUser.role).toBe(updatedUserData.role);
    });

    xit('updates the name, password, or email as necessary', async () => {
      
      const fakeUserData = createFakeUser();
      const newUser = await createUser(fakeUserData);

      const updatedUserData = {
        id: newUser.id,
        name: 'Updated Name',
        password: 'newPassword',
        email: 'updated@example.com'
      };

      const updatedUser = await updateUser(updatedUserData);

      expect(updatedUser).toBeDefined();
      expect(updatedUser.id).toBe(newUser.id);
      expect(updatedUser.name).toBe(updatedUserData.name);
      expect(updatedUser.email).toBe(updatedUserData.email);
    });

    xit('does not update fields that are not passed in', async () => {
      
      const fakeUserData = createFakeUser();
      const newUser = await createUser(fakeUserData);

      const updatedUserData = {
        id: newUser.id,
        name: 'Updated Name'
      };

      const updatedUser = await updateUser(updatedUserData);

      expect(updatedUser).toBeDefined();
      expect(updatedUser.id).toBe(newUser.id);
      expect(updatedUser.name).toBe(updatedUserData.name);
      expect(updatedUser.email).toBe(newUser.email); 
      expect(updatedUser.role).toBe(newUser.role); 
    });

    xit('only an "admin" can update role', async () => {
      
      const adminUserData = createFakeUser({ role: 'admin' });
      const newUser = await createUser(adminUserData);

      const updatedUserData = {
        id: newUser.id,
        role: 'user'
      };

      const updatedUser = await updateUser(updatedUserData);

      expect(updatedUser).toBeDefined();
      expect(updatedUser.id).toBe(newUser.id);
      expect(updatedUser.role).toBe(updatedUserData.role);
    });

    xit('returns null if user ID does not exist', async () => {
      
      const fakeUserData = createFakeUser();
      const nonExistingUserId = 12345;

      const updatedUserData = {
        id: nonExistingUserId,
        name: 'Updated Name'
      };

      const updatedUser = await updateUser(updatedUserData);

      expect(updatedUser).toBeNull();
    });
  });

  describe('deleteUser', () => {
    it('removes a user so they cannot login', async () => {
      const fakeUserData = createFakeUser();
      const newUser = await createUser(fakeUserData);
  
      const deletedUser = await deleteUser(newUser.id, 'admin');
  
      expect(deletedUser).toBeTruthy();
  
      const user = await getUserById(newUser.id);
      expect(user).toBeNull();
    });
  
    it('returns false if user ID does not exist', async () => {
      const nonExistentUserId = -1; 
      const deletedUser = await deleteUser(nonExistentUserId, 'admin');

      expect(deletedUser).toBeFalsy();
    });
  
    it('returns false if non-admin user tries to delete', async () => {
      const fakeUserData = createFakeUser();
      const newUser = await createUser(fakeUserData);
  
      const deletedUser = await deleteUser(newUser.id, 'user');
  
      expect(deletedUser).toBeFalsy();
  
      const user = await getUserById(newUser.id);
      expect(user).toBeTruthy();
    });
  });


});