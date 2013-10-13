/* global describe, it */
"use strict";

var assert = require("assert"),
		xml = require("./xml"),
		parseXML = xml.parseXML,
		attribute = xml.attribute,
		mona = require("../src/mona");
		
// Testing Helpers

function xml_base_tests(target, opts) {
	assert.equal(target["children"][0]["tagname"], opts["tagname"]);
	assert.equal(target["children"]["length"], opts["doc_children"]);
	assert.equal(target["children"][0]["children"]["length"], opts["first_el_children"]);
	assert.equal(target["parent"], null);
}

var base_vals = {
	"tagname": "hello",
	"doc_children": 1,
	"first_el_children": 0
};

//
		
		
describe("xml", function() {
	describe("attribute", function() {
		it("parses an attribute", function() {
			assert.deepEqual(mona.parse(attribute(), " foo='bar' "),
			{ "name": "foo", "value": "bar"})
		});
	});
	
	it("parses an empty tag", function() {
		var doc = parseXML("<hello />");
		xml_base_tests(doc, base_vals);
	});
	
	it("parses a tag with attributes", function() {
		var doc = parseXML("<hello name='dolly' />");
		assert.equal(doc.children[0].name, "dolly");
		xml_base_tests(doc, base_vals);
	});
	
	it("parses a randomly named tag", function() {
		var randomName = Math.random().toString(36).substring(7);
		// This trick sometimes returns an empty string, so:
		while (randomName === ""){
			randomName = Math.random().toString(36).substring(7);
		}
		var doc = parseXML("<" + randomName + "/>");
		xml_base_tests(doc, {
			"tagname": randomName,
			"doc_children": 1,
			"first_el_children": 0
		});
	});
	
	it("parses a tag with nested text", function() {
		var doc = parseXML("<hello>dolly</hello>");
		assert.equal(doc.children[0].text, "dolly");
		xml_base_tests(doc, base_vals);
	});
	
	it("parses a tag with nothing inside", function() {
		var doc = parseXML("<hello></hello>");
		assert.equal(doc.children[0].text, null);
		xml_base_tests(doc, base_vals);
	});
	
	it("parses tags nested one level deep", function() {
		var doc = parseXML("<hello><goodbye /></hello>");
		assert.equal(doc.children[0].children[0].tagname, "goodbye");
		assert.equal(doc.children[0].children[0].children.length, 0);
		assert.equal(doc.children[0].children[0].parent.tagname, "hello");
	});
	
	it("parses deeply nested tags", function() {
		var doc = parseXML("<hello><goodbye><come_back>" + 
		"<ok_fine be='that_way'/></come_back></goodbye></hello>");
		var innermostChild = (doc.children[0].children[0]
													.children[0].children[0]);
		assert.equal(innermostChild.tagname, "ok_fine");
		assert.equal(innermostChild.be, "that_way");
		assert.equal(innermostChild.children.length, 0);
		assert.equal(innermostChild.parent.tagname, "come_back");
	});
	
	it("ignores newlines and spaces", function() {
		var xmlText = ("<hello>\n" + 
										"  <goodbye>\n" + 
										"    <come_back>\n" + 
										"      <ok_fine be='that_way'/>\n" + 
										"    </come_back>\n" + 
										"  </goodbye>\n" + 
										"</hello>");
		var doc = parseXML(xmlText);
		var innermostChild = (doc.children[0].children[0]
													.children[0].children[0]);
		assert.equal(innermostChild.tagname, "ok_fine");
		assert.equal(innermostChild.be, "that_way");
		assert.equal(innermostChild.children.length, 0);
		assert.equal(innermostChild.parent.tagname, "come_back");
	})

	describe("error messages", function() {
		// Context: When XML is broken
		
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
		