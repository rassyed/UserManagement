import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Roles } from '../api/roles.js';
import './body.html';
import './createUser.html';

Template.createUser.onCreated(function () {
    Meteor.subscribe('roles');
});

Template.createUser.helpers({
    getRoles() {
        return Roles.find({});
    }
});