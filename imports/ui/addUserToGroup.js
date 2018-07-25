import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Groups } from '../api/groups.js';
import './body.html';
import './addUserToGroup.html';
import { Members } from "../api/members.js";

Template.addUserToGroup.onCreated(function () {
    Meteor.subscribe('members');
    Meteor.subscribe('groups');
});

Template.addUserToGroup.helpers({
    getNewUsers(groupId) {
        const memberIds = Groups.findOne({_id: groupId}).users;
        return Members.find({_id: { $nin: memberIds } });
    },
    newUsersExists(groupId) {
        const memberIds = Groups.findOne({_id: groupId}).users;
        return Members.find({_id: { $nin: memberIds } }).count() > 0;
    }
});
