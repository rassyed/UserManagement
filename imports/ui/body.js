import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Members } from '../api/members.js';
import { Roles } from '../api/roles.js';
import { Groups } from '../api/groups.js';
import './body.html';
import './createUser.html';
import './createUser.js';
import './createRole.html';
import './createGroup.html';
import './createGroup.js';
import './groups.html';
import './groups.js';
import './addUserToGroup.html';
import './addUserToGroup.js';

Template.body.onCreated(function bodyOnCreated() {
    Meteor.subscribe('members');
    Meteor.subscribe('roles');
    Meteor.subscribe('groups');
});

Template.body.events({
    'click #createUser'() {
        $('.templateHolder').empty();
        Blaze.render(Template.createUser, $('.templateHolder').get(0));
    },
    'click #createRole'() {
        $('.templateHolder').empty();
        Blaze.render(Template.createRole, $('.templateHolder').get(0));
    },
    'click #createGroup'() {
        $('.templateHolder').empty();
        Blaze.render(Template.createGroup, $('.templateHolder').get(0));
    },
    'click #groups'() {
        $('.templateHolder').empty();
        Blaze.render(Template.groups, $('.templateHolder').get(0));
    },
    'submit .new-user'(event) {
        // Prevent default browser form submit
        event.preventDefault();

        // Get values from form element
        const userDetails = {
            firstName: $('#firstName').val(),
            lastName: $('#lastName').val(),
            gender: $("input[name='gender']:checked").val(),
            role: $('.userRole').val()
        };
        // Insert a member into the collection
        Meteor.call('members.insert', userDetails, function(error, result) {
            if (error) {
                alert(error);
            } else {
                // Clear form
                $('.templateHolder').empty();
            }
        });
    },
    'submit .new-role'(event) {
        // Prevent default browser form submit
        event.preventDefault();

        // Get values from form element
        const newRole = $('#newRole').val();
        // Insert a role into the collection
        Meteor.call('roles.insert', newRole, function(error, result) {
            if (error) {
                alert(error);
            } else {
                // Clear form
                $('.templateHolder').empty();
            }
        });
    },
    'submit .new-group'(event) {
        // Prevent default browser form submit
        event.preventDefault();

        // Get values from form element
        const members = $('input:checkbox:checked.groupMembers').map(function () {
            return this.value;
        }).get() || [];
        const groupDetails = {
            name: $('#groupName').val(),
            users: members
        };
        // Insert a group into the collection
        Meteor.call('groups.insert', groupDetails, function(error, result) {
            if (error) {
                alert(error);
            } else {
                // Clear form
                $('.templateHolder').empty();
            }
        });
    },
    'click .addNew'(event) {
        event.preventDefault();
        const groupId = event.target.id;
        $(event.currentTarget).hide();
        $('.addNewUserContainer').empty();
        Blaze.renderWithData(Template.addUserToGroup, {groupId: groupId}, $('.addNewUserContainer').get(0));
    },
    'submit .add-new-user'(event) {
        // Prevent default browser form submit
        event.preventDefault();

        // Get values from form element
        const newMembers = $('input:checkbox:checked.groupNewMembers').map(function () {
            return this.value;
        }).get() || [];
        const details = {
            groupId: event.target.id,
            newMembers: newMembers
        };
        if (newMembers.length > 0) {
            // Insert a new members into the collection
            Meteor.call('groups.insertNewMembers', details, function(error, result) {
                if (error) {
                    alert(error);
                } else {
                    // Clear form
                    $('.addNewUserContainer').empty();
                }
            });
        }
        $('.addNew').show();
    }
});
