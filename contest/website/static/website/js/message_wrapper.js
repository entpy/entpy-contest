/**
 * 	Author: Ivan Torchio <i.torchio at entpy dot com>
 * 	Version: 0.1.0
 *
 * 	License: GPL_v3 {Link: http://gplv3.fsf.org/}
 *
 *	Permission is hereby granted, free of charge, to any person obtaining
 *	a copy of this software and associated documentation files (the
 *	"Software"), to deal in the Software without restriction, including
 *	without limitation the rights to use, copy, modify, merge, publish,
 *	distribute, sublicense, and/or sell copies of the Software, and to
 *	permit persons to whom the Software is furnished to do so, subject to
 *	the following conditions:
 *
 *	The above copyright notice and this permission notice shall be
 *	included in all copies or substantial portions of the Software.
 *
 *	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 *	EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 *	MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 *      NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 *      LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 *      OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 *      WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * 	- wrapper for messages
 *  	- require jquery
 */

var msgWrapper = {

	/* private vars {{{ */
	_msg_container_class : ".msgContainerAction",
	_msg_title_class : ".msgTitleAction",
	_msg_content_class : ".msgContentAction",
	_msg_extra_param_class : ".msgExtraParamAction",
	_msg_bottom_container_class : ".msgBottomContainerAction",
	_msg_icon_container_class : ".msgIconContainerAction",
	_msg_type : false,
	_msg_title : false,
	_msg_content : false,
	_msg_extra_param : false, 
	_msg_bottom_content : false, 
	_msg_icon : false,
	/* private vars }}} */

	// list of all message type availables
	// plz after adding a new type see "map_code_type_to_message" function
	msgTypeList : {
		successMsg : "success",
		errorMsg : "error",
		alertMsg : "alert",
		tipMsg : "tip",
	},

	// icons for message
	msgIconList : {
		"success" : "&#xf118;", // \f118,
		"error" : "&#xf119;", // \f119,
		"alert" : "&#xf071;", // \f071,
		"tip" : "&#xf19d;", // \f19d,
	},

	/* private get/set methods {{{ */
	setMsgType : function(val) {
		this._msg_type = val;
	},

	setMsgTitle : function(val) {
		this._msg_title = val;
	},

	setMsgContent : function(val) {
		this._msg_content = val;
	},

	setMsgExtraParam : function(val) {
		this._msg_extra_param = val;
	},

	setMsgBottomContent : function(val) {
		this._msg_bottom_content = val;
	},

	setMsgIcon : function(val) {
		this._msg_icon = val;
	},

	getMsgType : function() {
		return this._msg_type;
	},

	getMsgTitle : function() {
		return this._msg_title;
	},

	getMsgContent : function() {
		return this._msg_content;
	},

	getMsgExtraParam : function(val) {
		return this._msg_extra_param;
	},

	getMsgBottomContent : function(val) {
		return this._msg_bottom_content;
	},

	getMsgIcon : function(val) {
		return this._msg_icon;
	},
	/* private get/set methods }}} */

	removeTypeClass : function() {
		// method to remove all type class from message container

		$(this._msg_container_class).removeClass("success");
		$(this._msg_container_class).removeClass("error");
		$(this._msg_container_class).removeClass("alert");
		$(this._msg_container_class).removeClass("tip");
	},

	removeMessage : function() {
		// method to remove message and clean HTML

		this.removeTypeClass();
		this.setMsgType("");
		this.setMsgTitle("");
		this.setMsgContent("");
		this.setMsgExtraParam("");
		this.setMsgBottomContent("");
		this.setMsgIcon("");

		this.showMessage();
	},

	showMessage : function() {
		// method to show a loaded message into "this"

		this.removeTypeClass();
		$(this._msg_container_class).addClass(this.getMsgType());
		$(this._msg_title_class).html(this.getMsgTitle());
		$(this._msg_icon_container_class).html(this.getMsgIcon());
		$(this._msg_content_class).html(this.getMsgContent());
		$(this._msg_extra_param_class).html(this.getMsgExtraParam());
		$(this._msg_bottom_container_class).html(this.getMsgBottomContent());
	},

	testMessage : function() {
		// method to print a test message

		// parsing icon list JSON to array
		// var json_icon_list = JSON.parse(this.msgIconList);

		this.setMsgIcon(this.msgIconList[this.msgtypelist.tipmsg]);
		this.setMsgType(this.msgtypelist.tipmsg);
		this.setMsgTitle("Test title");
		this.setMsgContent("Test description");
		this.setMsgExtraParam("Test extra param");
		this.setMsgBottomContent("Test bottom content");
		this.showMessage();
	},

	showMessageEasy : function(msgType, msgTitle, msgDescription, msgExtraParam, msgBottomContent) {
		// method to show a custom message

		// WARNING: this must be a valid name: (success | error | alert | tip)
		if (msgType) {
			this.setMsgIcon(this.msgIconList[msgType]);
			this.setMsgType(msgType);
		}

		this.setMsgTitle(msgTitle);
		this.setMsgContent(msgDescription);
		this.setMsgExtraParam(msgExtraParam);
		this.setMsgBottomContent(msgBottomContent);
		this.showMessage();
	}
};
