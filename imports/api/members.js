import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Members = new Mongo.Collection('members');
if (Meteor.isServer) {
    // This code only runs on the server
    // Only publish users that are public or belong to the current user
    Meteor.publish('members', function membersPublication() {
        return Members.find({
            owner: this.userId
        });
    });
}

Meteor.methods({
    'members.insert'(userDetails) {
        check(userDetails, Object);

        // Make sure the user is logged in before inserting a task
        if (! Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }

        return Members.insert({
            firstName: userDetails.firstName,
            lastName: userDetails.lastName,
            gender: userDetails.gender,
            role: userDetails.role,
            createdAt: new Date(),
            owner: Meteor.userId(),
            username: Meteor.user().username
        });
    },
    'members.remove'(memberId) {
        check(memberId, String);
        const member = Members.findOne(memberId);
        if (member.owner !== Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }

        Members.remove(memberId);
    }
});
