"use strict";

var CSLEDIT = CSLEDIT || {};

// Heading for a smart tree
//
// Can use a NodeWatcher to associate the heading with a specific CSL node path

CSLEDIT.SmartTreeHeading = function (element, nodePath, title, possibleChildren, showPropertyPanel) {
	var that = this;
		
	this.element = element;
	this.title = title;

	this.possibleChildren = possibleChildren;
	this.showPropertyPanel = showPropertyPanel;

	if (typeof(nodePath) === "undefined" || nodePath === "") {
		this.updateHtml(null);
	} else {
		this.nodeWatcher = new CSLEDIT.NodeWatcher(nodePath, CSLEDIT.data, function (nodeData) {
			that.updateHtml(nodeData);
		});

		this.addNode = function (id, position, nodeData, numNodes) {
			that.nodeWatcher.addNode(id, position, nodeData, numNodes);
		};
		this.deleteNode = function (id, numNodes) {
			that.nodeWatcher.deleteNode(id, numNodes);
		};
		this.amendNode = function (id, nodeData) {
			that.nodeWatcher.amendNode(id, nodeData);
		};

		this.element.click(function () {
			if (that.nodeData !== null) {
				console.log("selecting node " + that.nodeWatcher.nodeData.cslId);
				that.callbacks.selectNode(that.nodeWatcher.nodeData.cslId);
			}
		});
	}
};

CSLEDIT.SmartTreeHeading.prototype.updateHtml = function (nodeData) {
	var cslidAttribute;

	if (nodeData !== null) {
		cslidAttribute = 'cslid="' + nodeData.cslId + '"';
	}
	this.element.html('<h3 class="smartTreeHeading"><span ' + cslidAttribute + '>' +
	   this.title + '</span></h3>');

	console.log("updated smart tree to " + this.element.html());
};

CSLEDIT.SmartTreeHeading.prototype.setCallbacks = function (callbacks) {
	this.callbacks = callbacks;
};

CSLEDIT.SmartTreeHeading.prototype.selectedNode = function () {
	if (this.nodeWatcher.nodeData !== null) {
		return this.nodeWatcher.nodeData.cslId;
	} else {
		return null;
	}
};

CSLEDIT.SmartTreeHeading.prototype.getSelectedNodePath = function () {
	var splitNodePath = this.nodeWatcher.nodePath.split("/"),
		nodePath = [],
		cslIdPath = [],
		nodes;

	while (splitNodePath.length > 0) {
		nodePath.push(splitNodePath.splice(0, 1));
		nodes = CSLEDIT.data.getNodesFromPath(nodePath.join("/"));
		assertEqual(nodes.length, 1);
		cslIdPath.push(nodes[0].cslId);
	}

	return cslIdPath;
};
