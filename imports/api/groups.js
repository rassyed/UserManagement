import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Groups = new Mongo.Collection('groups');
if (Meteor.isServer) {
    // This code only runs on the server
    // Only publish groups that are public or belong to the current user
    Meteor.publish('groups', function groupsPublication() {
        return Groups.find({
            owner: this.userId
        });
    });
}

Meteor.methods({
    'groups.insert'(groupDetails) {
        check(groupDetails, Object);

        // Make sure the user is logged in before inserting a task
        if (! Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }

        return Groups.insert({
            name: groupDetails.name,
            users: groupDetails.users,
            createdAt: new Date(),
            owner: Meteor.userId(),
            username: Meteor.user().username,
        });
    },
    'groups.remove'(groupId) {
        check(groupId, String);
        const group = Groups.findOne(groupId);
        if (group.owner !== Meteor.userId()) {
            // If the task is private, make sure only the owner can delete it
            throw new Meteor.Error('not-authorized');
        }

        Groups.remove(groupId);
    },
    'groups.insertNewMembers'(details) {
        check(details, Object);

        // Make sure the user is logged in before inserting a task
        if (! Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }

        Groups.update({_id: details.groupId}, {
            $push: { users: { $each: details.newMembers} }
        });
    }
});
