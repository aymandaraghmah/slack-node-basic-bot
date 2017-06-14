/**
 * Created by tahas on 6/9/17.
 */

"use strict";

const util = require('util');
import handleConversation from '../route_nlp.js';
import InteractTestIntent from './InteractTestIntent.js';

export default class InteractTestIntentCB {

	constructor() {
	}

	static registerInteractiveMsgHandler(slackInteractiveMessages, getClientByTeamId, apiai) {
		console.log("Test register Int Msg Handler");
		// Attach action handlers by `callback_id`
		slackInteractiveMessages.action(InteractTestIntent.getCallbackID(), (payload) => {
			console.log("Pay Wrong action Int Msg Handler");

			// `payload` is JSON that describes an interaction with a message.
			console.log("interact payload:::::: " + util.inspect(payload, {showHidden: false, depth: null}));
			console.log(`The user ${payload.user.name} in team ${payload.team.domain} `);

			const slackClient = getClientByTeamId(payload.team.id);

			// The `actions` array contains details about the particular action (button press, menu selection, etc.)
			const action = payload.actions[0];
			console.log(`The button had name ${action.name} and value ${action.value}`);

			// You should return a value which describes a message to replace the original.
			// Note that the payload contains a copy of the original message (`payload.original_message`).
			const replacement = payload.original_message;
			// Typically, you want to acknowledge the action and remove the interactive elements from the message
			delete replacement.attachments[0].actions;

			if (action.value === 'quick_reply') {
				replacement.text = "Quick Reply sent";

				let msgText = "Hi";
				let opts = {};
				handleConversation(apiai, slackClient, "Hello", payload.channel.id, payload.user.id);
				return null;
			}
			else if (action.value === 'quick_reply_update') {
				replacement.text = "";
				replacement.attachments[0].text="";
				let msgText = "Hello";
				let opts = {};

				handleConversation(apiai, slackClient, "Hello", payload.channel.id, payload.user.id);

				return replacement;
			}
			else {
				replacement.attachments[0].text="";
				replacement.text = "Just updated this msg";
				return replacement;
			}
		});
	}
}