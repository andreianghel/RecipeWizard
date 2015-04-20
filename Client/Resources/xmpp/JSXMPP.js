Ti.include("crypt.js");
/**
 * list of forbidden chars for nodenames
 * @private
 */
var JXMPPJID_FORBIDDEN = ['"',' ','&','\'','/',':','<','>','@'];

/**
 * Creates a new JXMPPJID object
 * @class JXMPPJID models xmpp jid objects
 * @constructor
 * @param {Object} jid jid may be either of type String or a JID represented
 * by JSON with fields 'node', 'domain' and 'resource'
 * @throws JXMPPJIDInvalidException Thrown if jid is not valid
 * @return a new JXMPPJID object
 */
function JXMPPJID(jid) {
  /**
   *@private
   */
  this._node = '';
  /**
   *@private
   */
  this._domain = '';
  /**
   *@private
   */
  this._resource = '';

  if (typeof(jid) == 'string') {
    if (jid.indexOf('@') != -1) {
        this.setNode(jid.substring(0,jid.indexOf('@')));
        jid = jid.substring(jid.indexOf('@')+1);
    }
    if (jid.indexOf('/') != -1) {
      this.setResource(jid.substring(jid.indexOf('/')+1));
      jid = jid.substring(0,jid.indexOf('/'));
    }
    this.setDomain(jid);
  } else {
    this.setNode(jid.node);
    this.setDomain(jid.domain);
    this.setResource(jid.resource);
  }
}

/**
 * Gets the bare jid (i.e. the JID without resource)
 * @return A string representing the bare jid
 * @type String
 */
JXMPPJID.prototype.getBareJID = function() {
    return this.getNode()+'@'+this.getDomain();
};

/**
 * Gets the node part of the jid
 * @return A string representing the node name
 * @type String
 */
JXMPPJID.prototype.getNode = function() { return this._node; };

/**
 * Gets the domain part of the jid
 * @return A string representing the domain name
 * @type String
 */
JXMPPJID.prototype.getDomain = function() { return this._domain; };

/**
 * Gets the resource part of the jid
 * @return A string representing the resource
 * @type String
 */
JXMPPJID.prototype.getResource = function() { return this._resource; };


/**
 * Sets the node part of the jid
 * @param {String} node Name of the node
 * @throws JXMPPJIDInvalidException Thrown if node name contains invalid chars
 * @return This object
 * @type JXMPPJID
 */
JXMPPJID.prototype.setNode = function(node) {
  JXMPPJID._checkNodeName(node);
  this._node = node || '';
  return this;
};

/**
 * Sets the domain part of the jid
 * @param {String} domain Name of the domain
 * @throws JXMPPJIDInvalidException Thrown if domain name contains invalid
 * chars or is empty
 * @return This object
 * @type JXMPPJID
 */
JXMPPJID.prototype.setDomain = function(domain) {
  if (!domain || domain == '')
    throw new JXMPPJIDInvalidException("domain name missing");
  // chars forbidden for a node are not allowed in domain names
  // anyway, so let's check
  JXMPPJID._checkNodeName(domain);
  this._domain = domain;
  return this;
};

/**
 * Sets the resource part of the jid
 * @param {String} resource Name of the resource
 * @return This object
 * @type JXMPPJID
 */
JXMPPJID.prototype.setResource = function(resource) {
  this._resource = resource || '';
  return this;
};

/**
 * The string representation of the full jid
 * @return A string representing the jid
 * @type String
 */
JXMPPJID.prototype.toString = function() {
  var jid = '';
  if (this.getNode() && this.getNode() != '')
    jid = this.getNode() + '@';
  jid += this.getDomain(); // we always have a domain
  if (this.getResource() && this.getResource() != "")
    jid += '/' + this.getResource();
  return jid;
};

/**
 * Removes the resource part of the jid
 * @return This object
 * @type JXMPPJID
 */
JXMPPJID.prototype.removeResource = function() {
  return this.setResource();
};

/**
 * creates a copy of this JXMPPJID object
 * @return A copy of this
 * @type JXMPPJID
 */
JXMPPJID.prototype.clone = function() {
  return new JXMPPJID(this.toString());
};

/**
 * Compares two jids if they belong to the same entity (i.e. w/o resource)
 * @param {String} jid a jid as string or JXMPPJID object
 * @return 'true' if jid is same entity as this
 * @type Boolean
 */
JXMPPJID.prototype.isEntity = function(jid) {
  if (typeof jid == 'string')
	  jid = (new JXMPPJID(jid));
  jid.removeResource();
  return (this.clone().removeResource().toString() === jid.toString());
};

/**
 * Check if node name is valid
 * @private
 * @param {String} node A name for a node
 * @throws JXMPPJIDInvalidException Thrown if name for node is not allowed
 */
JXMPPJID._checkNodeName = function(nodeprep) {
    if (!nodeprep || nodeprep == '')
      return;
    for (var i=0; i< JXMPPJID_FORBIDDEN.length; i++) {
      if (nodeprep.indexOf(JXMPPJID_FORBIDDEN[i]) != -1) {
        throw new JXMPPJIDInvalidException("forbidden char in nodename: "+JXMPPJID_FORBIDDEN[i]);
      }
    }
};

/**
 * Creates a new Exception of type JXMPPJIDInvalidException
 * @class Exception to indicate invalid values for a jid
 * @constructor
 * @param {String} message The message associated with this Exception
 */
function JXMPPJIDInvalidException(message) {
  /**
   * The exceptions associated message
   * @type String
   */
  this.message = message;
  /**
   * The name of the exception
   * @type String
   */
  this.name = "JXMPPJIDInvalidException";
}

/********************************************************************************************************
*********************************************************************************************************/




/**
 * Creates a new packet with given root tag name (for internal use)
 * @class Somewhat abstract base class for all kinds of specialised packets
 * @param {String} name The root tag name of the packet
 * (i.e. one of 'message', 'iq' or 'presence')
 */
function JXMPPPacket(name) {
  /**
   * @private
   */
    this.name = name;
    this.doc = XmlDocument.create(name,'');
}

/**
 * Gets the type (name of root element) of this packet, i.e. one of
 * 'presence', 'message' or 'iq'
 * @return the top level tag name
 * @type String
 */
JXMPPPacket.prototype.pType = function() { return this.name; };

/**
 * Gets the associated Document for this packet.
 * @type {@link http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#i-Document Document}
 */
JXMPPPacket.prototype.getDoc = function() {
  return this.doc;
};
/**
 * Gets the root node of this packet
 * @type {@link http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#ID-1950641247 Node}
 */
JXMPPPacket.prototype.getNode = function() {
  if (this.getDoc() && this.getDoc().documentElement)
    return this.getDoc().documentElement;
  else
    return null;
};

/**
 * Sets the 'to' attribute of the root node of this packet
 * @param {String} to
 * @type JXMPPPacket
 */
JXMPPPacket.prototype.setTo = function(to) {
  if (!to || to == '')
    this.getNode().removeAttribute('to');
  else if (typeof(to) == 'string')
    this.getNode().setAttribute('to',to);
  else
    this.getNode().setAttribute('to',to.toString());
  return this;
};
/**
 * Sets the 'from' attribute of the root node of this
 * packet. Usually this is not needed as the server will take care
 * of this automatically.
 * @type JXMPPPacket
 */
JXMPPPacket.prototype.setFrom = function(from) {
  if (!from || from == '')
    this.getNode().removeAttribute('from');
  else if (typeof(from) == 'string')
    this.getNode().setAttribute('from',from);
  else
    this.getNode().setAttribute('from',from.toString());
  return this;
};
/**
 * Sets 'id' attribute of the root node of this packet.
 * @param {String} id The id of the packet.
 * @type JXMPPPacket
 */
JXMPPPacket.prototype.setID = function(id) {
  if (!id || id == '')
    this.getNode().removeAttribute('id');
  else
    this.getNode().setAttribute('id',id);
  return this;
};
/**
 * Sets the 'type' attribute of the root node of this packet.
 * @param {String} type The type of the packet.
 * @type JXMPPPacket
 */
JXMPPPacket.prototype.setType = function(type) {
  if (!type || type == '')
    this.getNode().removeAttribute('type');
  else
    this.getNode().setAttribute('type',type);
  return this;
};
/**
 * Sets 'xml:lang' for this packet
 * @param {String} xmllang The xml:lang of the packet.
 * @type JXMPPPacket
 */
JXMPPPacket.prototype.setXMLLang = function(xmllang) {
  if (!xmllang || xmllang == '')
    this.getNode().removeAttribute('xml:lang');
  else
    this.getNode().setAttribute('xml:lang',xmllang);
  return this;
};

/**
 * Gets the 'to' attribute of this packet
 * @type String
 */
JXMPPPacket.prototype.getTo = function() {
  return this.getNode().getAttribute('to');
};
/**
 * Gets the 'from' attribute of this packet.
 * @type String
 */
JXMPPPacket.prototype.getFrom = function() {
  return this.getNode().getAttribute('from');
};
/**
 * Gets the 'to' attribute of this packet as a JXMPPJID object
 * @type JXMPPJID
 */
JXMPPPacket.prototype.getToJID = function() {
  return new JXMPPJID(this.getTo());
};
/**
 * Gets the 'from' attribute of this packet as a JXMPPJID object
 * @type JXMPPJID
 */
JXMPPPacket.prototype.getFromJID = function() {
  return new JXMPPJID(this.getFrom());
};
/**
 * Gets the 'id' of this packet
 * @type String
 */
JXMPPPacket.prototype.getID = function() {
  return this.getNode().getAttribute('id');
};
/**
 * Gets the 'type' of this packet
 * @type String
 */
JXMPPPacket.prototype.getType = function() {
  return this.getNode().getAttribute('type');
};
/**
 * Gets the 'xml:lang' of this packet
 * @type String
 */
JXMPPPacket.prototype.getXMLLang = function() {
  return this.getNode().getAttribute('xml:lang');
};
/**
 * Gets the 'xmlns' (xml namespace) of the root node of this packet
 * @type String
 */
JXMPPPacket.prototype.getXMLNS = function() {
  return this.getNode().namespaceURI || this.getNode().getAttribute('xmlns');
};

/**
 * Gets a child element of this packet. If no params given returns first child.
 * @param {String} name Tagname of child to retrieve. Use '*' to match any tag. [optional]
 * @param {String} ns   Namespace of child. Use '*' to match any ns.[optional]
 * @return The child node, null if none found
 * @type {@link http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#ID-1950641247 Node}
 */
JXMPPPacket.prototype.getChild = function(name, ns) {
  if (!this.getNode()) {
    return null;
  }

  name = name || '*';
  ns = ns || '*';

  if (this.getNode().getElementsByTagNameNS) {
    return this.getNode().getElementsByTagNameNS(ns, name).item(0);
  }

  // fallback
  var nodes = this.getNode().getElementsByTagName(name);
  if (ns != '*') {
    for (var i=0; i<nodes.length; i++) {
      if (nodes.item(i).namespaceURI == ns || nodes.item(i).getAttribute('xmlns') == ns) {
        return nodes.item(i);
      }
    }
  } else {
    return nodes.item(0);
  }
  return null; // nothing found
};

/**
 * Gets the node value of a child element of this packet.
 * @param {String} name Tagname of child to retrieve.
 * @param {String} ns   Namespace of child
 * @return The value of the child node, empty string if none found
 * @type String
 */
JXMPPPacket.prototype.getChildVal = function(name, ns) {
  var node = this.getChild(name, ns);
  var ret = '';
  if (node && node.hasChildNodes()) {
    // concatenate all values from childNodes
    for (var i=0; i<node.childNodes.length; i++)
      if (node.childNodes.item(i).nodeValue)
        ret += node.childNodes.item(i).nodeValue;
  }
  return ret;
};

/**
 * Returns a copy of this node
 * @return a copy of this node
 * @type JXMPPPacket
 */
JXMPPPacket.prototype.clone = function() {
  return JXMPPPacket.wrapNode(this.getNode());
};

/**
 * Checks if packet is of type 'error'
 * @return 'true' if this packet is of type 'error', 'false' otherwise
 * @type boolean
 */
JXMPPPacket.prototype.isError = function() {
  return (this.getType() == 'error');
};

/**
 * Returns an error condition reply according to {@link http://www.xmpp.org/extensions/xep-0086.html XEP-0086}. Creates a clone of the calling packet with senders and recipient exchanged and error stanza appended.
 * @param {STANZA_ERROR} stanza_error an error stanza containing error cody, type and condition of the error to be indicated
 * @return an error reply packet
 * @type JXMPPPacket
 */
JXMPPPacket.prototype.errorReply = function(stanza_error) {
  var rPacket = this.clone();
  rPacket.setTo(this.getFrom());
  rPacket.setFrom();
  rPacket.setType('error');

  rPacket.appendNode('error',
                     {code: stanza_error.code, type: stanza_error.type},
                     [[stanza_error.cond, {xmlns: Constants.NS_STANZAS}]]);

  return rPacket;
};

/**
 * Returns a string representation of the raw xml content of this packet.
 * @type String
 */
JXMPPPacket.prototype.xml = function() {
  var xml = Titanium.XML.serializeToString(this.getNode()).replace(/\<\?xml.+\?\>/, "");
  return xml;
};


// PRIVATE METHODS DOWN HERE

/**
 * Gets an attribute of the root element
 * @private
 */
JXMPPPacket.prototype._getAttribute = function(attr) {
  return this.getNode().getAttribute(attr);
};


if (Titanium.XML.Document.ELEMENT_NODE == null) {
  Titanium.XML.Document.ELEMENT_NODE = 1;
  Titanium.XML.Document.ATTRIBUTE_NODE = 2;
  Titanium.XML.Document.TEXT_NODE = 3;
  Titanium.XML.Document.CDATA_SECTION_NODE = 4;
  Titanium.XML.Document.ENTITY_REFERENCE_NODE = 5;
  Titanium.XML.Document.ENTITY_NODE = 6;
  Titanium.XML.Document.PROCESSING_INSTRUCTION_NODE = 7;
  Titanium.XML.Document.COMMENT_NODE = 8;
  Titanium.XML.Document.DOCUMENT_NODE = 9;
  Titanium.XML.Document.DOCUMENT_TYPE_NODE = 10;
  Titanium.XML.Document.DOCUMENT_FRAGMENT_NODE = 11;
  Titanium.XML.Document.NOTATION_NODE = 12;
}


/**
 * import node into this packets document
 * @private
 */
JXMPPPacket.prototype._importNode = function(node, allChildren) {
  switch (node.nodeType) {
  case Titanium.XML.Document.ELEMENT_NODE:

  var newNode;
  //if (this.getDoc().createElementNS) {
  //  newNode = this.getDoc().createElementNS(node.namespaceURI, node.nodeName);
  //} else {
  newNode = this.getDoc().createElement(node.nodeName);
  //query.setAttribute('xmlns',xmlns); ???
  //}

  var i, il;
  /* does the node have any attributes to add? */
  if (node.attributes && node.attributes.length > 0)
    for (i = 0, il = node.attributes.length;i < il; i++) {
      var attr = node.attributes.item(i);
      if (attr.nodeName == 'xmlns' &&
          (newNode.getAttribute('xmlns') != null || newNode.namespaceURI)) {
          continue;
      }
      if (newNode.setAttributeNS && attr.namespaceURI) {
        newNode.setAttributeNS(attr.namespaceURI,
                               attr.nodeName,
                               attr.nodeValue);
      } else {
        newNode.setAttribute(attr.nodeName,
                             attr.nodeValue);
      }
    }
  /* are we going after children too, and does the node have any? */
  if (allChildren && node.childNodes && node.childNodes.length > 0) {
    for (i = 0, il = node.childNodes.length; i < il; i++) {
      newNode.appendChild(this._importNode(node.childNodes.item(i), allChildren));
    }
  }
  return newNode;
  break;
  case Titanium.XML.Document.TEXT_NODE:
  case Titanium.XML.Document.CDATA_SECTION_NODE:
  case Titanium.XML.Document.COMMENT_NODE:
  return this.getDoc().createTextNode(node.nodeValue);
  break;
  }
};

/**
 * Set node value of a child node
 * @private
 */
JXMPPPacket.prototype._setChildNode = function(nodeName, nodeValue) {
  var aNode = this.getChild(nodeName);
  var tNode = this.getDoc().createTextNode(nodeValue);
  if (aNode)
    try {
      aNode.replaceChild(tNode,aNode.firstChild);
    } catch (e) { }
  else {
    try {
    	
     Ti.API.log("xxxxxxxxxxxxx"+this.getNode().namespaceURI);	
      aNode = this.getDoc().createElementNS(this.getNode().namespaceURI,
                                            nodeName);
    } catch (ex) {
      aNode = this.getDoc().createElement(nodeName);
    }
    this.getNode().appendChild(aNode);
    aNode.appendChild(tNode);
  }
  return aNode;
};

/**
 * Builds a node using {@link
 * http://wiki.script.aculo.us/scriptaculous/show/Builder
 * script.aculo.us' Dom Builder} notation.
 * This code is taken from {@link
 * http://wiki.script.aculo.us/scriptaculous/show/Builder
 * script.aculo.us' Dom Builder} and has been modified to suit our
 * needs.<br/>
 * The original parts of the code do have the following copyright
 * and license notice:<br/>
 * Copyright (c) 2005, 2006 Thomas Fuchs (http://script.aculo.us,
 * http://mir.acu lo.us) <br/>
 * script.aculo.us is freely distributable under the terms of an
 * MIT-style licen se.  // For details, see the script.aculo.us web
 * site: http://script.aculo.us/<br>
 * @author Thomas Fuchs
 * @author Stefan Strigler
 * @return The newly created node
 * @type {@link http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#ID-1950641247 Node}
 */
JXMPPPacket.prototype.buildNode = function(elementName) {
	
  return new JXMPPBuilder().buildNode(this.getDoc(),
                                elementName,
                                arguments[1],
                                arguments[2],
                                arguments[3]);
};



/**
 * Appends node created by buildNode to this packets parent node.
 * @param {@link http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#ID-1950641247 Node} element The node to append or
 * @param {String} element A name plus an object hash with attributes (optional) plus an array of childnodes (optional)
 * @see #buildNode
 * @return This packet
 * @type JXMPPPacket
 */
JXMPPPacket.prototype.appendNode = function(element) {
  if (typeof element=='object') { // seems to be a prebuilt node
    return this.getNode().appendChild(element);
  } else { // build node
    return this.getNode().appendChild(this.buildNode(element,
                                                     arguments[1],
                                                     arguments[2],
                                                     this.getNode().namespaceURI));
  }
};


/**
 * A jabber/XMPP presence packet
 * @class Models the XMPP notion of a 'presence' packet
 * @extends JXMPPPacket
 */
function JXMPPPresence() {
  /**
   * @ignore
   */
  this.base = JXMPPPacket;
  this.base('presence');
}
JXMPPPresence.prototype = new JXMPPPacket;

/**
 * Sets the status message for current status. Usually this is set
 * to some human readable string indicating what the user is
 * doing/feel like currently.
 * @param {String} status A status message
 * @return this
 * @type JXMPPPacket
 */
JXMPPPresence.prototype.setStatus = function(status) {
  this._setChildNode("status", status);
  return this;
};
/**
 * Sets the online status for this presence packet.
 * @param {String} show An XMPP complient status indicator. Must
 * be one of 'chat', 'away', 'xa', 'dnd'
 * @return this
 * @type JXMPPPacket
 */
JXMPPPresence.prototype.setShow = function(show) {
  if (show == 'chat' || show == 'away' || show == 'xa' || show == 'dnd')
    this._setChildNode("show",show);
  return this;
};
/**
 * Sets the priority of the resource bind to with this connection
 * @param {int} prio The priority to set this resource to
 * @return this
 * @type JXMPPPacket
 */
JXMPPPresence.prototype.setPriority = function(prio) {
  this._setChildNode("priority", prio);
  return this;
};
/**
 * Some combined method that allowes for setting show, status and
 * priority at once
 * @param {String} show A status message
 * @param {String} status A status indicator as defined by XMPP
 * @param {int} prio A priority for this resource
 * @return this
 * @type JXMPPPacket
 */
JXMPPPresence.prototype.setPresence = function(show,status,prio) {
  if (show)
    this.setShow(show);
  if (status)
    this.setStatus(status);
  if (prio)
    this.setPriority(prio);
  return this;
};

/**
 * Gets the status message of this presence
 * @return The (human readable) status message
 * @type String
 */
JXMPPPresence.prototype.getStatus = function() {
  return this.getChildVal('status');
};
/**
 * Gets the status of this presence.
 * Either one of 'chat', 'away', 'xa' or 'dnd' or null.
 * @return The status indicator as defined by XMPP
 * @type String
 */
JXMPPPresence.prototype.getShow = function() {
  return this.getChildVal('show');
};
/**
 * Gets the priority of this status message
 * @return A resource priority
 * @type int
 */
JXMPPPresence.prototype.getPriority = function() {
  return this.getChildVal('priority');
};


/**
 * A jabber/XMPP iq packet
 * @class Models the XMPP notion of an 'iq' packet
 * @extends JXMPPPacket
 */
function JXMPPIQ() {
  /**
   * @ignore
   */
  this.base = JXMPPPacket;
  this.base('iq');
}
JXMPPIQ.prototype = new JXMPPPacket;

/**
 * Some combined method to set 'to', 'type' and 'id' at once
 * @param {String} to the recepients JID
 * @param {String} type A XMPP compliant iq type (one of 'set', 'get', 'result' and 'error'
 * @param {String} id A packet ID
 * @return this
 * @type JXMPPIQ
 */
JXMPPIQ.prototype.setIQ = function(to,type,id) {
  if (to)
    this.setTo(to);
  if (type)
    this.setType(type);
  if (id)
    this.setID(id);
  return this;
};
/**
 * Creates a 'query' child node with given XMLNS
 * @param {String} xmlns The namespace for the 'query' node
 * @return The query node
 * @type {@link  http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#ID-1950641247 Node}
 */
JXMPPIQ.prototype.setQuery = function(xmlns) {
  var query;
  query = this.getDoc().createElement('query');
  query.setAttribute('xmlns',xmlns);
  this.getNode().appendChild(query);
  return query;
};

/**
 * Gets the 'query' node of this packet
 * @return The query node
 * @type {@link  http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#ID-1950641247 Node}
 */
JXMPPIQ.prototype.getQuery = function() {
  return this.getNode().getElementsByTagName('query').item(0);
};
/**
 * Gets the XMLNS of the query node contained within this packet
 * @return The namespace of the query node
 * @type String
 */
JXMPPIQ.prototype.getQueryXMLNS = function() {
  if (this.getQuery()) {
    return this.getQuery().namespaceURI || this.getQuery().getAttribute('xmlns');
  } else {
    return null;
  }
};

/**
 * Creates an IQ reply with type set to 'result'. If given appends payload to first child if IQ. Payload maybe XML as string or a DOM element (or an array of such elements as well).
 * @param {Element} payload A payload to be appended [optional]
 * @return An IQ reply packet
 * @type JXMPPIQ
 */
JXMPPIQ.prototype.reply = function(payload) {
  var rIQ = this.clone();
  rIQ.setTo(this.getFrom());
  rIQ.setFrom();
  rIQ.setType('result');
  if (payload) {
    if (typeof payload == 'string')
      rIQ.getChild().appendChild(rIQ.getDoc().loadXML(payload));
    else if (payload.constructor == Array) {
      var node = rIQ.getChild();
      for (var i=0; i<payload.length; i++)
        if(typeof payload[i] == 'string')
          node.appendChild(rIQ.getDoc().loadXML(payload[i]));
        else if (typeof payload[i] == 'object')
          node.appendChild(payload[i]);
    }
    else if (typeof payload == 'object')
      rIQ.getChild().appendChild(payload);
  }
  return rIQ;
};

/**
 * A jabber/XMPP message packet
 * @class Models the XMPP notion of an 'message' packet
 * @extends JXMPPPacket
 */
function JXMPPMessage() {
  /**
   * @ignore
   */
  this.base = JXMPPPacket;
  this.base('message');
}
JXMPPMessage.prototype = new JXMPPPacket;

/**
 * Sets the body of the message
 * @param {String} body Your message to be sent along
 * @return this message
 * @type JXMPPMessage
 */
JXMPPMessage.prototype.setBody = function(body) {
  this._setChildNode("body",body);
  return this;
};
/**
 * Sets the subject of the message
 * @param {String} subject Your subject to be sent along
 * @return this message
 * @type JXMPPMessage
 */
JXMPPMessage.prototype.setSubject = function(subject) {
  this._setChildNode("subject",subject);
  return this;
};
/**
 * Sets the 'tread' attribute for this message. This is used to identify
 * threads in chat conversations
 * @param {String} thread Usually a somewhat random hash.
 * @return this message
 * @type JXMPPMessage
 */
JXMPPMessage.prototype.setThread = function(thread) {
  this._setChildNode("thread", thread);
  return this;
};
/**
 * Gets the 'thread' identifier for this message
 * @return A thread identifier
 * @type String
 */
JXMPPMessage.prototype.getThread = function() {
  return this.getChildVal('thread');
};
/**
 * Gets the body of this message
 * @return The body of this message
 * @type String
 */
JXMPPMessage.prototype.getBody = function() {
  return this.getChildVal('body');
};
/**
 * Gets the subject of this message
 * @return The subject of this message
 * @type String
 */
JXMPPMessage.prototype.getSubject = function() {
  return this.getChildVal('subject');
};


/**
 * Tries to transform a w3c DOM node to JXMPP's internal representation
 * (JXMPPPacket type, one of JXMPPPresence, JXMPPMessage, JXMPPIQ)
 * @param: {Node
 * http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#ID-1950641247}
 * node The node to be transformed
 * @return A JXMPPPacket representing the given node. If node's root
 * elemenent is not one of 'message', 'presence' or 'iq',
 * <code>null</code> is being returned.
 * @type JXMPPPacket
 */
JXMPPPacket.wrapNode = function(node) {
  var oPacket = null;

  switch (node.nodeName.toLowerCase()) {
  case 'presence':
      oPacket = new JXMPPPresence();
      break;
  case 'message':
      oPacket = new JXMPPMessage();
      break;
  case 'iq':
      oPacket = new JXMPPIQ();
      break;
  }

  if (oPacket) {
    oPacket.getDoc().replaceChild(oPacket._importNode(node, true),oPacket.getNode());
  }

  return oPacket;
};
exports.Packet = JXMPPPacket;
exports.Message = JXMPPMessage;
exports.Presence = JXMPPPresence;
exports.JXMPPIQ = JXMPPIQ;


/*********************************************************************************************************
*********************************************************************************************************/

/**
 * XmlDocument factory
 * @private
 */
function XmlDocument() {
}

XmlDocument.create = function(name, ns) {
	name = name || 'foo';
	ns = ns || '';

	try {
		// DOM2
		var baseDoc = Ti.XML.parseString("<a/>");
		var doc = baseDoc.implementation.createDocument(ns, name, null);
		if(!doc.documentElement || doc.documentElement.tagName != name || (doc.documentElement.namespaceURI && doc.documentElement.namespaceURI != ns)) {
			try {
				if(ns != '')
					doc.appendChild(doc.createElement(name)).setAttribute('xmlns', ns);
				else
					doc.appendChild(doc.createElement(name));
			} catch (dex) {
				doc = document.implementation.createDocument(ns, name, null);

				if(doc.documentElement == null)
					doc.appendChild(doc.createElement(name));

				if(ns != '' && doc.documentElement.getAttribute('xmlns') != ns) {
					doc.documentElement.setAttribute('xmlns', ns);
				}
			}
		}

		return doc;
	} catch (ex) {
		Ti.API.debug("Your browser does not support XmlDocument objects"+ex);
	}
	//throw new
};

/**
 * used to find the Automation server name
 * @private
 */
XmlDocument.getPrefix = function() {
	if(XmlDocument.prefix)
		return XmlDocument.prefix;

	var prefixes = ["MSXML2", "Microsoft", "MSXML", "MSXML3"];
	var o;
	for(var i = 0; i < prefixes.length; i++) {
		try {
			// try to create the objects
			o = new ActiveXObject(prefixes[i] + ".DomDocument");
			return XmlDocument.prefix = prefixes[i];
		} catch (ex) {
		};
	}

	throw new Error("Could not find an installed XML parser");
};

//module.exports = XmlDocument;

/*******************************************************************************************************
********************************************************************************************************/



/**
 * Creates a new Jabber connection (a connection to a jabber server)
 * @class Somewhat abstract base class for jabber connections. Contains all
 * of the code in common for all jabber connections
 * @constructor
 * @param {JSON http://www.json.org/index} oArg JSON with properties: <br>
 * * <code>httpbase</code> the http base address of the service to be used for
 * connecting to jabber<br>
 * * <code>oDbg</code> (optional) a reference to a debugger interface
 */

var Constants=require("JXMPPConstants");
//var JXMPPPacket = require('JXMPPPacket');
var JXMPPError = require('JXMPPError');




var JXMPP_HAVEKEYS = true;          // whether to use keys
var JXMPP_NKEYS    = 16;            // number of keys to generate
var JXMPP_INACTIVITY = 300;         // qnd hack to make suspend/resume 
var JXMPP_ERR_COUNT = 10;           // number of retries in case of connection
                                    // errors
var JXMPP_ALLOW_PLAIN = true;       // whether to allow plaintext logins
var JXMPP_CHECKQUEUEINTERVAL = 1;   // msecs to poll send queue
var JXMPP_CHECKINQUEUEINTERVAL = 1; // msecs to poll incoming queue
var JXMPP_TIMERVAL = 2000;          // default polling interval
var JXMPP_RETRYDELAY = 5000;        // msecs to wait before trying next request after error
/*** END CONFIG ***/


function JXMPPConnection(oArg) {

	
	if (oArg && oArg.allow_plain)
		/**
		 * @private
		 */
		this.allow_plain = oArg.allow_plain;
	else
		this.allow_plain = JXMPP_ALLOW_PLAIN;

	
	/**
	 * @private
	 */
	this._connected = false;

	/**
	 * @private
	 */
	this._autenticated = false;

	/**
	 * @private
	 */
	this._events = new Array();
	/**
	 * @private
	 */
	this._ID = 0;
	/**
	 * @private
	 */
	this._inQ = new Array();
	/**
	 * @private
	 */
	this._regIDs = new Array();
	/**
	 * @private
	 */
	this._req = null;
	/**
	 * @private
	 */
	this._status = 'intialized';
	/**
	 * @private
	 */
	this._errcnt = 0;
	/**
	 * @private
	 */
	this._sendRawCallbacks = new Array();

}

JXMPPConnection.prototype.connect = function(oArg) {
	this._setStatus('connecting');

	this.domain = oArg.domain || 'localhost';
	this.username = oArg.username;
	this.resource = oArg.resource;
	this.pass = oArg.pass;
	this.register = oArg.register;

	this.authhost = oArg.authhost || oArg.host || oArg.domain;
	this.authtype = oArg.authtype || 'sasl';

	if (oArg.xmllang && oArg.xmllang != '')
		this._xmllang = oArg.xmllang;
	else
		this._xmllang = 'en';

	this.host = oArg.host;
	this.port = oArg.port || 5222;
	if (oArg.secure)
		this.secure = 'true';
	else
		this.secure = 'false';

	if (oArg.wait)
		this._wait = oArg.wait;

	this.jid = this.username + '@' + this.domain;
	this.fulljid = this.jid + '/' + this.resource;

	that=this;
	// setupRequest must be done after rid is created but before first use in reqstr
	if (this._req == null) {
		try {
			this._req = Ti.Network.Socket.createTCP({
				host : this.host,
				port : this.port,
				connected : function(e) {
					//send initial request

					var reqstr = that._getInitialRequestString();
					Ti.API.debug(reqstr);

					e.socket.write(Ti.createBuffer({
						value : reqstr
					}));
					Ti.Stream.pump(e.socket, that._pumpCallback, 65536, true);

				},
				error : function(e) {
					Ti.API.error('Socket error');
				},
				closed : function(e) {
					Ti.API.error('Socket close');
				},
			});
			this._req.connect();
		} catch (e) {
			Ti.API.error('Error creating socket');
		}
	} else {
		Ti.API.error('Socket allredy connected');
	}


};

JXMPPConnection.prototype._getStreamID = function(streamData) {

	// extract stream id used for non-SASL authentication
	if (streamData.match(/id=[\'\"]([^\'\"]+)[\'\"]/))
		this.streamid = RegExp.$1;
	Ti.API.log("got streamid: " + this.streamid);

	this._connected = true;
	var doc;
	try {
		//var response = streamData + '</stream:stream>';
		doc = Ti.XML.parseString(streamData);

		if (!this._parseStreamFeatures(doc)) {
			this.authtype = 'nonsasl';
			return;
		}
	} catch(e) {
		Ti.API.error("Error loading XML: " + e.toString());
	}

	if (this.register)
		this._doInBandReg();
	else
		this._doAuth();

	this._autenticated = true;

};

JXMPPConnection.prototype._getSplitXml = function(response) {

	var xmls = new Array();
	//var reg = /<(message|iq|presence|stream|proceed|challenge|success|failure)(?=[\:\s\>])/gi;
	var reg = /<(message|iq|presence|proceed|challenge|success|failure)(?=[\:\s\>])/gi;
	var tags = response.split(reg);
	
	if(tags.length==1){  //not recognized tags
		xmls.push(tags[0]);
	}
	else{
		for ( a = 1; a < tags.length; a = a + 2) {
			xmls.push("<" + tags[a] + tags[(a + 1)]);
		}
	}
	return xmls;

}
													
JXMPPConnection.prototype._fixXmlToParse = function(response) {
	
	if(response.indexOf("<stream:stream")==0) {
				response+="</stream:stream>";
				Ti.API.log("fixed XML finish: " + response);
	}
	
	if(response.indexOf("<stream:features>")==0) {
				response="<stream:stream xmlns='jabber:client' xmlns:stream='http://etherx.jabber.org/streams' version='1.0'>"+response+"</stream:stream>";
				Ti.API.log("fixed XML: " + response);
	}
	return response;
}

JXMPPConnection.prototype._pumpCallback = function(e) {
	//that.oDbg.log("pumpCallback ...", 1);

	if (e.bytesProcessed == -1) {// EOF
		Ti.API.error("<EOF> - Can't perform any more operations on connected socket");
	} else if (e.errorDescription == null || e.errorDescription == "") {
		Ti.API.debug("DATA>>>: " + e.buffer.toString());
		var data = e.buffer.toString();
		
		//fix xml finish and prefix
		var response = data.replace(/\<\?xml.+\?\>/, "");
		if(response.indexOf("</stream:stream>")==0) {
			Ti.API.error("end connection XML: " + response);
			that._req.close();
			return;
		}

		if (that.autenticated()) {
			var xmls = that._getSplitXml(response);
			for ( i = 0; i < xmls.length; i++) {
				var xml = xmls[i];
				xml=that._fixXmlToParse(xml);
				Ti.API.log("_handleResponse: " + xml);
				that._handleResponse(xml);
			}
		} else {
			response=that._fixXmlToParse(response);
			that._getStreamID(response);
		}

	} else {
		Ti.API.error("READ ERROR: " + e.errorDescription);
	}
};

JXMPPConnection.prototype._getInitialRequestString = function() {
	var reqstr = "<stream:stream to='" + this.host + "' xmlns='jabber:client' xmlns:stream='http://etherx.jabber.org/streams' version='1.0'>";
	return reqstr;
};

/**
 * Tells whether this connection is connected
 * @return <code>true</code> if this connections is connected,
 * <code>false</code> otherwise
 * @type boolean
 */
JXMPPConnection.prototype.connected = function() {
	return this._connected;
};

JXMPPConnection.prototype.autenticated = function() {
	return this._autenticated;
};



/**
 * Disconnects from jabber server and terminates session (if applicable)
 */
JXMPPConnection.prototype.disconnect = function() {
	this._setStatus('disconnecting');

	if (!this.connected())
		return;
	this._connected = false;
	var request = '</stream:stream>';
	Ti.API.log("Disconnecting: " + request);
	this._sendRaw(request);
	this._handleEvent('ondisconnect');
};

/**
 * Registers an event handler (callback) for this connection.

 * <p>Note: All of the packet handlers for specific packets (like
 * message_in, presence_in and iq_in) fire only if there's no
 * callback associated with the id.<br>

 * <p>Example:<br/>
 * <code>con.registerHandler('iq', 'query', 'jabber:iq:version', handleIqVersion);</code>

 * @param {String} event One of

 * <ul>
 * <li>onConnect - connection has been established and authenticated</li>
 * <li>onDisconnect - connection has been disconnected</li>
 * <li>onResume - connection has been resumed</li>

 * <li>onStatusChanged - connection status has changed, current
 * status as being passed argument to handler. See {@link #status}.</li>

 * <li>onError - an error has occured, error node is supplied as
 * argument, like this:<br><code>&lt;error code='404' type='cancel'&gt;<br>
 * &lt;item-not-found xmlns='urn:ietf:params:xml:ns:xmpp-stanzas'/&gt;<br>
 * &lt;/error&gt;</code></li>

 * <li>packet_in - a packet has been received (argument: the
 * packet)</li>

 * <li>packet_out - a packet is to be sent(argument: the
 * packet)</li>

 * <li>message_in | message - a message has been received (argument:
 * the packet)</li>

 * <li>message_out - a message packet is to be sent (argument: the
 * packet)</li>

 * <li>presence_in | presence - a presence has been received
 * (argument: the packet)</li>

 * <li>presence_out - a presence packet is to be sent (argument: the
 * packet)</li>

 * <li>iq_in | iq - an iq has been received (argument: the packet)</li>
 * <li>iq_out - an iq is to be sent (argument: the packet)</li>
 * </ul>

 * @param {String} childName A childnode's name that must occur within a
 * retrieved packet [optional]

 * @param {String} childNS A childnode's namespace that must occure within
 * a retrieved packet (works only if childName is given) [optional]

 * @param {String} type The type of the packet to handle (works only if childName and chidNS are given (both may be set to '*' in order to get skipped) [optional]

 * @param {Function} handler The handler to be called when event occurs. If your handler returns 'true' it cancels bubbling of the event. No other registered handlers for this event will be fired.
 */
JXMPPConnection.prototype.registerHandler = function(event) {
	event = event.toLowerCase();
	// don't be case-sensitive here
	var eArg = {
		handler : arguments[arguments.length - 1],
		childName : '*',
		childNS : '*',
		type : '*'
	};
	if (arguments.length > 2)
		eArg.childName = arguments[1];
	if (arguments.length > 3)
		eArg.childNS = arguments[2];
	if (arguments.length > 4)
		eArg.type = arguments[3];
	if (!this._events[event])
		this._events[event] = new Array(eArg);
	else
		this._events[event] = this._events[event].concat(eArg);

	// sort events in order how specific they match criterias thus using
	// wildcard patterns puts them back in queue when it comes to
	// bubbling the event
	this._events[event] = this._events[event].sort(function(a, b) {
		var aRank = 0;
		var bRank = 0;
		with (a) {
			if (type == '*')
				aRank++;
			if (childNS == '*')
				aRank++;
			if (childName == '*')
				aRank++;
		}
		with (b) {
			if (type == '*')
				bRank++;
			if (childNS == '*')
				bRank++;
			if (childName == '*')
				bRank++;
		}
		if (aRank > bRank)
			return 1;
		if (aRank < bRank)
			return -1;
		return 0;
	});
	Ti.API.info("registered handler for event '" + event + "'");
};

JXMPPConnection.prototype.unregisterHandler = function(event, handler) {
	event = event.toLowerCase();
	// don't be case-sensitive here

	if (!this._events[event])
		return;

	var arr = this._events[event], res = new Array();
	for (var i = 0; i < arr.length; i++)
		if (arr[i].handler != handler)
			res.push(arr[i]);

	if (arr.length != res.length) {
		this._events[event] = res;
		Ti.API.info("unregistered handler for event '" + event + "'");
	}
};

/**
 * Register for iq packets of type 'get'.
 * @param {String} childName A childnode's name that must occur within a
 * retrieved packet

 * @param {String} childNS A childnode's namespace that must occure within
 * a retrieved packet (works only if childName is given)

 * @param {Function} handler The handler to be called when event occurs. If your handler returns 'true' it cancels bubbling of the event. No other registered handlers for this event will be fired.
 */
JXMPPConnection.prototype.registerIQGet = function(childName, childNS, handler) {
	this.registerHandler('iq', childName, childNS, 'get', handler);
};

/**
 * Register for iq packets of type 'set'.
 * @param {String} childName A childnode's name that must occur within a
 * retrieved packet

 * @param {String} childNS A childnode's namespace that must occure within
 * a retrieved packet (works only if childName is given)

 * @param {Function} handler The handler to be called when event occurs. If your handler returns 'true' it cancels bubbling of the event. No other registered handlers for this event will be fired.
 */
JXMPPConnection.prototype.registerIQSet = function(childName, childNS, handler) {
	this.registerHandler('iq', childName, childNS, 'set', handler);
};

/**
 * Sends a JXMPPPacket
 * @param {JXMPPPacket} packet  The packet to send
 * @param {Function}    cb      The callback to be called if there's a reply
 * to this packet (identified by id) [optional]
 * @param {Object}      arg     Arguments passed to the callback
 * (additionally to the packet received) [optional]
 * @return 'true' if sending was successfull, 'false' otherwise
 * @type boolean
 */
JXMPPConnection.prototype.send = function(packet, cb, arg) {
	if (!packet || !packet.pType) {
		Ti.API.error("no packet: " + packet);
		return false;
	}

	if (!this.connected())
		return false;

	// if (this._xmllang && !packet.getXMLLang())
	//   packet.setXMLLang(this._xmllang);

	// remember id for response if callback present
	if (cb) {
		// generate an ID
		if (!packet.getID()){
			packet.setID('JXMPPID_' + this._ID++);
		}

		// register callback with id
		this._registerPID(packet.getID(), cb, arg);
	}

	try {
		this._handleEvent(packet.pType() + '_out', packet);
		this._handleEvent("packet_out", packet);

		Ti.API.info("Send IQ:" + packet.xml());
		this._sendRaw(packet.xml());
	} catch (e) {
		Ti.API.error("Error sendig ID:"+e.toString());
		return false;
	}

	return true;
};

/**
 * Sends an IQ packet. Has default handlers for each reply type.
 * Those maybe overriden by passing an appropriate handler.
 * @param {JXMPPIQPacket} iq - the iq packet to send
 * @param {Object} handlers - object with properties 'error_handler',
 *                            'result_handler' and 'default_handler'
 *                            with appropriate functions
 * @param {Object} arg - argument to handlers
 * @return 'true' if sending was successfull, 'false' otherwise
 * @type boolean
 */
JXMPPConnection.prototype.sendIQ = function(iq, handlers, arg) {
	if (!iq || iq.pType() != 'iq') {
		return false;
	}

	handlers = handlers || {};
	var error_handler = handlers.error_handler || function(aIq) {
		Ti.API.error(aIq.xml());
	};

	var result_handler = handlers.result_handler || function(aIq) {
		Ti.API.info(aIq.xml());
	};

	var iqHandler = function(aIq, arg) {
		switch (aIq.getType()) {
			case 'error':
				error_handler(aIq);
				break;
			case 'result':
				result_handler(aIq, arg);
				break;
		}
	};
	return this.send(iq, iqHandler, arg);
};

/**
 * Returns current status of this connection
 * @return String to denote current state. One of
 * <ul>
 * <li>'initializing' ... well
 * <li>'connecting' if connect() was called
 * <li>'resuming' if resume() was called
 * <li>'processing' if it's about to operate as normal
 * <li>'onerror_fallback' if there was an error with the request object
 * <li>'protoerror_fallback' if there was an error at the http binding protocol flow (most likely that's where you interested in)
 * <li>'internal_server_error' in case of an internal server error
 * <li>'suspending' if suspend() is being called
 * <li>'aborted' if abort() was called
 * <li>'disconnecting' if disconnect() has been called
 * </ul>
 * @type String
 */
JXMPPConnection.prototype.status = function() {
	return this._status;
};

/**
 * @private
 */
JXMPPConnection.prototype._abort = function() {
	this._connected = false;
	this._setStatus('aborted');
	this._req.close();
	Ti.API.error("Disconnected.");
	this._handleEvent('ondisconnect');
	this._handleEvent('onerror', JXMPPError.create('500', 'cancel', 'service-unavailable'));
};

/**
 * @private
 */
JXMPPConnection.prototype._checkInQ = function() {
	for (var i = 0; i < this._inQ.length && i < 10; i++) {
		var item = this._inQ[0];
		this._inQ = this._inQ.slice(1, this._inQ.length);
		var packet = JXMPPPacket.Packet.wrapNode(item);

		if (!packet)
			return;

		this._handleEvent("packet_in", packet);

		if (packet.pType && !this._handlePID(packet)) {
			this._handleEvent(packet.pType() + '_in', packet);
			this._handleEvent(packet.pType(), packet);
		}
	}
};


/**
 * @private
 */
JXMPPConnection.prototype._doAuth = function() {
	if (this.has_sasl && this.authtype == 'nonsasl')
		Ti.API.error("Warning: SASL present but not used");

	if (!this._doSASLAuth() && !this._doLegacyAuth()) {
		Ti.API.error("Auth failed for authtype " + this.authtype);
		this.disconnect();
		return false;
	}
	return true;
};

/**
 * @private
 */
JXMPPConnection.prototype._doInBandReg = function() {
	if (this.authtype == 'saslanon' || this.authtype == 'anonymous')
		return;
	// bullshit - no need to register if anonymous

	/* ***
	 * In-Band Registration see JEP-0077
	 */

	var iq = new JXMPPPacket.JXMPPIQ();
	iq.setType('set');
	iq.setID('reg1');
	iq.appendNode("query", {
		xmlns : Constants.NS_REGISTER
	}, [["username", this.username], ["password", this.pass]]);

	this.send(iq, this._doInBandRegDone);
};

/**
 * @private
 */
JXMPPConnection.prototype._doInBandRegDone = function(iq) {
	if (iq && iq.getType() == 'error') {// we failed to register
		Ti.API.error("registration failed for " + this.username);
		this._handleEvent('onerror', iq.getChild('error'));
		return;
	}

	Ti.API.info(this.username + " registered succesfully");

	this._doAuth();
};

/**
 * @private
 */
JXMPPConnection.prototype._doLegacyAuth = function() {
	if (this.authtype != 'nonsasl' && this.authtype != 'anonymous')
		return false;

	/* ***
	 * Non-SASL Authentication as described in JEP-0078
	 */
	var iq = new JXMPPPacket.JXMPPIQ();
	iq.setIQ(null, 'get', 'auth1');
	iq.appendNode('query', {
		xmlns : Constants.NS_AUTH
	}, [['username', this.username]]);

	this.send(iq, this._doLegacyAuth2);
	return true;
};

/**
 * @private
 */
JXMPPConnection.prototype._doLegacyAuth2 = function(iq) {
	if (!iq || iq.getType() != 'result') {
		if (iq && iq.getType() == 'error')
			this._handleEvent('onerror', iq.getChild('error'));
		this.disconnect();
		return;
	}

	var use_digest = (iq.getChild('digest') != null);

	/* ***
	 * Send authentication
	 */
	var iq = new JXMPPPacket.JXMPPIQ();
	iq.setIQ(null, 'set', 'auth2');

	var query = iq.appendNode('query', {
		xmlns : Constants.NS_AUTH
	}, [['username', this.username], ['resource', this.resource]]);

	if (use_digest) {// digest login
		query.appendChild(iq.buildNode('digest', {
			xmlns : Constants.NS_AUTH
		}, hex_sha1(this.streamid + this.pass)));
	} else if (this.allow_plain) {// use plaintext auth
		query.appendChild(iq.buildNode('password', {
			xmlns : Constants.NS_AUTH
		}, this.pass));
	} else {
		Ti.API.error("no valid login mechanism found");
		this.disconnect();
		return;
	}

	this.send(iq, this._doLegacyAuthDone);
};

/**
 * @private
 */
JXMPPConnection.prototype._doLegacyAuthDone = function(iq) {
	if (iq.getType() != 'result') {// auth' failed
		if (iq.getType() == 'error')
			this._handleEvent('onerror', iq.getChild('error'));
		this.disconnect();
	} else
		this._handleEvent('onconnect');
};

/**
 * @private
 */
JXMPPConnection.prototype._doSASLAuth = function() {
	if (this.authtype == 'nonsasl' || this.authtype == 'anonymous')
		return false;

	if (this.authtype == 'saslanon') {
		if (this.mechs['ANONYMOUS']) {
			Ti.API.info("SASL using mechanism 'ANONYMOUS'");
			return this._sendRaw("<auth xmlns='urn:ietf:params:xml:ns:xmpp-sasl' mechanism='ANONYMOUS'/>", this._doSASLAuthDone);
		}
		Ti.API.error("SASL ANONYMOUS requested but not supported");

	} else {
		if (this.mechs['DIGEST-MD5']) {
			Ti.API.info("SASL using mechanism 'DIGEST-MD5'");
			return this._sendRaw("<auth xmlns='urn:ietf:params:xml:ns:xmpp-sasl' mechanism='DIGEST-MD5'/>", this._doSASLAuthDigestMd5S1);
		} else if (this.allow_plain && this.mechs['PLAIN']) {
			Ti.API.info("SASL using mechanism 'PLAIN'");
			var authStr = this.username + '@' + this.domain + String.fromCharCode(0) + this.username + String.fromCharCode(0) + this.pass;
			Ti.API.error("authenticating with '" + authStr + "'");
			authStr = b64encode(authStr);
			return this._sendRaw("<auth xmlns='urn:ietf:params:xml:ns:xmpp-sasl' mechanism='PLAIN'>" + authStr + "</auth>", this._doSASLAuthDone);
		}
		Ti.API.error("No SASL mechanism applied");
		this.authtype = 'nonsasl';
		// fallback
	}
	return false;
};

/**
 * @private
 */
JXMPPConnection.prototype._doSASLAuthDigestMd5S1 = function(el) {
	if (el.nodeName != "challenge") {
		Ti.API.error("challenge missing");
		this._handleEvent('onerror', JXMPPError.create('401', 'auth', 'not-authorized'));
		this.disconnect();
	} else {
		var challenge = b64decode(el.firstChild.nodeValue);
		Ti.API.info("got challenge: " + challenge);
		this._nonce = challenge.substring(challenge.indexOf("nonce=") + 7);
		this._nonce = this._nonce.substring(0, this._nonce.indexOf("\""));
		Ti.API.info("nonce: " + this._nonce);
		if (this._nonce == '' || this._nonce.indexOf('\"') != -1) {
			Ti.API.error("nonce not valid, aborting");
			this.disconnect();
			return;
		}

		this._digest_uri = "xmpp/";
		//     if (typeof(this.host) != 'undefined' && this.host != '') {
		//       this._digest-uri += this.host;
		//       if (typeof(this.port) != 'undefined' && this.port)
		//         this._digest-uri += ":" + this.port;
		//       this._digest-uri += '/';
		//     }
		this._digest_uri += this.domain;

		this._cnonce = cnonce(14);

		this._nc = '00000001';

		var A1 = str_md5(this.username + ':' + this.domain + ':' + this.pass) + ':' + this._nonce + ':' + this._cnonce;

		var A2 = 'AUTHENTICATE:' + this._digest_uri;

		var response = hex_md5(hex_md5(A1) + ':' + this._nonce + ':' + this._nc + ':' + this._cnonce + ':auth:' + hex_md5(A2));

		var rPlain = 'username="' + this.username + '",realm="' + this.domain + '",nonce="' + this._nonce + '",cnonce="' + this._cnonce + '",nc="' + this._nc + '",qop=auth,digest-uri="' + this._digest_uri + '",response="' + response + '",charset="utf-8"';

		Ti.API.info("response: " + rPlain);

		this._sendRaw("<response xmlns='urn:ietf:params:xml:ns:xmpp-sasl'>" + binb2b64(str2binb(rPlain)) + "</response>", this._doSASLAuthDigestMd5S2);
	}
};

JXMPPConnection.prototype._reInitStream = function(to, cb) {
	this._sendRaw("<stream:stream xmlns:stream='http://etherx.jabber.org/streams' xmlns='jabber:client' to='" + to + "' version='1.0'>", cb);
};

/**
 * @private
 */
JXMPPConnection.prototype._doSASLAuthDigestMd5S2 = function(el) {
	if (el.nodeName == 'failure') {
		if (el.xml)
			Ti.API.error("auth error: " + el.xml);
		else
			Ti.API.error("auth error");
		this._handleEvent('onerror', JXMPPError.create('401', 'auth', 'not-authorized'));
		this.disconnect();
		return;
	}

	var response = b64decode(el.firstChild.nodeValue);
	Ti.API.info("response: " + response);

	var rspauth = response.substring(response.indexOf("rspauth=") + 8);
	Ti.API.info("rspauth: " + rspauth);

	var A1 = str_md5(this.username + ':' + this.domain + ':' + this.pass) + ':' + this._nonce + ':' + this._cnonce;

	var A2 = ':' + this._digest_uri;

	var rsptest = hex_md5(hex_md5(A1) + ':' + this._nonce + ':' + this._nc + ':' + this._cnonce + ':auth:' + hex_md5(A2));
	Ti.API.info("rsptest: " + rsptest);

	if (rsptest != rspauth) {
		Ti.API.error("SASL Digest-MD5: server repsonse with wrong rspauth");
		this.disconnect();
		return;
	}

	if (el.nodeName == 'success') {
		this._reInitStream(this.domain,this._doStreamBind);
	} else {// some extra turn
		this._sendRaw("<response xmlns='urn:ietf:params:xml:ns:xmpp-sasl'/>", this._doSASLAuthDone);
	}
};

/**
 * @private
 */
JXMPPConnection.prototype._doSASLAuthDone = function(el) {
	if (el.nodeName != 'success') {
		Ti.API.error("auth failed");
		this._handleEvent('onerror', JXMPPError.create('401', 'auth', 'not-authorized'));
		this.disconnect();
	} else {
		this._reInitStream(this.domain, this._doStreamBind);
	}
};

/**
 * @private
 */
JXMPPConnection.prototype._doStreamBind = function() {
	var iq = new JXMPPPacket.JXMPPIQ();
	iq.setIQ(null, 'set', 'bind_1');
	iq.appendNode("bind", {
		xmlns : Constants.NS_BIND
	}, [["resource", this.resource]]);
	this.send(iq, this._doXMPPSess);
};

/**
 * @private
 */
JXMPPConnection.prototype._doXMPPSess = function(iq) {
	if (iq.getType() != 'result' || iq.getType() == 'error') {// failed
		this.disconnect();
		if (iq.getType() == 'error')
			this._handleEvent('onerror', iq.getChild('error'));
		return;
	}

	this.fulljid = iq.getChildVal("jid");
	this.jid = this.fulljid.substring(0, this.fulljid.lastIndexOf('/'));

	iq = new JXMPPPacket.JXMPPIQ();
	iq.setIQ(null, 'set', 'sess_1');
	iq.appendNode("session", {
		xmlns : Constants.NS_SESSION
	}, []);
	this.send(iq, this._doXMPPSessDone);
};

/**
 * @private
 */
JXMPPConnection.prototype._doXMPPSessDone = function(iq) {
	if (iq.getType() != 'result' || iq.getType() == 'error') {// failed
		this.disconnect();
		if (iq.getType() == 'error')
			this._handleEvent('onerror', iq.getChild('error'));
		return;
	} else
		this._handleEvent('onconnect');
};

/**
 * @private
 */
JXMPPConnection.prototype._handleEvent = function(event, arg) {
	event = event.toLowerCase();
	// don't be case-sensitive here
	Ti.API.info("incoming event '" + event + "'");
	if (!this._events[event])
		return;
	Ti.API.info("handling event '" + event + "'");
	for (var i = 0; i < this._events[event].length; i++) {
		var aEvent = this._events[event][i];
		if ( typeof aEvent.handler == 'function') {
			try {
				if (arg) {
					if (arg.pType) {// it's a packet
						if ((!arg.getNode().hasChildNodes() && aEvent.childName != '*') || (arg.getNode().hasChildNodes() && !arg.getChild(aEvent.childName, aEvent.childNS)))
							continue;
						if (aEvent.type != '*' && arg.getType() != aEvent.type)
							continue;
						Ti.API.info(aEvent.childName + "/" + aEvent.childNS + "/" + aEvent.type + " => match for handler " + aEvent.handler);
					}
					if (aEvent.handler(arg)) {
						// handled!
						break;
					}
				} else if (aEvent.handler()) {
					// handled!
					break;
				}
			} catch (e) {

					Ti.API.error(aEvent.handler + "\n>>>" + e.name + ": " + e.message);

			}
		}
	}
};

/**
 * @private
 */
JXMPPConnection.prototype._handlePID = function(aJXMPPPacket) {
	if (!aJXMPPPacket.getID())
		return false;
	for (var i in this._regIDs) {
		if (this._regIDs.hasOwnProperty(i) && this._regIDs[i] && i == aJXMPPPacket.getID()) {
			var pID = aJXMPPPacket.getID();
			Ti.API.info("handling " + pID);
			try {
				if (this._regIDs[i].cb.call(this, aJXMPPPacket, this._regIDs[i].arg) === false) {
					// don't unregister
					return false;
				} else {
					this._unregisterPID(pID);
					return true;
				}
			} catch (e) {
				// broken handler?
				Ti.API.error(e.name + ": " + e.message);
				this._unregisterPID(pID);
				return true;
			}
		}
	}
	return false;
};

/**
 * @private
 */
JXMPPConnection.prototype._handleResponse = function(data) {
	var doc = Ti.XML.parseString(data);

	if (!doc || doc.tagName == 'parsererror') {
		Ti.API.error("parsererror");
		return;
	}

	if (doc.getElementsByTagName('conflict').length > 0) {
		this._setStatus("session-terminate-conflict");
		this._handleEvent('onerror', JXMPPError.create('503', 'cancel', 'session-terminate'));
		this._handleEvent('ondisconnect');
		this._req.close();
		Ti.API.error("Disconnected.");
	}

	for (var i = 0; i < doc.childNodes.length; i++) {
		if (this._sendRawCallbacks.length) {
			var cb = this._sendRawCallbacks[0];

			Ti.API.debug("Current CallBack!");

			this._sendRawCallbacks = this._sendRawCallbacks.slice(1, this._sendRawCallbacks.length);
			cb.fn.call(this, doc.childNodes.item(i), cb.arg);
			continue;
		}

		this._inQ = this._inQ.concat(doc.childNodes.item(i));
		this._checkInQ();
	}
};

/**
 * @private
 */
JXMPPConnection.prototype._parseStreamFeatures = function(doc) {
	if (!doc) {
		Ti.API.error("nothing to parse ... aborting");
		return false;
	}

	var errorTag;
	if (doc.getElementsByTagNameNS) {
		errorTag = doc.getElementsByTagNameNS(Constants.NS_STREAM, "error").item(0);
	} else {
		var errors = doc.getElementsByTagName("error");
		for (var i = 0; i < errors.length; i++)
			if (errors.item(i).namespaceURI == Constants.NS_STREAM || errors.item(i).getAttribute('xmlns') == Constants.NS_STREAM) {
				errorTag = errors.item(i);
				break;
			}
	}

	if (errorTag) {
		this._setStatus("internal_server_error");
		this._handleEvent('onerror', JXMPPError.create('503', 'cancel', 'session-terminate'));
		this._connected = false;
		Ti.API.error("Disconnected.");
		this._handleEvent('ondisconnect');
		this._req.close();
		return false;
	}

	this.mechs = new Object();
	var lMec1 = doc.getElementsByTagName("mechanisms");
	if (!lMec1.length)
		return false;
	this.has_sasl = false;
	for (var i = 0; i < lMec1.length; i++)
		if (lMec1.item(i).getAttribute("xmlns") == Constants.NS_SASL) {
			this.has_sasl = true;
			var lMec2 = lMec1.item(i).getElementsByTagName("mechanism");
			for (var j = 0; j < lMec2.length; j++)
				this.mechs[lMec2.item(j).firstChild.nodeValue] = true;
			break;
		}
	if (this.has_sasl)
		Ti.API.info("SASL detected");
	else {
		Ti.API.info("No support for SASL detected");
		return true;
	}

	/* [TODO]
	 * check if in-band registration available
	 * check for session and bind features
	 */

	return true;
};

/**
 * @private
 */
JXMPPConnection.prototype._registerPID = function(pID, cb, arg) {
	if (!pID || !cb)
		return false;
	this._regIDs[pID] = new Object();
	this._regIDs[pID].cb = cb;
	if (arg)
		this._regIDs[pID].arg = arg;
	Ti.API.info("registered " + pID);
	return true;
};


/**
 * @private
 */
JXMPPConnection.prototype._sendRaw = function(xml, cb, arg) {
	if (cb) {
		this._sendRawCallbacks.push({
			fn : cb,
			arg : arg
		});
	}

	Ti.API.debug("Raw Send:" + xml);
	this._req.write(Ti.createBuffer({
		value : xml
	}));

	return true;
};

/**
 * @private
 */
JXMPPConnection.prototype._setStatus = function(status) {
	if (!status || status == '')
		return;
	if (status != this._status) {// status changed!
		this._status = status;
		this._handleEvent('onstatuschanged', status);
		this._handleEvent('status_changed', status);
	}
};

/**
 * @private
 */
JXMPPConnection.prototype._unregisterPID = function(pID) {
	if (!this._regIDs[pID])
		return false;
	this._regIDs[pID] = null;
	Ti.API.info("unregistered " + pID);
	return true;
};


//module.exports = JXMPPConnection;


/******************************************************************************************************
******************************************************************************************************/



//var Constants=require("JXMPPConstants");
//var XmlDocument = require('JXMPPXmlDocument');
/**
 * an error packet for internal use
 * @private
 * @constructor
 */
exports.create =function (code,type,condition) {
  var xmldoc = XmlDocument.create("error","JXMPP");

  xmldoc.documentElement.setAttribute('code',code);
  xmldoc.documentElement.setAttribute('type',type);
  if (condition)
    xmldoc.documentElement.appendChild(xmldoc.createElement(condition)).
      setAttribute('xmlns', Constants.NS_STANZAS);
  return xmldoc.documentElement;
}




/*****************************************************************************************************
*****************************************************************************************************/

Titanium.XML.Document.prototype.loadXML = function(s) {

		// parse the string to a new doc
		var doc2 = Ti.XML.parseString(s, "text/xml");

		// remove all initial children
		while(this.hasChildNodes())
		this.removeChild(this.lastChild);

		// insert and import nodes
		for(var i = 0; i < doc2.childNodes.length; i++) {
			this.appendChild(this.importNode(doc2.childNodes[i], true));
		}
};
/*******************************************************************************************************
*******************************************************************************************************/


function  JXMPPBuilder()  {};

  /**
   * @private
   */
JXMPPBuilder.prototype.buildNode =function(doc, elementName) {

    var element, ns = arguments[4];
	

    // attributes (or text)
    if(arguments[2])
      if(this._isStringOrNumber(arguments[2]) ||
         (arguments[2] instanceof Array)) {
        element = this._createElement(doc, elementName, ns);
        this._children(doc, element, arguments[2]);
      } else {
        ns = arguments[2]['xmlns'] || ns;
        element = this._createElement(doc, elementName, ns);
        for(var attr in arguments[2]) {
          if (arguments[2].hasOwnProperty(attr) && attr != 'xmlns')
            element.setAttribute(attr, arguments[2][attr]);
        }
      }
    else
      element = this._createElement(doc, elementName, ns);
    // text, or array of children
    if(arguments[3])
      this._children(doc, element, arguments[3], ns);

    return element;
  };

  JXMPPBuilder.prototype._createElement= function(doc, elementName, ns) {
    //try {
    //  if (ns)
    //    return doc.createElementNS(ns, elementName);
    //} catch (ex) { }

    var el = doc.createElement(elementName);

    if (ns)
      el.setAttribute("xmlns", ns);

    return el;
  };

  /**
   * @private
   */
  JXMPPBuilder.prototype._text= function(doc, text) {
    return doc.createTextNode(text);
  };

  /**
   * @private
   */
  JXMPPBuilder.prototype._children= function(doc, element, children, ns) {
    if(typeof children=='object') { // array can hold nodes and text
      for (var i in children) {
        if (children.hasOwnProperty(i)) {
          var e = children[i];
          if (typeof e=='object') {
            //if (e instanceof Array) {
              var node = this.buildNode(doc, e[0], e[1], e[2], ns);
              element.appendChild(node);
            //} else {
            //  element.appendChild(e);
            //}
          } else {
            if(this._isStringOrNumber(e)) {
              element.appendChild(this._text(doc, e));
            }
          }
        }
      }
    } else {
      if(this._isStringOrNumber(children)) {
        element.appendChild(this._text(doc, children));
      }
    }
  };

  JXMPPBuilder.prototype._attributes= function(attributes) {
    var attrs = [];
    for(var attribute in attributes)
      if (attributes.hasOwnProperty(attribute))
        attrs.push(attribute +
          '="' + attributes[attribute].toString().htmlEnc() + '"');
    return attrs.join(" ");
  };

  JXMPPBuilder.prototype._isStringOrNumber= function(param) {
    return(typeof param=='string' || typeof param=='number');
  }

//module.exports = JXMPPBuilder;


exports.JID=JXMPPJID;
exports.Packet=JXMPPPacket;
exports.XMPPError=JXMPPError;
exports.Connection=JXMPPConnection;
exports.CONSTANTS=JXMPPConstants;


exports.version = 0.1;
exports.author = 'Ionut Catrinescu';