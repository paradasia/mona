"use strict";

var mona = require("../src/mona");

/*
 * XML Parser
 * 
 */

var exampleNode = {
	tagname: "hello",
	children: [], //could contain other Node hashes
	parent: null, //could point to another Node
	name: "dolly"
}

function xml() {
	return mona.trim(
		doc()
	);
}

function doc() {
	return mona.tag(
		mona.trim(
			nodeChildren()
		),
		"children"
	); 
}

function nodeChildren() {
	return mona.collect(node());
}

function node() {
	return mona.between(mona.trim(mona.string("<")),
											mona.trim(mona.or(
												mona.string(">"),
												mona.string("/>"))
												),
											insideNode());
}

function insideNode() {
	//WIP - how to add children?
	// return mona.tag(tagName(),
	// 								"tagname");
	return mona.sequence(function(s) {
		var tagN = s(tagName());
		var attrs = s(mona.log(mona.collect(attribute())), "meow");
		var obj = {};
		obj.tagname = tagN;
		attrs.forEach(function(attr) {
			obj[attr.name] = attr.value;
		});
		console.log("It's about to return: ", obj);
		return mona.value(obj);
	});
}

function tagName() {
	return mona.text(mona.unless(mona.space(), 
															 mona.token()));
}

function attrName() {
	return mona.text(mona.unless(mona.or(mona.string("="),
																			 mona.space()),
															 mona.token()));
}

function attrVal() {
	return mona.between(someQuote(), someQuote(), mona.text(mona.noneOf("\"'")));
}

function someQuote() {
	return mona.or(mona.string('"'), mona.string("'"));
}

function attribute() {
  return mona.sequence(function(s) {
    var key = s(mona.trim(attrName()));
    s(mona.trim(mona.string("=")));
    var value = s(mona.trim(attrVal()));
		var pairObj = {};
		pairObj.name = key;
		pairObj.value = value;
    return mona.value(pairObj);
  });
}

//Josh's magic function

function experiment() {
	return mona.sequence(function(s) {
		var x = s(mona.alpha());
		var xs = s(mona.collect(mona.alpha()));
		var obj = {};
		obj.t = x;
		obj.foo = xs;
		return mona.value(obj);
	});
}

function parseXML(text) {
	return mona.parse(xml(), text);
}

function runExample() {
	var xmlText = ("<hello>\n" + 
									"  <goodbye>\n" + 
									"    <come_back>\n" + 
									"      <ok_fine be='that_way'/>\n" + 
									"    </come_back>\n" + 
									"  </goodbye>\n" + 
									"</hello>");
									
	//How to add the newlines?
	
	console.log("Parsing:\n", xmlText,
	"=>\n", parseXML(xmlText));
}
if (module.id === ".") runExample();

module.exports = {
	parseXML: parseXML,
	runExample: runExample,
	attribute: attribute
}