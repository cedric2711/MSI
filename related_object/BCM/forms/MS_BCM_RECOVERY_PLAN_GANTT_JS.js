    var lbganttConstants;
	var Utils;
	function enableDisableMrow() {
        if (invokedFromDataBrowser || F.getFormParameter('emd') === '5' || document.getElementById("btn-edit").offsetLeft !== 0) {
            return false;
        }
        return true;
    }
	
	function callBryntumGantt(bganttConstants) {
		lbganttConstants=bganttConstants;
        openModelWindow();
		console.log("Completed callBryntumGantt");
    }

    function GanttCommonMask(pDefaultMaskMessage) {
		console.log("Entered GanttCommonMask");

        this.showMask = function(maskMsg) {
			Utils=require('utils');
			Utils.Loader.mask($('#content'));
			$('.content-mask').attr("style", "z-index:999;background-color:#D5D5D5");
			$('.content-loader ').prepend("<p><h3>"+F.getMessage('maskMessage3')+"</h3></p>");
			$('.content-loader ').attr("style","margin: 200px auto;font-size: 20px;");
        }; 
		
        this.clearMask = function() {
			Utils.Loader.hide($('#content'));
        };
    }

    var ganttMask = new GanttCommonMask();

    function trackChildWindow(booleanVar) {
        popupWinOpen = booleanVar;
        if (booleanVar) {
            ganttMask.showMask(F.getMessage('maskMessage3'));
        } else {
           ganttMask.clearMask();
        }
    }

    function openChildWindow(winType, winUrl, winTarget, winFeature, winTitle) {
        trackChildWindow(true);
        var popup = window.open(winUrl, winTarget, winFeature);
        if (!popup) {
            Dialog.alert(F.getMessage('alertValidity5'));
            trackChildWindow(false);
        } else if (popup) {
            popup.focus();
        }
        
	 	var timer = setInterval(checkChild, 500);

        function checkChild() {
            if (popup.closed) {
				console.log("Bryntum Popup closed");
                trackChildWindow(false);
                clearInterval(timer);
				console.log("Completed the task.");
            }
        } 
    }

    function openModelWindow() {
		var title = "Hello Title";
        var width = screen.width / 2 + 450;
        var height = screen.height / 2 + 200;
        var left = Number((screen.width - width) / 2);
        var top = Number((screen.height - height) / 2);
        var windowFeatures = "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,copyhistory=no,width=" + width + ",height=" + height + ",left=" + left + "top=" + top;
        var gridFormUrl = '/bcm/gantt/plan/recoverysteps/ms_bcm_plan_gantt.html';
        openChildWindow(document.location.protocol+"//"+document.location.host, gridFormUrl, '_blank', windowFeatures, title);
    }

    function getAsgData() {
        var asgObj = new Object();
        var asgArr = Array();
        var asgRowCount = F.ASG.getRowCount();
        for (var i = 1; i <= asgRowCount; i++) {
            var asg1 = new Object();
			console.log("Check::"+F.ASG_RESOURCEID.read(i));
            asg1.Id = F.ASG_ID.read(i);
            asg1.ResourceId = F.ASG_RESOURCEID.read(i);
            asg1.TaskId = F.ASG_TASKID.read(i);
            asg1.Units = F.ASG_UNITS.read(i);
            asgArr.push(asg1);
        }
        asgObj.Assignments = asgArr;
        var myData = JSON.stringify(asgObj);
        return myData;
    }

    function getDepData() {
        var linksObj = new Object();
        var linkArr = Array();
        var dpnRowCount = F.DPN.getRowCount();
        for (var i = 1; i <= dpnRowCount; i++) {
            var link1 = new Object();
            link1.Id = F.DPN_ID.read(i);
            link1.From = F.DPN_FROM.read(i);
            link1.To = F.DPN_TO.read(i);
            link1.Type = F.DPN_TYPE.read(i);
            link1.Cls = F.DPN_CLS.read(i);
            link1.Lag = F.DPN_LAG.read(i);
            link1.LagUnit = F.DPN_LAGUNIT.read(i);
            linkArr.push(link1);
        }
        linksObj.Links = linkArr;
        var myData = JSON.stringify(linksObj);
        return myData;
    }

    function updateBryntum(pTasksObj, pLinksObj, pAssignmentObj1) {
		console.log("This is coming inside updateBryntum");
        updateTasks(pTasksObj);
        updateLinks(pLinksObj);
        updateAssignment(pAssignmentObj1);
        recoveryStepsLink();
    }
	
	 function recoveryStepsLink() {
        var totalTSKRowCount = F.TSK.getRowCount();
        var totalTSKRowsMarkedForDel = 0;
        for (var counterTSK in F.TSK.rows()) {
            if (F.TSK.isMarkedForDeletion(counterTSK)) {
                totalTSKRowsMarkedForDel++;
            }
        }
        if (F.TSK.getRowCount() === 0 || totalTSKRowCount === totalTSKRowsMarkedForDel) {
			F.getObject('MSAI_628').hide();
        } else {
			F.getObject('MSAI_628').show();
			F.getObject('MSAI_489').hide();			
        }
    }

    function updateAssignment(pAssignmentObj) {
        var assignmentArr = Array();
        assignmentArr = pAssignmentObj.Assignments;
        deleteAssignment();

        var startval = F.ASG.getRowCount();
        var assignmentArrLength = assignmentArr.length;
        for (var counter = 0; counter < assignmentArrLength; counter++) {
            F.ASG.addRow(true, true);
            F.ASG_ID.write(assignmentArr[counter].Id, counter + 1);
            F.ASG_RESOURCEID.write(assignmentArr[counter].ResourceId, counter + 1);
            F.ASG_TASKID.write(assignmentArr[counter].TaskId, counter + 1);
            F.ASG_UNITS.write(assignmentArr[counter].Units, counter + 1);
        }
    }

    function updateLinks(pLinksObj) {
        var linkArr = Array();
        linkArr = pLinksObj.Links;
        deleteLinks();

        var startval = F.DPN.getRowCount();
        var linkArrLength = linkArr.length;
        for (var counter = 0; counter < linkArrLength; counter++) {
			F.DPN.addRow(true, true);
            F.DPN_ID.write(linkArr[counter].Id, counter + 1);
            F.DPN_FROM.write(linkArr[counter].From, counter + 1);
            F.DPN_TO.write(linkArr[counter].To, counter + 1);
            F.DPN_TYPE.write(linkArr[counter].Type, counter + 1);
            F.DPN_LAG.write(linkArr[counter].Lag, counter + 1);
            F.DPN_CLS.write(linkArr[counter].Cls, counter + 1);
            F.DPN_LAGUNIT.write(linkArr[counter].LagUnit, counter + 1);
        }
    }

    function deleteLinks() {
		F.DPN.makeEmpty();
    }

    function deleteAssignment() {
		F.ASG.makeEmpty();
    }

    function updateTasks(pTasksObj) {
		console.log("pTasksObj"+pTasksObj);
        var taskArr = Array();
        taskArr =pTasksObj.Tasks;
        deleteTasks();
        var taskArrLength = taskArr.length;
		console.log("taskArrLength"+taskArrLength);
		var rowCounter;
        for (var counter = 0; counter < taskArrLength; counter++) {
            F.TSK.addRow(true, true);
            F.TSK_ID.write(taskArr[counter].Id, counter + 1);
            F.TSK_NAME.write((taskArr[counter].Name), counter + 1);
            F.TSK_PERCENT_DONE.write(taskArr[counter].PercentDone, counter + 1);
            F.TSK_START_DATE.write(taskArr[counter].StartDate, counter + 1);
            F.TSK_BASELINE_END_DATE.write(taskArr[counter].BaselineEndDate, counter + 1);
            F.TSK_BASELINE_START_DATE.write(taskArr[counter].BaselineStartDate, counter + 1);
            F.TSK_DURATION.write(taskArr[counter].Duration, counter + 1);
            F.TSK_TASKTYPE.write(taskArr[counter].TaskType, counter + 1);
            F.TSK_EXPANDED.write(taskArr[counter].expanded, counter + 1);
            F.TSK_PARENT_TASKID.write(taskArr[counter].parentTaskId, counter + 1);
            F.TSK_LEAF.write(taskArr[counter].leaf, counter + 1);
            F.TSK_EFFORT.write(taskArr[counter].Effort, counter + 1);
            F.TSK_NOTE.write((taskArr[counter].Note), counter + 1);
            F.TSK_COLOR.write(taskArr[counter].Color, counter + 1);
            F.TSK_END_DATE.write(taskArr[counter].EndDate, counter + 1);
            F.TSK_INDEX.write(taskArr[counter].Index, counter + 1);
            F.TSK_NODELEVEL.write(taskArr[counter].NodeLevel, counter + 1); 
            if (taskArr[counter].AdditionalInfo != 'undefined') {
               F.TSK_ADDITIONALINFO.write((taskArr[counter].AdditionalInfo), counter + 1);
            } else {
                F.TSK_ADDITIONALINFO.write(null, counter + 1);
            }

            if (taskArr[counter].Priority != 'undefined') {
                F.TSK_PRIORITY.write(taskArr[counter].Priority, counter + 1);
            } else {
                F.TSK_PRIORITY.write(null, counter + 1);
            }

            if (taskArr[counter].Plan != 'undefined') {
                F.TSK_PLAN.write(taskArr[counter].Plan, counter + 1);
            } else {
                F.TSK_PLAN.write(null, counter + 1);
            }
        }
    }

    function deleteTasks() {
		F.TSK.makeEmpty();
    }

    function getTaskData() {
        var tasksObj = new Object();
        var taskMap = new Object();
        var taskArr = Array();
        var rowCount = F.TSK.getRowCount();

        var taskIdRowIdMap = new Object();
        for (var l = 1; l <= rowCount; l++) {
            if (!F.TSK.isMarkedForDeletion(l))
				taskIdRowIdMap[F.TSK_ID.read(l)] = l;
        }

        for (var j = 1; j <= rowCount; j++) {
            var i = taskIdRowIdMap[j];
            var task1 = new Object();
            task1.Id = F.TSK_ID.read(i);
            //task1.Name = decodeHtmlContent(F.TSK_NAME.read(i));
            task1.Name = F.TSK_NAME.read(i); 
            task1.PercentDone = F.TSK_PERCENT_DONE.read(i);
            task1.StartDate = F.TSK_START_DATE.read(i);
            task1.BaselineEndDate = F.TSK_BASELINE_END_DATE.read(i);
            task1.BaselineStartDate = F.TSK_BASELINE_START_DATE.read(i);
            task1.Duration = F.TSK_DURATION.read(i);
            task1.TaskType = F.TSK_TASKTYPE.read(i);
            task1.expanded = F.TSK_EXPANDED.read(i);
            task1.parentTaskId = F.TSK_PARENT_TASKID.read(i);
            task1.leaf = F.TSK_LEAF.read(i);
            task1.Effort = F.TSK_EFFORT.read(i);
            //task1.Note = decodeHtmlContent(F.TSK_NOTE.read(i));
            task1.Note = F.TSK_NOTE.read(i);
            task1.Color = F.TSK_COLOR.read(i);
            task1.EndDate = F.TSK_END_DATE.read(i);
            task1.Index = F.TSK_INDEX.read(i);
            task1.NodeLevel = F.TSK_NODELEVEL.read(i);
            task1.OtherAttribute = F.TSK_OTHERATTRIBUTE.read(i);
            task1.BaseLineEffort = F.TSK_BASELINEEFFORT.read(i);
            //task1.AdditionalInfo = decodeHtmlContent(F.TSK_ADDITIONALINFO.read(i)); 
			task1.AdditionalInfo = F.TSK_ADDITIONALINFO.read(i);
            task1.Priority = F.TSK_PRIORITY.read(i);
            task1.Plan = F.TSK_PLAN.read(i);
            task1.children = [];

            taskMap[F.TSK_ID.read(i)] = task1;
            var parent;

            if ((!F.TSK_PARENT_TASKID.read(i)) || (F.TSK_PARENT_TASKID.read(i) === null) || (F.TSK_PARENT_TASKID.read(i) === '')) {
                parent = '-';
            } else {
                parent = F.TSK_PARENT_TASKID.read(i);
            }

            if (!taskMap[parent]) {
                taskMap[parent] = {
                    children: []
                };
            }
            taskMap[parent].children.push(task1);
        } // For loop to iterate over entire multirow.

        if (taskMap['-']) {
            taskArr = taskMap['-'].children;
        }

        tasksObj.Tasks = taskArr;
        var myData = JSON.stringify(tasksObj);
        return myData;
    } /***** getTaskData *****/

    var jResourceStr;
    var jPriorityStr;
    var jPlanStr;


    function initializeData() {
        fetchResourceData();
        fetchPriorityData();
        ddCurrentUserName = F.DD_CURRENT_USER_NAME.read();
        fetchPlanData(ddCurrentUserName);
    }


    function fetchResourceData() {
		 $.ajax({
				type: "GET",
				dataType: "json",
				url: "/metricstream/api/7.0/planGantt/userData",
				success: function(response) {		
					console.log('Resource response'+response.Resource);
					 jResourceStr = response.Resource;
				},
				error: function(response) {
						console.log('Resource error'+response.Resource);
					jResourceStr = response.Resource;
					return;
				}
			});
    }


    function fetchPriorityData() {
        var locale_value = F.LOGGED_USER_LOCALE.read();
        locale_value = locale_value.substring(0, locale_value.indexOf("&"));
         $.ajax({
				type: "GET",
				dataType: "json",
				url: "/metricstream/api/7.0/planGantt/priorityData/"+locale_value+"",
				success: function(response) {	
					 jPriorityStr = response.Priority;
					 console.log(jPriorityStr);
				},
				error: function(response) {
					jPriorityStr = response.Priority;
					console.log(jPriorityStr);
					return;					
				}
			});
    }

    function fetchPlanData() {
		$.ajax({
				type: "GET",
				dataType: "json",
				url: "/metricstream/api/7.0/planGantt/planData/"+ddCurrentUserName+"",
				success: function(response) {		
					jPlanStr = response.Plan;
				},
				error: function(response) {
					jPlanStr = response.Plan;
					console.log(jPlanStr);
					return;
				}
			});
    }

    function getResourceData() {
        return jResourceStr;
    }

    function getPriorityData() {
        return jPriorityStr;
    }

    function getPlanData() {
        return jPlanStr;
    }