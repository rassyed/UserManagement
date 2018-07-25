import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Members } from '../api/members.js';
import { Groups } from '../api/groups.js';
import './body.html';
import './groups.html';

Template.groups.onCreated(function () {
    Meteor.subscribe('groups');
    Meteor.subscribe('members');
});

Template.groups.helpers({
    getMember(memberId) {
        return Members.findOne({_id: memberId});
    },
    getGroups() {
        return Groups.find({});
    }
});