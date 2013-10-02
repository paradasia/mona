"use strict";

var assert = require("assert"),
		
		parseXML = require("./xml").parseXML;
		
describe("xml", function() {
	it("parses an empty tag", function() {
		var document = parseXML("<hello />");
		assert.equal(document.children[0].tagname, "hello");
		assert.equal(document.children.length, 1);
		assert.equal(document.children[0].children.length, 0);
		assert.equal(document.parent, null );
	});
	
	it("parses a tag with attributes", function() {
		var document = parseXML("<hello name='dolly' />");
		// Should the attributes really become instance vars of the nodes?
		assert.equal(document.children[0].name, "dolly");
		// How to DRY this out?
		assert.equal(document.children[0].tagname, "hello");
		assert.equal(document.children.length, 1);
		assert.equal(document.children[0].children.length, 0);
		assert.equal(document.parent, null );
	});
	
	it("parses a randomly named tag", function() {
		var randomName = Math.random().toString(36).substring(7);
		// This trick sometimes returns an empty string, so:
		while (randomName === ""){
			randomName = Math.random().toString(36).substring(7);
		}
		var document = parseXML("<" + randomName + "/>");
		assert.equal(document.children[0].tagname, randomName);
		// again, need to DRY this out?
		assert.equal(document.children[0].tagname, "hello");
		assert.equal(document.children.length, 1);
		assert.equal(document.children[0].children.length, 0);
		assert.equal(document.parent, null );
	});
	
	it("parses a tag with nested text", function() {
		var document = parseXML("<hello>dolly</hello>");
		assert.equal(document.children[0].text, "dolly");
		// again, need to DRY this out?
		assert.equal(document.children[0].tagname, "hello");
		assert.equal(document.children.length, 1);
		assert.equal(document.children[0].children.length, 0);
		assert.equal(document.parent, null );
	});
	
	it("parses a tag with nothing inside", function() {
		var document = parseXML("<hello></hello>");
		assert.equal(document.children[0].text, null);
		// again, need to DRY this out?
		assert.equal(document.children[0].tagname, "hello");
		assert.equal(document.children.length, 1);
		assert.equal(document.children[0].children.length, 0);
		assert.equal(document.parent, null );
	});
	
	it("parses tags nested one level deep", function() {
		var document = parseXML("<hello><goodbye /></hello>");
		assert.equal(document.children[0].children[0].tagname, "goodbye");
		assert.equal(document.children[0].children[0].children.length, 0);
		assert.equal(document.children[0].children[0].parent.tagname, "hello");
	});
	
	it("parses deeply nested tags", function() {
		var document = parseXML("<hello><goodbye><come_back>" + 
		"<ok_fine be='that_way'/></come_back></goodbye></hello>");
		var innermostChild = (document.children[0].children[0]
													.children[0].children[0]);
		assert.equal(innermostChild.tagname, "come_back");
		assert.equal(innermostChild.be, "that_way");
		assert.equal(innermostChild.children.length, 0);
		assert.equal(innermostChild.parent.tagname, "come_back");
	});

	describe("error messages", function() {
		// Context: When HTML is broken
		//Reference the below once I know what msgs to expect:
		// it("replaces any error messages with an expectation", function() {
		//     assert.throws(function() {
		//       parse(mona.label(mona.fail(), "wee"), "");
		//     }, /\(line 1, column 0\) expected wee/);
		//   });
		
		it("Raises an error on unclosed tag", function() {
			assert.throws(function() {
				parseXML("<hello>");
			});
		});
		
		it("Raises an error on a nested unclosed tag", function() {
			assert.throws(function() {
				parseXML("<hello><goodbye></hello>");
			});
		});
		
		it("Raises an error on unbalanced angle brackets", function() {
			assert.throws(function() {
				parseXML("<hello><goodbye </hello>");
			});
		});
		
		it("Raises an error on unbalanced single quotes", function() {
			assert.throws(function() {
				parseXML("<hello name='dolly />");
			});
		});
		
	});
	
});
		