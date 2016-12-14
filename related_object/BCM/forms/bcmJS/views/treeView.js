/**
 * Tree - begins here
 * This View is extending the Appstudio TreeView.
 * This view is modified to enhance the row node views and the events to be trigged on the tree view.
 * Attributes modified are template, childeView and events
 * Created by nagesh.gowtham
 * Enhance by cedricm
 *
 * @class treeView
 * @return {Object} TreeRootView
 */

define(['libs', 'utils', 'forms/views/treeView',
        'modules/BCM/forms/bcmJS/views/treeNodeView', 'forms/models/TreeNodeModel', 'forms/views/TreeNodeEditView', 'forms/helpers/treeNodeSorter'
    ],

    function(libs, utils, TreeView, TreeNodeView, TreeNodeModel, TreeNodeEditView, TreeNodeSorter) {

        var TreeRootView = TreeView.extend({
            className: 'col-md-12 cartridge-tree-container',
            /**
             * We extend the event provided by ECP
             *
             * @method events
             * @return {Object} myevents
             */
            events: function() {
                var myevents = {};
                _.extend(myevents, TreeView.prototype.events, {
                    'click .rsk-expandAll': 'expandAll', //cedricm: for expanding all the rows
                    'click .rsk-collapseAll': 'collapseAll', //,	//cedricm: for collapsing all the rows
                });
                return myevents;
            },
            childView: TreeNodeView
        });

        return TreeRootView;

    });
