/*
 * Titanium XMPP Client ( JSJac library rewritten with Titanium sockets and TCP connection)
 * @Author : Ionut-Gabriel Catrinescu
 * @2015
 */

/*var pWidth = Ti.Platform.displayCaps.platformWidth;
 var pHeight = Ti.Platform.displayCaps.platformHeight;
 Ti.App.SCREEN_WIDTH = (pWidth > pHeight) ? pHeight : pWidth;
 Ti.App.SCREEN_HEIGHT = (pWidth > pHeight) ? pWidth : pHeight;*/
var JXMPP = require("xmpp/JXMPP");
var con = new JXMPP.Connection();
var roster;
var names;
var self = Ti.UI.createTabGroup({navBarHidden:true,});
var ingredients;
var data = [];
var presences=[];
var top = 0;
var friend="";
var width_aux = Titanium.Platform.displayCaps.xdpi * 0.5;
var win4, win1,win2,win3, loginBtn, logout, regBtn,tab1,tab2,tab3,tab4,recipe;
var chats=[];
var fr_list=[];
var flag = 0 ;
var friend_lost="";
var recipes="";
var label3 = Ti.UI.createLabel({
	text : "Ingrediente disponibile",
	backgroundColor : 'black',
	color : "white",
	top : 0,
	width : "100%",
	textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
	height : 40,
});
var label = Ti.UI.createLabel({
	text : "Ingrediente alese",
	backgroundColor : '#7a7a7a',
	color : "black",

	width : "100%",
	textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
	height : 40,
});
var label2 = Ti.UI.createLabel({
	text : "",
	color:"red",
	width : "auto"
});
var title = Ti.UI.createLabel({
	text : "Recipe Wizard",
	backgroundColor : 'transparent',
	color : "white",
	top : 0,
	width : "100%",
	textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
	height : 50,
	 font:{
	      fontSize:40,
	      fontFamily: 'KaushanScript-Regular'
	   },
});
var chat_friend = Ti.UI.createLabel({
	text : "Recipe Wizard",
	backgroundColor : 'transparent',
	color : "white",
	top : 0,
	width : "100%",
	textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
	height : 20,
	 font:{
	      fontSize:16,
	      fontFamily: 'Arial'
	   },
});

var picker = Ti.UI.createPicker({
	// top:0,
	selectionIndicator : true,
	color : '#333',
	left : 0,

	width : "100%",
	backgroundGradient:{type:'linear',
		colors:['#af1f38','#eb1c24'], 
		startPoint:{x:0,y:0},
		endPoint:{x:2,y:50},
		backFillStart:false},
});

var send = Titanium.UI.createButton({
	title : 'Send',
	// top:140,
	right : 0,
	width : 90,
	height : 35,
	borderRadius : 1,
	font : {
		fontFamily : 'Arial',
		fontWeight : 'bold',
		fontSize : 14
	}
});

var vi1 = Ti.UI.createScrollView({
	height : '90%',
	width : '100%',
	top : 0,
	backgroundColor : 'black',
	layout : 'vertical',
	showVerticalScrollIndicator : true,
	showHorizontalScrollIndicator : true
});
var view_recipes = Ti.UI.createScrollView({
	height : '90%',
	width : '100%',
	top : 0,
	backgroundColor : 'black',
	layout : 'vertical',
	showVerticalScrollIndicator : true,
	showHorizontalScrollIndicator : true
});



Ti.API.info('Ti.Platform.displayCaps.platformWidth: ' + Ti.Platform.displayCaps.xdpi);

var vi2 = Ti.UI.createView({
	height : '10%',
	width : '100%',
	bottom : 0,
	backgroundColor : '#333',
	zIndex : 0
});

var vi21 = Ti.UI.createScrollView({
	height : '90%',
	width : '100%',
	top : 0,
	backgroundColor : 'black',
	layout : 'vertical',
	showVerticalScrollIndicator : true,
	showHorizontalScrollIndicator : true
});

var vi22 = Ti.UI.createView({
	height : '10%',
	width : '100%',
	bottom : 0,
	backgroundColor : '#333'
});

var add = Titanium.UI.createButton({
	title : 'Add',
	width : 90,
	bottom : 0,
	height : 35,
	borderRadius : 1,
	font : {
		fontFamily : 'Arial',
		fontWeight : 'bold',
		fontSize : 14
	},

});
var del_btn = Titanium.UI.createButton({
	title : 'Delete',
	width : 90,
	height : 35,
	borderRadius : 1,
	font : {
		fontFamily : 'Arial',
		fontWeight : 'bold',
		fontSize : 14
	}
});


var field = Ti.UI.createTextField({
	id : 'field',
	color : 'white',
	left : 0,
	width : '70%',
	height : 40,
	hintText : 'Chat',
	clearOnEdit : true,
	borderRadius : 2
});
var username = Titanium.UI.createTextField({
	color : '#333',
	borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
	top:20,
	width :'70%',
	height : 40,
	hintText : 'Username',
	textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
	borderRadius : 10,
	borderWidth: 2,
//	borderColor : "red",
	backgroundColor : '#EEEEEE',
});
var password = Titanium.UI.createTextField({
	color : '#333',
	borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
	top:15,
	width : "70%",
	height : 40,
	hintText : 'Password',
	textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
	passwordMask : true,
	borderRadius : 10,
	borderWidth: 2,
//	borderColor : "red",
	backgroundColor : '#EEEEEE',
});

var backbt=Titanium.UI.createButton({
	title : 'Back',
	top : 0,
	width : '100%',
	height : 35,
	borderRadius : 10,
	borderWidth: 2,
	backgroundGradient:{type:'linear',
		colors:['#af1f38','#eb1c24'], 
		startPoint:{x:0,y:0},
		endPoint:{x:2,y:50},
		backFillStart:false},
	font : {
		fontFamily : 'Arial',
		fontWeight : 'bold',
		fontSize : 14
	}
});

var history=Titanium.UI.createButton({
	title : 'History',
	top : 0,
	width : '100%',
	height : 35,
	borderRadius : 10,
	borderWidth: 2,
	backgroundGradient:{type:'linear',
		colors:['#af1f38','#eb1c24'], 
		startPoint:{x:0,y:0},
		endPoint:{x:2,y:50},
		backFillStart:false},
	font : {
		fontFamily : 'Arial',
		fontWeight : 'bold',
		fontSize : 14
	}
});

//app init function
function ApplicationTabGroup(Window) {
	// create module instance

	// create app tabs
    win2 = new Window({layout: "vertical",});
	win1 = Titanium.UI.createWindow({
		layout : 'vertical',
		color : '#EEEEEE',
		backgroundImage: '/images/ny.jpg',
		/*backgroundColor : '#EEEEEE',*/
	});
	Ti.UI.setBackgroundImage( '/images/ny.png' );
	win3 = new Window();
	win4 = new Window();
	
	win1.add(title);
	win1.add(username);

	
	win1.add(password);

	loginBtn = Titanium.UI.createButton({
		title : 'Login',
		top : 30,
		width : '70%',
		height : 35,
		borderRadius : 10,
		borderWidth: 2,
		backgroundGradient:{type:'linear',
			colors:['#af1f38','#eb1c24'], 
			startPoint:{x:0,y:0},
			endPoint:{x:2,y:50},
			backFillStart:false},
		font : {
			fontFamily : 'Arial',
			fontWeight : 'bold',
			fontSize : 14
		}
	});
	recipe = Titanium.UI.createButton({
		title : 'Make Recipe',
		top : 0,
		width : '100%',
		height : 35,
		borderRadius : 10,
		borderWidth: 2,
		backgroundGradient:{type:'linear',
			colors:['#af1f38','#eb1c24'], 
			startPoint:{x:0,y:0},
			endPoint:{x:2,y:50},
			backFillStart:false},
		font : {
			fontFamily : 'Arial',
			fontWeight : 'bold',
			fontSize : 14
		}
	});
	
	
	regBtn = Titanium.UI.createButton({
		title : 'Register',
		top : 30,
		width : '70%',
		height : 35,
		borderRadius : 10,
		borderWidth: 2,
		backgroundGradient:{type:'linear',
			colors:['#af1f38','#eb1c24'], 
			startPoint:{x:0,y:0},
			endPoint:{x:2,y:50},
			backFillStart:false},
		font : {
			fontFamily : 'Arial',
			fontWeight : 'bold',
			fontSize : 14
		}
	});
	

	logout = Titanium.UI.createButton({
		title : 'Log Out and Exit',
		 top:50,
		width : '60%',
		height : 35,
		borderRadius : 10,
		borderWidth: 2,
		backgroundGradient:{type:'linear',
			colors:['#af1f38','#eb1c24'], 
			startPoint:{x:0,y:0},
			endPoint:{x:2,y:50},
			backFillStart:false},
		font : {
			fontFamily : 'Arial',
			fontWeight : 'bold',
			fontSize : 14
		}
	});

	loginBtn.addEventListener('click', function() {
		if (flag==0){
			if(username.getValue().length>0 &&  password.getValue().length>0){	
				login(username.getValue(), password.getValue());
				flag=1;
			}else
				alert ("Please fill all fields");
		}
	});
	backbt.addEventListener('click', function() {
		self.getTabs()[3].window.removeAllChildren();
		view_recipes.removeAllChildren();
		win4.add(history);
		win4.add(label3);
		win4.add(picker);
		win4.add(recipe);
		win4.add(label);
		win4.add(label2);
		picker.setSelectedRow(0, 2, false);
		
		
	});
	
	history.addEventListener('click',function(){
		
		var url = "https://151.9.5.36/wsgi/mytest/?form=y!!"+con.jid.split("@")[0];
		
		var client = Ti.Network.createHTTPClient({
			// function called when the response data is available
			onload : function(e) {
				label2.text="";
				//alert(this.responseText);
				if (this.responseText!=null)
					recipes=this.responseText.toString().split("&&");
				else{
					alert ("No results found");
					return;
					
				}
				var i =0;
			for (i=0;i<recipes.length;i++)
			{
				if (recipes[i].length>0){
				var name = recipes[i].split("!!")[1];
				var qty=  recipes[i].split("!!")[2];
				var prep= recipes[i].split("!!")[3];
				var serv =recipes[i].split("!!")[4];
				
				
				var  fr = Ti.UI.createLabel({
					color : 'white',
					width:'80%',
					left:0,
					textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
					backgroundGradient:{type:'linear',
						colors:['#af1f38','#eb1c24'], 
						startPoint:{x:0,y:0},
						endPoint:{x:2,y:50},
						backFillStart:false},
					id : i,
					height:"60",
					text : name
				});
				
				var  bt = Ti.UI.createLabel({
					color : 'white',
					width:'20%',
					right:0,
					textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
					
					backgroundGradient:{type:'linear',
						colors:['#af1f38','#eaff24'], 
						startPoint:{x:0,y:0},
						endPoint:{x:2,y:50},
						backFillStart:false},
					id : i,
					height:"60",
					text : "Make it"
				});
				
				bt.addEventListener('click', function() {
					alert(name +"\nIngrediente:\n"+qty+"\nMod Preparare:\n"+prep+"\nServire:\n"+serv);
					
				});
				//populate the friends list
				var view = Ti.UI.createView({
					height : '60',
					width : '100%',
					bottom : 0,
					backgroundColor : '#333',
					zIndex : 0
				});

				view.add(fr);
				view.add(bt);
				view_recipes.add(view);
				
				
				}
			}
				//	
				self.getTabs()[3].window.removeAllChildren();
				self.getTabs()[3].window.add(backbt);
				self.getTabs()[3].window.add(view_recipes);
			},
			// function called when an error occurs, including a timeout
			onerror : function(e) {
				Ti.API.debug(e.error);
				alert('error');
			},
			timeout : 5000
		// in milliseconds
		});
		// Prepare the connection.
		client.open("GET", url);
		// Send the request.
		client.send();
		
			
	});
	recipe.addEventListener('click',function(){
		if (label2.text.length>0){
		var url = "https://151.9.5.36/wsgi/mytest/?form=w!!"+label2.text.split(";").join("[");
		
		var client = Ti.Network.createHTTPClient({
			// function called when the response data is available
			onload : function(e) {
				label2.text="";
				//alert(this.responseText);
				if (this.responseText!=null)
					recipes=this.responseText.toString().split("&&");
				else{
					alert ("No results found");
					return;
					
				}
				var i =0;
			for (i=0;i<recipes.length;i++)
			{
				if (recipes[i].length>0){
				var name = recipes[i].split("!!")[1];
				var qty=  recipes[i].split("!!")[2];
				var prep= recipes[i].split("!!")[3];
				var serv =recipes[i].split("!!")[4];
				
				
				var  fr = Ti.UI.createLabel({
					color : 'white',
					width:'80%',
					left:0,
					textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
					backgroundGradient:{type:'linear',
						colors:['#af1f38','#eb1c24'], 
						startPoint:{x:0,y:0},
						endPoint:{x:2,y:50},
						backFillStart:false},
					id : i,
					height:"60",
					text : name
				});
				
				var  bt = Ti.UI.createLabel({
					color : 'white',
					width:'20%',
					right:0,
					textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
					
					backgroundGradient:{type:'linear',
						colors:['#af1f38','#eaff24'], 
						startPoint:{x:0,y:0},
						endPoint:{x:2,y:50},
						backFillStart:false},
					id : i,
					height:"60",
					text : "Make it"
				});
				
				bt.addEventListener('click', function() {
					alert(name +"\nIngrediente:\n"+qty+"\nMod Preparare:\n"+prep+"\nServire:\n"+serv);
					var url2 = "https://151.9.5.36/wsgi/mytest/?form=h!!"+con.jid.split("@")[0]+"["+name;
					Ti.API.info(url2);
					var client = Ti.Network.createHTTPClient({
						// function called when the response data is available
						onload : function(e) {
							;//do nothing
						},
						// function called when an error occurs, including a timeout
						onerror : function(e) {
							Ti.API.debug(e.error);
							alert('eroare in salvare istoric');
						},
						timeout : 5000
					// in milliseconds
					});
					// Prepare the connection.
					client.open("GET", url2);
					// Send the request.
					client.send();
					
				});
				//populate the friends list
				var view = Ti.UI.createView({
					height : '60',
					width : '100%',
					bottom : 0,
					backgroundColor : '#333',
					zIndex : 0
				});

				view.add(fr);
				view.add(bt);
				view_recipes.add(view);
				
				
				}
			}
				//	
				self.getTabs()[3].window.removeAllChildren();
				self.getTabs()[3].window.add(backbt);
				self.getTabs()[3].window.add(view_recipes);
			},
			// function called when an error occurs, including a timeout
			onerror : function(e) {
				Ti.API.debug(e.error);
				alert('error');
			},
			timeout : 5000
		// in milliseconds
		});
		// Prepare the connection.
		client.open("GET", url);
		// Send the request.
		client.send();
		}else
			alert("Choose at least 1 ingredient");
			
	});
	
	
	

	regBtn.addEventListener('click', function() {
		if(username.getValue().length>0 &&  password.getValue().length>0){
			register(username.getValue(), password.getValue());
			win1.add(loginBtn);
		}else
			alert ("Please fill all fields");
	});

	logout.addEventListener('click', function() {
		log_out();

	});

	add.addEventListener('click', function() {
		;// add_user(con,'brita@debian','Brita');
	});
	del_btn.addEventListener('click', function() {
		;// del_user(con,'brita@debian');
	});
	send.addEventListener('click', function() {
		// getRoster(con);
		if (friend.length>0)
			if(field.getValue() != "")
				sendMsg(friend, field.getValue());
			else
				alert("Can't send am empty message");
		else 
			alert("Please select a friend first");
		field.value - '';
		field.blur();
	});

	 tab1 = Ti.UI.createTab({
		 width:"20%",
		icon : '/images/home.png',
		window : win1
	});

	 tab2 = Ti.UI.createTab({
		 width:"20%",
		icon : '/images/friends.png',
		window : win2
	});

	tab3 = Ti.UI.createTab({
		width:"20%",
		icon : '/images/chat.png',
		window : win3
	});
	tab4 = Ti.UI.createTab({
		width:"20%",
		icon : '/images/chef.png',
		window : win4
	});
	tab5 = Ti.UI.createTab({
		width:"20%",
		icon : '/images/mes.png',
		window : win4
	});
	
	win1.add(loginBtn);
	win1.add(regBtn);
	vi2.add(add);
	vi22.add(send);
	vi22.add(field);
	win2.add(vi1);
	win2.add(vi2);
	win3.add(vi21);
	win3.add(vi22);
	win1.containingTab = tab1;

	
	win2.containingTab = tab2;
	// must be after picker has been displayed
	picker.setSelectedRow(0, 2, false); 
	
	win3.containingTab = tab3;
	self.addTab(tab1);
	
	return self;
};

module.exports = ApplicationTabGroup;

var debug = function(a) {
	Ti.API.debug("Handled:" + a);
	
};

function handleIQ(oIQ) {
	var xml = oIQ.xml().toString();

	// ping responses
	if (xml.toString().indexOf('ping') != -1) {

		var iq = oIQ.clone();
		iq.setType('result');
		iq.setTo(con.host);
		iq.setFrom(con.username + "@" + con.domain + "/" + con.resource);
		iq.setID(oIQ.getID());
		con.send(iq);

	}

	else // roster responses
	if (xml.indexOf("result") != -1 && xml.indexOf('item') != -1 && xml.indexOf('error') === -1) {
		roster = null;
		self.getTabs()[1].window.children[0].removeAllChildren();
		roster = xml.split('<item');
		names = xml.split('<item');
		for (var i = 1; i < roster.length; i++) {

			names[i - 1] = names[i].substring(names[i].indexOf('name="') + 6, names[i].indexOf('"', names[i].indexOf('name="') + 6));
			roster[i - 1] = roster[i].substring(roster[i].indexOf('jid="') + 5, roster[i].indexOf('"', roster[i].indexOf('jid="') + 6));
			fr_list[i-1]=roster[i - 1].split("@")[0];
			chats[i-1]= Ti.UI.createScrollView({
			height : '90%',
			width : '100%',
			top : 0,
			backgroundColor : 'black',
			layout : 'vertical',
			showVerticalScrollIndicator : true,
			showHorizontalScrollIndicator : true
		});
			var separator = Ti.UI.createView({
				 
		        width:'100%',
		        height:1,
		        backgroundColor:'black',
		        bottom:0,
		 
		    });
			
			
			var  fr = Ti.UI.createLabel({
				color : 'white',
				width:'80%',
				left:0,
				textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
				backgroundGradient:{type:'linear',
					colors:['#af1f38','#eb1c24'], 
					startPoint:{x:0,y:0},
					endPoint:{x:2,y:50},
					backFillStart:false},
				id : i,
				height:"60",
				text : roster[i - 1].split("@")[0]
			});
			
			var  bt = Ti.UI.createLabel({
				color : 'white',
				width:'20%',
				right:0,
				textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
				backgroundImage: '/images/challange.png',
				backgroundGradient:{type:'linear',
					colors:['#af1f38','#eb1c24'], 
					startPoint:{x:0,y:0},
					endPoint:{x:2,y:50},
					backFillStart:false},
				id : i,
				height:"60",
				text : "ch"
			});
			
			fr.addEventListener('click', function() {
				friend=this.text+"@www";
				
				var id=0;
				for (var i = 0; i < fr_list.length; i++) {
					if (fr_list[i] == friend.split("@")[0]){
						id =i ; 
						break;
					}
				}
				//onclick ,add its coresponding view and title to chat 
	
				self.getTabs()[2].window.removeAllChildren();
				chat_friend.text = this.text;
				self.getTabs()[2].window.backgroundColor='black';
				self.getTabs()[2].window.add(chat_friend);
				separator.backgroundColor= 'white';
				self.getTabs()[2].window.add(separator);
				self.getTabs()[2].window.add(chats[id]);
				self.getTabs()[2].window.add(vi22);
				self.setActiveTab(2);
			});
			//populate the friends list
			var view = Ti.UI.createView({
				height : '60',
				width : '100%',
				bottom : 0,
				backgroundColor : '#333',
				zIndex : 0
			});

			view.add(fr);
			view.add(bt);
			
	
			self.getTabs()[1].window.children[0].add(view);
			self.getTabs()[1].window.children[0].add(separator);
		
		}

		roster[roster.length - 1] = "";
		names[names.length - 1] = "";
	}
	// subsribe messages
	else if (xml.substring(xml.indexOf('type="') + 6, xml.indexOf('type="') + 9) === 'set'
			&& xml.substring(xml.indexOf('subscription="') + 6, xml.indexOf('subscription="') + 9) === 'to') {

	}
	/*
	 * else //unsubscribe messages if (){
	 * 
	 * //TODO }
	 */
	// results ,errors and stuff
	else {
		Ti.API.warn("SOMETHING ELSE : " + xml);

	}
};

function sendMsg(to, body) {

	var oMsg = new JXMPP.Packet.Message();
	oMsg.setTo(new JXMPP.JID(to));
	oMsg.setType("chat");
	oMsg.setBody(body);

	con.send(oMsg);
	var view = Ti.UI.createLabel({
		color : 'white',
		id : i,
		left : 0,
		text : "ME : " + body
	});
	self.getTabs()[2].window.children[2].add(view);

};
function handleMessage(message) {

	var from = message.getFromJID().toString().substring(0, message.getFromJID().toString().indexOf("/"));
	var msg = message.xml().toString().substring(message.xml().toString().indexOf("<body>") + 6,
			message.xml().toString().indexOf("</body>"));
	
	var view = Ti.UI.createLabel({
		color : 'white',
		id : i,
		left : 0,
		text : from.split("@")[0] + " : \n" + msg
	});
	
	if (self.getTabs()[2].active==false){
		//change icon
		self.getTabs()[2].icon = '/images/alert.gif';
		friend_lost=from.split("@")[0];
	}
		
		var i =0;
		for (i=0;i<fr_list.length;i++)
			if (fr_list[i]==from.split("@")[0])
				chats[i].add(view);
	//self.getTabs()[2].window.children[2].add(view);
};

function getRoster(con) {
	var IQ = require("xmpp/JXMPPPacket");

	var rosterRequest = new IQ.JXMPPIQ();
	rosterRequest.setType('get');
	rosterRequest.setQuery(JXMPP.CONSTANTS.NS_ROSTER);
	con.send(rosterRequest);

};

function add_user(con, jid, name) {

	var IQ = require("xmpp/JXMPPPacket");
	var presence = new JXMPP.Packet.Presence();
	presence.setTo(jid);
	presence.setType('subscribe');
	presence.setStatus("Available");
	con.send(presence);
	var iq = new IQ.JXMPPIQ();
	iq.setType('set');
	iq.setFrom(con.jid);
	var query = iq.setQuery(JXMPP.CONSTANTS.NS_ROSTER);
	query.appendChild(iq.buildNode('item', {
		'xmlns' : JXMPP.CONSTANTS.NS_ROSTER,
		'jid' : jid,
		'name' : name
	}));

	con.send(iq);

	getRoster(con);
};

function del_user(con, jid) {
	var IQ = require("xmpp/JXMPPPacket");
	var iq = new IQ.JXMPPIQ();
	iq.setType('set');
	iq.setFrom(con.jid);
	var query = iq.setQuery(JXMPP.CONSTANTS.NS_ROSTER);
	query.appendChild(iq.buildNode('item', {
		'xmlns' : JXMPP.CONSTANTS.NS_ROSTER,
		'jid' : jid,
		'subscription' : 'remove'
	}));

	con.send(iq);
	getRoster(con);
};

function handlePresence(oJSJaCPacket) {
	if (!oJSJaCPacket.getType() && !oJSJaCPacket.getShow()){
	// Ti.API.info( oJSJaCPacket.getFromJID() + ' has become available.');
		var i= 0 ;
		var list = self.getTabs()[1].window.children[0].children;
		for (i= 0 ; i < list.length; i++){
			if (i%2==0)
				if (list[i].children[0].text==oJSJaCPacket.getFromJID().toString().split("@")[0] )
					if (oJSJaCPacket.xml().indexOf("Online")>0 || oJSJaCPacket.xml().indexOf("Away")>0 ){
						list[i].children[0].backgroundGradient={type:'linear',
								colors:['#17E32F','#64E373'], 
								startPoint:{x:0,y:0},
								endPoint:{x:2,y:50},
								backFillStart:false};
					}
		}				
	}
	else {
		 var i= 0 ;
			var list = self.getTabs()[1].window.children[0].children;
			for (i= 0 ; i < list.length; i++){
				if (i%2==0)
					if (list[i].children[0].text==oJSJaCPacket.getFromJID().toString().split("@")[0] )
							list[i].children[0].backgroundGradient={type:'linear',
									colors:['#af1f38','#eb1c24'], 
									startPoint:{x:0,y:0},
									endPoint:{x:2,y:50},
									backFillStart:false};
			}				
	}
	if (oJSJaCPacket.getType() === 'subscribe'
			&& oJSJaCPacket.getFromJID().toString().substring(0,
					oJSJaCPacket.getFromJID().toString().indexOf("/") != con.jid.substring(0, con.jid.indexOf("/")))) {

		var presence = new JXMPP.Packet.Presence();
		presence.setTo(oJSJaCPacket.getFromJID().toString());
		presence.setFrom(con.jid);

		presence.setType('subscribed');
		presence.setStatus("Available");
		con.send(presence);
		add_user(con, oJSJaCPacket.getFromJID().toString(), oJSJaCPacket.getFromJID().toString().substring(0,
				oJSJaCPacket.getFromJID().toString().indexOf("@")));
		getRoster(con);

	}

	if (oJSJaCPacket.getType() === 'unsubscribe'
			&& oJSJaCPacket.getFromJID().toString().substring(0,
					oJSJaCPacket.getFromJID().toString().indexOf("/") != con.jid.substring(0, con.jid.indexOf("/")))) {

		var presence = new JXMPP.Packet.Presence();
		presence.setTo(oJSJaCPacket.getFromJID().toString());
		presence.setFrom(con.jid);

		presence.setType('unsubscribed');
		presence.setStatus("Available");
		con.send(presence);
		getRoster(con);

		del_user(con, oJSJaCPacket.getFromJID().toString());
		getRoster(con);
	}

};

function handleError(e) {
	Ti.API.error('we have an error' + e.toString());
	if (con.connected())
		con.disconnect();
};

function handleStatusChanged(status) {
};

function handleConnected() {
	
	self.addTab(tab2);
	self.addTab(tab3);
	self.addTab(tab4);
	//self.addTab(tab5);
	self.getTabs()[2].addEventListener('focus',function(){
		var separator = Ti.UI.createView({
			 
	        width:'100%',
	        height:1,
	        backgroundColor:'black',
	        bottom:0,
	 
	    });
	    // change back to previous icon and show new chat
		if (self.getTabs()[2].icon == '/images/alert.gif'){
			self.getTabs()[2].icon = '/images/chat.png';
		friend= friend_lost+"@www";
		var i =0;
		for (i=0;i<fr_list.length;i++)
			if (fr_list[i]==friend.split("@")[0]){
				break;
			}
		self.getTabs()[2].window.removeAllChildren();
		chat_friend.text = friend;
		self.getTabs()[2].window.backgroundColor='black';
		self.getTabs()[2].window.add(chat_friend);
		separator.backgroundColor= 'white';
		self.getTabs()[2].window.add(separator);
		self.getTabs()[2].window.add(chats[i]);
		self.getTabs()[2].window.add(vi22);
		self.setActiveTab(2);
		}
		
	});	
	getRoster(con);
	win1.remove(loginBtn);
	win1.remove(regBtn);
	win1.remove(username);
	win1.remove(password);
	win1.add(logout);
	con.send(new JXMPP.Packet.Presence());
	var url = "https://151.9.5.36/wsgi/mytest/?form=r!!c";
	var client = Ti.Network.createHTTPClient({
		// function called when the response data is available
		onload : function(e) {
			
			alert("Ingredients list updated " /* + this.responseText*/ );
			ingredients = this.responseText;
			//ingredients = ingredients.split(";");
			ingredients = ingredients.split("(").join("").split(")").join("").split("'").join("").split(",");
			var i = 0;
			for (i = 0; i < ingredients.length; i++)
				data[i] = Ti.UI.createPickerRow({
					title : ingredients[i]
				});
			
			picker.add(data);
			picker.selectionIndicator = true;
			picker.addEventListener("change", function(e) {
				var list = label2.text.split(";");
				var ok = 0;
				for (i = 0; i < list.length; i++)
					if (list[i] == e.row.title) {
						ok = 1;
						break;
					}
				if (ok == 0)
					label2.text += e.row.title + ";";
			});

			win4.add(history);
			win4.add(label3);
			win4.add(picker);
			win4.add(recipe);
			win4.add(label);
			win4.add(label2);
			
			
		
			picker.setSelectedRow(0, 2, false);

		},
		// function called when an error occurs, including a timeout
		onerror : function(e) {
			Ti.API.debug(e.error);
			alert('error');
		},
		timeout : 5000
	// in milliseconds
	});
	// Prepare the connection.
	client.open("GET", url);
	// Send the request.
	client.send();
	
	
};

function handleIqVersion(iq) {
	var x = [ iq.buildNode('name', 'jsjac_simpleclient'), iq.buildNode('version', JXMPP.Version), iq.buildNode('os', "navigator.userAgent") ];
	var a = iq.reply(x);
	con.send(a);

	return true;
};

function onError(a) {

	alert("Error in connecting to server");
	flag=0;
	con.disconnect();
	con=new JXMPP.Connection();
}
function setupCon(oCon) {
	oCon.registerHandler('message', handleMessage);
	oCon.registerHandler('presence', handlePresence);
	oCon.registerHandler('iq', handleIQ);
	oCon.registerHandler('onconnect', handleConnected);
	oCon.registerHandler('onerror', onError);
	oCon.registerHandler('status_changed', debug);
	oCon.registerHandler('ondisconnect', debug);

	oCon.registerIQGet('query', JXMPP.CONSTANTS.NS_VERSION, handleIqVersion);
};

function login(usr, pass) {

	setupCon(con);

	oArgs = new Object();
	oArgs.host = "151.9.5.36";
	oArgs.domain = "www";

	oArgs.resource = 'JXMPP';

	oArgs.username = usr ;
	oArgs.pass = pass ;
	oArgs.register = false;
	con.connect(oArgs);
	

};

function register(usr, pass) {

	setupCon(con);

	oArgs = new Object();
	oArgs.host = "151.9.5.36";
	oArgs.domain = "www";

	
	oArgs.resource = 'JXMPP';
	
	oArgs.username = usr;
	oArgs.pass = pass ;
	oArgs.register = true;
	con.connect(oArgs);		
	win1.remove(regBtn);
	var url2 = "https://151.9.5.36/wsgi/mytest/?form=p!!"+usr+"["+pass;
	
	var client = Ti.Network.createHTTPClient({
		// function called when the response data is available
		onload : function(e) {
			;//do nothing
		},
		// function called when an error occurs, including a timeout
		onerror : function(e) {
			Ti.API.debug(e.error);
			alert('eroare inregistrare user');
		},
		timeout : 5000
	// in milliseconds
	});
	// Prepare the connection.
	client.open("GET", url2);
	// Send the request.
	client.send();
			
};

function log_out() {
	con.disconnect();
	var activity = Titanium.Android.currentActivity; activity.finish();
	
};

var count = 50;
setInterval(function(e) {
	vi21.scrollTo(0, count);
	count += 50;
}, 500);