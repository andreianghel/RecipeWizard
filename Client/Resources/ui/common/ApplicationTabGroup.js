/*
 * Titanium XMPP Client ( JSJac library rewritten with Titanium sockets and TCP connection)
 * @Author : Ionut-Gabriel Catrinescu
 * @2015
 */

/*var pWidth = Ti.Platform.displayCaps.platformWidth;
var pHeight = Ti.Platform.displayCaps.platformHeight;
Ti.App.SCREEN_WIDTH = (pWidth > pHeight) ? pHeight : pWidth;
Ti.App.SCREEN_HEIGHT = (pWidth > pHeight) ? pWidth : pHeight;*/
var JXMPP=require("xmpp/JXMPP");
var con = new JXMPP.Connection();
var roster;
var names ;
var self = Ti.UI.createTabGroup();
var ingredients;
var data = [];
var top=0;
var image = Ti.UI.createImageView({
	  image:'/images/pic.png',
	  
	height:"90",
	width:"90",
	});
	
var picker = Ti.UI.createPicker({
	 // top:0,
	  selectionIndicator:true,
	  color:'#333',
	  left:0,
	  
	  width: "100%",
	  backgroundColor:'#bebebe',
	});
var	win4,win1,loginBtn,logout ;	
var vi1= Ti.UI.createView({
	height:'90%',
	width:'100%',
	top:0,
	backgroundColor:'white',
	layout:'vertical',
	
});
Ti.API.info('Ti.Platform.displayCaps.platformWidth: ' + Ti.Platform.displayCaps.xdpi);

var vi2= Ti.UI.createView({
	height:'10%',
	width:'100%',
	bottom:0,
	backgroundColor:'#333',
	zIndex:0
});




var vi21= Ti.UI.createScrollView({
	height:'90%',
	width:'100%',
	top:0,
	backgroundColor:'white',
	layout:'vertical',
 	showVerticalScrollIndicator:true,
    showHorizontalScrollIndicator:true
});


var vi22= Ti.UI.createView({
	height:'10%',
	width:'100%',
	bottom:0,
	backgroundColor:'#333'
});



var add = Titanium.UI.createButton({
	    title:'Add',
	    width:90,
	    bottom:0,
	    height:35,
	    borderRadius:1,
	    font:{fontFamily:'Arial',fontWeight:'bold',fontSize:14},
	  
	});
var del_btn = Titanium.UI.createButton({
	    title:'Delete',
	    width:90,
	    height:35,
	    borderRadius:1,
	    font:{fontFamily:'Arial',fontWeight:'bold',fontSize:14}
	});

var width_aux= Titanium.Platform.displayCaps.xdpi*0.5;
var field=Ti.UI.createTextField({
		id:'field',
		color:'white',
	   
	    left:0,
	    width: '70%',
	    height:40,
	    hintText:'Chat',
	  	clearOnEdit : true,
	    borderRadius:2
});
function ApplicationTabGroup(Window) {
	//create module instance
	
	
	//create app tabs
var win2 = new Window();
win1 = new Window({
		layout:'vertical',
		color:'#EEEEEE',
		backgroundColor:'#EEEEEE',
	});	
var win3 = new Window();
win4= new Window();
	var username = Titanium.UI.createTextField({
	    color:'#333',
	  //  top:15,
	    width:300,
	    height:40,
	    hintText:'Username',
	    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
	    borderRadius:2
	 
	});
	win1.add(image);
	win1.add(username);
	 
	var password = Titanium.UI.createTextField({
	    color:'#333',
	   // top:35,
	    width:300,
	    height:40,
	    hintText:'Password',
	    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
	    passwordMask:true,
	    borderRadius:2
	});
	win1.add(password);
	 
    loginBtn = Titanium.UI.createButton({
	    title:'Login',
	    top:30,
	    width:90,
	    height:35,
	    borderRadius:1,
	    font:{fontFamily:'Arial',fontWeight:'bold',fontSize:14}
	});
	var send = Titanium.UI.createButton({
	    title:'Send',
	    //top:140,
	    right:0,
	    width:90,
	    height:35,
	    borderRadius:1,
	    font:{fontFamily:'Arial',fontWeight:'bold',fontSize:14}
	});
	
	 logout= Titanium.UI.createButton({
	    title:'Log Out',
	    //top:50,
	    width:90,
	    height:35,
	    borderRadius:1,
	    font:{fontFamily:'Arial',fontWeight:'bold',fontSize:14}
	});
	
	
	
	
	
	loginBtn.addEventListener('click', function() {
		login(username.getValue(),password.getValue());
		win1.add(logout);	
	});
	logout.addEventListener('click', function() {
		log_out();
		
	});
	
	add.addEventListener('click', function() {	
	;//	add_user(con,'brita@debian','Brita');
	});
	del_btn.addEventListener('click', function() {
	;//	del_user(con,'brita@debian');
	});
	send.addEventListener('click', function() {
	//	getRoster(con);
		if(field.getValue() !="")
			sendMsg("ionut.catrinescu@www",field.getValue());
		field.value-'';
		field.blur();
	});
	
	var tab1 = Ti.UI.createTab({
		title: L('home'),
		icon: '/images/KS_nav_ui.png',
		window: win1
	});
	win1.add(loginBtn);
	vi2.add(add);
	vi22.add(send);
	vi22.add(field);
	win2.add(vi1);
	win2.add(vi2);
	win3.add(vi21);
	win3.add(vi22);
	win1.containingTab = tab1;
	
	var tab2 = Ti.UI.createTab({
		title: 'friends',
		icon: '/images/KS_nav_views.png',
		window: win2
	});
	win2.containingTab = tab2;

var tab3 = Ti.UI.createTab({
		title: 'chat',
		icon: '/images/KS_nav_views.png',
		window: win3
	});
var tab4 = Ti.UI.createTab({
	title: 'Ingredients',
	icon: '/images/KS_nav_views.png',
	window: win4
});


	
	//win.open();

	// must be after picker has been displayed
	picker.setSelectedRow(0, 2, false); // select Mangos


	//win3.add(send);
	win3.containingTab=tab3;
	
	self.addTab(tab1);
	self.addTab(tab2);
	self.addTab(tab3);
	self.addTab(tab4);
	return self;
};

module.exports = ApplicationTabGroup;






var debug = function(a) {
	//	Ti.API.debug("Handled:" + a);
	};
	
	
function handleIQ(oIQ ) {
		var xml = oIQ.xml().toString();
		
		
		//ping responses
		if (xml.toString().indexOf('ping')!=-1){
			
			var iq = oIQ.clone();
			iq.setType('result');
			iq.setTo(con.host);
			iq.setFrom(con.username+"@"+con.domain+"/"+con.resource);
			iq.setID(oIQ.getID());
			con.send(iq);
		
		}
		
		else  //roster responses
		if (xml.indexOf("result")!=-1 && xml.indexOf('item' )!=-1  && xml.indexOf('error')===-1 ){
			roster = null;
			self.getTabs()[1].window.children[0].removeAllChildren();
			 roster = xml.split('<item');
			 names=xml.split('<item');
			for (var i = 1; i < roster.length; i++ ){
				
				names[i-1]	= names[i].substring(names[i].indexOf('name="')+6, names[i].indexOf('"',names[i].indexOf('name="')+6)  );
				roster[i-1]	= roster[i].substring(roster[i].indexOf('jid="')+5, roster[i].indexOf('"',roster[i].indexOf('jid="')+6)  );
				self.getTabs()[1].window.children[0].add(Ti.UI.createLabel({ color:'#333',id:i, 
																	text:roster[i-1].split("@")[0]}));
			}
		
			
			
			roster[roster.length-1]="";
			names[names.length-1]="";
		}
		//subsribe messages
		else if (xml.substring(xml.indexOf('type="')+6,xml.indexOf('type="')+9)==='set'
		 && xml.substring(xml.indexOf('subscription="')+6,xml.indexOf('subscription="')+9)==='to' ){
		
		}
		/*else //unsubscribe messages 
		if (){
			
			//TODO
			
		}*/
		//results ,errors and stuff
		else {
			Ti.API.warn("SOMETHING ELSE : "+xml);
			
		}
	};
	
function sendMsg(to,body) {
  
	    var oMsg = new JXMPP.Packet.Message();
	    oMsg.setTo(new JXMPP.JID(to));
	    oMsg.setType("chat");
	    oMsg.setBody(body);
	    
	    con.send(oMsg);
	    var view=Ti.UI.createLabel({ color:'#333',id:i,left:0,	text:"ME : "+body});
	  	self.getTabs()[2].window.children[0].add(view);
	    
	    
		};
function handleMessage(message) {
	//if (message.xml().toString().indexOf('paused')!=-1 ||message.xml().toString().indexOf('composing')!=-1 || message.xml().toString().indexOf('body')===-1  );
//	else{
		var from  = message.getFromJID().toString().substring(0,message.getFromJID().toString().indexOf("/"));
		var msg= message.xml().toString().substring(message.xml().toString().indexOf("<body>")+6,message.xml().toString().indexOf("</body>"));
	     var view = Ti.UI.createLabel({ color:'#333',id:i,right:0,backgroundColor:'#ffff99',	text:from+" : "+msg});
	  	self.getTabs()[2].window.children[0].add(view);
	//}
	  	};


function getRoster(con){
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
		if (!oJSJaCPacket.getType() && !oJSJaCPacket.getShow());
		//	Ti.API.info( oJSJaCPacket.getFromJID() + ' has become available.');
		else {
		//	Ti.API.info( oJSJaCPacket.getFromJID() +  ' has set his presence to');
			;
		}
		if (oJSJaCPacket.getType() === 'subscribe'
			&& oJSJaCPacket.getFromJID().toString().substring(
								0,
								oJSJaCPacket.getFromJID().toString().indexOf(
										"/") != con.jid.substring(0, con.jid
										.indexOf("/")))) {
		
		var presence = new JXMPP.Packet.Presence();
			presence.setTo(oJSJaCPacket.getFromJID().toString());
			presence.setFrom(con.jid);
			
			presence.setType('subscribed');
			presence.setStatus("Available");
			con.send(presence);
			add_user(con, oJSJaCPacket.getFromJID().toString(), oJSJaCPacket
					.getFromJID().toString().substring(0,
							oJSJaCPacket.getFromJID().toString().indexOf("@")));
			getRoster(con);
		
		}
		
		if (oJSJaCPacket.getType() === 'unsubscribe'
				&& oJSJaCPacket.getFromJID().toString()
						.substring(
								0,
								oJSJaCPacket.getFromJID().toString().indexOf(
										"/") != con.jid.substring(0, con.jid
										.indexOf("/")))) {
			
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
		Ti.API.error('we have an error'+ e.toString());
		if (con.connected())
			con.disconnect();
	};

function handleStatusChanged(status) {
	};

function handleConnected() {
		con.send(new JXMPP.Packet.Presence());
		getRoster(con);	
		/*self.getTabs()[0].window.children[0].visible=false;
		self.getTabs()[0].window.children[1].visible=false;
		self.getTabs()[0].window.children[2].visible=false;*/
		/*var win4= Ti.UI.createWindow({
			background:'white',
			width:'100%' ,
			height:'100%'
		});
		win4.add(log_out);
		self.getTabs()[0].window=win4;
		*/
	};

	

function handleIqVersion(iq) {
		var x=[iq.buildNode('name', 'jsjac_simpleclient'), 
				iq.buildNode('version', JXMPP.Version), 
				iq.buildNode('os', "navigator.userAgent")];
		var a=iq.reply(x);
		con.send(a);
		
		return true;
	};


function setupCon(oCon) {
		oCon.registerHandler('message', handleMessage);
		oCon.registerHandler('presence', handlePresence);
		oCon.registerHandler('iq', handleIQ);
		oCon.registerHandler('onconnect', handleConnected);
		oCon.registerHandler('onerror', debug);
		oCon.registerHandler('status_changed', debug);
		oCon.registerHandler('ondisconnect', debug);

		oCon.registerIQGet('query', JXMPP.CONSTANTS.NS_VERSION, handleIqVersion);
	};





function login(usr,pass){
	
	setupCon(con);
	
	// setup args for connect method 
 	oArgs = new Object();
	oArgs.host = "151.9.5.36";
	oArgs.domain = "www";
	
	//oArgs.username = "1";	
	oArgs.resource = 'JXMPP';
	//oArgs.pass = "1";
	oArgs.username=usr /*username.getValue()*/;
	oArgs.pass =pass /*password.getValue()*/;
	oArgs.register = false;
	con.connect(oArgs);
	 var url = "https://www.b2video.com/wsgi/schedule/?form=dummy!!dummy!!dummy!!dummy!!1@www!!dummy!!dummy!!dummy!!w!!dummy";
	 var client = Ti.Network.createHTTPClient({
	     // function called when the response data is available
	     onload : function(e) {
	        //("Received text: " + this.responseText);
	         alert("Ingredients list updated " /*+ this.responseText*/);
	         ingredients = this.responseText;
	         ingredients= ingredients.split(";");
	         var i = 0 ; 
	         for (i=0;i<ingredients.length;i++)
	        	 data[i]=Ti.UI.createPickerRow({title:ingredients[i]});
	         var label3 = Ti.UI.createLabel({
		        	text:"Ingrediente disponibile",
		        	backgroundColor:'#7a7a7a',
		        	color:"black",
		        	top:0,
		        	width:"100%",
		        	textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		        	height:40,
		        });
	        var label = Ti.UI.createLabel({
	        	text:"Ingrediente alese",
	        	backgroundColor:'#7a7a7a',
	        	color:"black",
	       
	        	width:"100%",
	        	textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
	        	height:40,
	        });
	        var label2 = Ti.UI.createLabel({
	        	text:"",
	       
	        	width:"auto"
	        });
	     	picker.add(data);
	     	picker.selectionIndicator = true;
	     	picker.addEventListener("change",function(e){
	     		var list = label2.text.split(";");
	     		var ok = 0 ; 
	     		for (i=0;i<list.length;i++)
	     			if (list[i]==e.row.title)
	     				{ok = 1;break;}
	     		if (ok==0)
	     			label2.text+=e.row.title+";";
	     	});
	     	
	     	win4.add(label3);
	     	win4.add(picker);
	     	win4.add(label);
	     	win4.add(label2);
	     	win1.remove(loginBtn);
	     	picker.setSelectedRow(0, 2, false);
	         
	     
	     },
	     // function called when an error occurs, including a timeout
	     onerror : function(e) {
	         Ti.API.debug(e.error);
	         alert('error');
	     },
	     timeout : 5000  // in milliseconds
	 });
	 // Prepare the connection.
	 client.open("GET", url);
	 // Send the request.
	 client.send();
	
	
	};
	
function log_out() {
		var presence = new JXMPP.Packet.Presence();
		presence.setType("unavailable");
		//con.send(presence);
		con.disconnect();
		alert("You are logged out!");
		win1.remove(logout);
		win1.add(loginBtn);
	//	win4=new Window();
		
};
var count = 50;
setInterval(function(e){
    vi21.scrollTo(0,count);
    count+=50;
},500);