import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Roles } from '../api/members.js';
import './body.html';
import './createGroup.html';
import {Members} from "../api/members";

Template.createGroup.onCreated(function () {
    Meteor.subscribe('members');
});

Template.createGroup.helpers({
    getUsers() {
        return Members.find({});
    }
});