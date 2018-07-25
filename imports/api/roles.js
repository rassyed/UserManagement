import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Members } from './members.js';

export const Roles = new Mongo.Collection('roles');
if (Meteor.isServer) {
    // This code only runs on the server
    // Only publish roles that are public or belong to the current user
    Meteor.publish('roles', function rolesPublication() {
        return Roles.find({
            owner: this.userId
        });
    });
}

Meteor.methods({
    'roles.insert'(text) {
        check(text, String);

        // Make sure the user is logged in before inserting a task
        if (! Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }

        return Roles.insert({
            role: text,
            createdAt: new Date(),
            owner: Meteor.userId(),
            username: Meteor.user().username
        });
    },
    'roles.remove'(roleId) {
        check(roleId, String);
        const role = Roles.findOne(roleId);

        if (role.owner !== Meteor.userId()) {
            // If the task is private, make sure only the owner can delete it
            throw new Meteor.Error('not-authorized');
        }

        Roles.remove(roleId);
    }
});
