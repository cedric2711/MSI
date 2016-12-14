function BCMLSI() {
    var currentStage = F.DD_CURRENT_STAGE.read();
    var initiator = F.INITIATOR.read();
    var owner = F.PLAN_OWNER.read();
    var approver1 = F.PLAN_APPROVER.read();
    var approver2 = F.LEVEL2_APPROVER.read();
    var ownerIniSame = (initiator == owner);
    var approver1IsSelected = approver1.length > 0;
    var approver2IsSelected = approver2.length > 0;
	var assigned_by = '';
    var assigned_on = '';
	prev_stage_details = F.PREV_STAGE_DETAILS.read();
	if(prev_stage_details !== 'NONE') {
		assigned_by = prev_stage_details.substring(0,prev_stage_details.indexOf("$$"));
		assigned_on = prev_stage_details.substring(prev_stage_details.indexOf("$$")+2);
	}
	
    if (currentStage === 'CREATE_EDIT' && F.PLAN_STATUS.read() !== 'REQ_CLR') {
        /* Hiding stage indicator if no approvers are selected */
        if (ownerIniSame || owner.length == 0) {
            if (!approver1IsSelected && !approver2IsSelected) {
                F.getHeader().hideWorkflowIndicator();
            } else if (approver1IsSelected && !approver2IsSelected) {
                nol2approverAtIni = {
                    "current-logical-stage": "CREATE_EDIT",
                    "total-stages": "2",
                    "logical-stages": [
						{"description": "Current Stage: Initiation","order": 1,"stored-value": "CREATE_EDIT" }, 
						{"description": "Level 1 Approval","order": 2,"stored-value": "L1_APPROVE"}]
                };
                F.getHeader().setWorkflowIndicator(nol2approverAtIni);
                F.getHeader().showWorkflowIndicator();
            } else if (approver1IsSelected && approver2IsSelected) {
                l1l2approverAtIni = {
                    "current-logical-stage": "CREATE_EDIT",
                    "total-stages": "3",
                    "logical-stages": [
						{"description": "Current Stage: Initiation","order": 1,"stored-value": "CREATE_EDIT"}, 
						{"description": "Level 1 Approval","order": 2,"stored-value": "L1_APPROVE"}, 
						{"description": "Level 2 Approval","order": 3,"stored-value": "L2_APPROVE"}]
                };
                F.getHeader().setWorkflowIndicator(l1l2approverAtIni);
                F.getHeader().showWorkflowIndicator();
            }
        }
        /*Level 2 approver doesnot exists at Initiator stage*/
        else {
            if (!approver1IsSelected && !approver2IsSelected) {
                nol1l2approverAtIni = {
                    "current-logical-stage": "CREATE_EDIT",
                    "total-stages": "2",
                    "logical-stages": [
						{"description": "Current Stage: Initiation","order": 1,"stored-value": "CREATE_EDIT" }, 
						{"description": "Owner Review","order": 2,"stored-value": "OBJECT_EDITORS"}]
                };
                F.getHeader().setWorkflowIndicator(nol1l2approverAtIni);
                F.getHeader().showWorkflowIndicator();
            } else if (approver1IsSelected && !approver2IsSelected) {
                nol2approverAtIni = {
                    "current-logical-stage": "CREATE_EDIT",
                    "total-stages": "3",
                    "logical-stages": [
						{"description": "Current Stage: Initiation","order": 1,"stored-value": "CREATE_EDIT"}, 
						{"description": "Owner Review","order": 2,"stored-value": "OBJECT_EDITORS"}, 
						{"description": "Level 1 Approval","order": 3,"stored-value": "L1_APPROVE"}]
                };
                F.getHeader().setWorkflowIndicator(nol2approverAtIni);
                F.getHeader().showWorkflowIndicator();
            }

            /*Level 2 approver exists at Initiator stage*/
            else if (approver1IsSelected && approver2IsSelected) {
                l1l2approverAtIni = {
                    "current-logical-stage": "CREATE_EDIT",
                    "total-stages": "4",
                    "logical-stages": [
						{"description": "Current Stage: Initiation","order": 1,"stored-value": "CREATE_EDIT"}, 
						{"description": "Owner Review","order": 2,"stored-value": "OBJECT_EDITORS"}, 
						{"description": "Level 1 Approval","order": 3,"stored-value": "L1_APPROVE"}, 
						{"description": "Level 2 Approval","order": 4,"stored-value": "L2_APPROVE"}]
                };
                F.getHeader().setWorkflowIndicator(l1l2approverAtIni);
                F.getHeader().showWorkflowIndicator();
            }
        }
    }else if (currentStage === 'CREATE_EDIT' && F.PLAN_STATUS.read() === 'REQ_CLR') {
        if (ownerIniSame || owner.length == 0) {
             if (approver1IsSelected && !approver2IsSelected) {
                nol2approverAtIni = {
                    "current-logical-stage": "CREATE_EDIT",
                    "total-stages": "2",
                    "logical-stages": [
						{"description":"Current Stage: Initiation<br>Assigned by: "+assigned_by+"<br>Assigned on: "+assigned_on,"order":1,"stored-value": "CREATE_EDIT" }, 
						{"description": "Level 1 Approval","order": 2,"stored-value": "L1_APPROVE"}]
                };
                F.getHeader().setWorkflowIndicator(nol2approverAtIni);
                F.getHeader().showWorkflowIndicator();
            } else if (approver1IsSelected && approver2IsSelected) {
                l1l2approverAtIni = {
                    "current-logical-stage": "CREATE_EDIT",
                    "total-stages": "3",
                    "logical-stages": [
						{"description":"Current Stage: Initiation<br>Assigned by: "+assigned_by+"<br>Assigned on: "+assigned_on,"order":1,"stored-value": "CREATE_EDIT" },
						{"description": "Level 1 Approval","order": 2,"stored-value": "L1_APPROVE"}, 
						{"description": "Level 2 Approval","order": 3,"stored-value": "L2_APPROVE"}]
                };
                F.getHeader().setWorkflowIndicator(l1l2approverAtIni);
                F.getHeader().showWorkflowIndicator();
            }
        }else {
            if (!approver1IsSelected && !approver2IsSelected) {
                nol1l2approverAtIni = {
                    "current-logical-stage": "CREATE_EDIT",
                    "total-stages": "2",
                    "logical-stages": [
						{"description":"Current Stage: Initiation<br>Assigned by: "+assigned_by+"<br>Assigned on: "+assigned_on,"order":1,"stored-value": "CREATE_EDIT" },
						{"description": "Owner Review","order": 2,"stored-value": "OBJECT_EDITORS"}]
                };
                F.getHeader().setWorkflowIndicator(nol1l2approverAtIni);
                F.getHeader().showWorkflowIndicator();
            } else if (approver1IsSelected && !approver2IsSelected) {
                nol2approverAtIni = {
                    "current-logical-stage": "CREATE_EDIT",
                    "total-stages": "3",
                    "logical-stages": [
						{"description":"Current Stage: Initiation<br>Assigned by: "+assigned_by+"<br>Assigned on: "+assigned_on,"order":1,"stored-value": "CREATE_EDIT" },
						{"description": "Owner Review","order": 2,"stored-value": "OBJECT_EDITORS"}, 
						{"description": "Level 1 Approval","order": 3,"stored-value": "L1_APPROVE"}]
                };
                F.getHeader().setWorkflowIndicator(nol2approverAtIni);
                F.getHeader().showWorkflowIndicator();
            }else if (approver1IsSelected && approver2IsSelected) {
                l1l2approverAtIni = {
                    "current-logical-stage": "CREATE_EDIT",
                    "total-stages": "4",
                    "logical-stages": [
						{"description":"Current Stage: Initiation<br>Assigned by: "+assigned_by+"<br>Assigned on: "+assigned_on,"order":1,"stored-value": "CREATE_EDIT" },
						{"description": "Owner Review","order": 2,"stored-value": "OBJECT_EDITORS"}, 
						{"description": "Level 1 Approval","order": 3,"stored-value": "L1_APPROVE"}, 
						{"description": "Level 2 Approval","order": 4,"stored-value": "L2_APPROVE"}]
                };
                F.getHeader().setWorkflowIndicator(l1l2approverAtIni);
                F.getHeader().showWorkflowIndicator();
            }
        }
    }else if (currentStage === 'L1_APPROVE') {
        /*Level 2 approver doesnot exists at Level 1 approver stage*/
        if (ownerIniSame) {
            if (!approver2IsSelected) {
                nol2approverAtL1 = {
                    "current-logical-stage": "L1_APPROVE",
                    "total-stages": "2",
                    "logical-stages": [
						{"description": "Initiation","order": 1,"stored-value": "CREATE_EDIT"}, 
						{"description": "Current Stage: Level 1 Approval<br>Assigned by: " + F.INITIATOR.readDisplayedValue() + "<br>Assigned on: " + assigned_on,"order": 2,"stored-value": "L1_APPROVE"}]
                };
                F.getHeader().setWorkflowIndicator(nol2approverAtL1);
                F.getHeader().showWorkflowIndicator();

            }
            /*Level 2 approver exists at Level 1 approver stage*/
            else {
                l1l2approverAtL1 = {
                    "current-logical-stage": "L1_APPROVE",
                    "total-stages": "3",
                    "logical-stages": [
						{"description": "Initiation","order": 1,"stored-value": "CREATE_EDIT"}, 
						{"description": "Current Stage: Level 1 Approval<br>Assigned by: " + F.INITIATOR.readDisplayedValue() + "<br>Assigned on: " + assigned_on,"order": 2,"stored-value": "L1_APPROVE"}, 
						{"description": "Level 2 Approval","order": 3,"stored-value": "L2_APPROVE"}]
                };
                F.getHeader().setWorkflowIndicator(l1l2approverAtL1);
                F.getHeader().showWorkflowIndicator();
            }
        } else {
            if (!approver2IsSelected) {
                nol2approverAtL1 = {
                    "current-logical-stage": "L1_APPROVE",
                    "total-stages": "3",
                    "logical-stages": [
						{"description": "Initiation","order": 1,"stored-value": "CREATE_EDIT"}, 
						{"description": "Owner Review","order": 2,"stored-value": "OBJECT_EDITORS"}, 
						{"description": "Current Stage: Level 1 Approval<br>Assigned by: " + F.INITIATOR.readDisplayedValue() + "<br>Assigned on: " + assigned_on,"order": 3,"stored-value": "L1_APPROVE"}]
                };
                F.getHeader().setWorkflowIndicator(nol2approverAtL1);
                F.getHeader().showWorkflowIndicator();
            }
            /*Level 2 approver exists at Level 1 approver stage*/
            else {
                l1l2approverAtL1 = {
                    "current-logical-stage": "L1_APPROVE",
                    "total-stages": "4",
                    "logical-stages": [
						{"description": "Initiation","order": 1,"stored-value": "CREATE_EDIT"}, 
						{"description": "Owner Review","order": 2,"stored-value": "OBJECT_EDITORS"}, 
						{"description": "Current Stage: Level 1 Approval<br>Assigned by: " + F.INITIATOR.readDisplayedValue() + "<br>Assigned on: " + assigned_on,"order": 3,"stored-value": "L1_APPROVE"}, 
						{"description": "Level 2 Approval","order": 4,"stored-value": "L2_APPROVE"}]
                };
                F.getHeader().setWorkflowIndicator(l1l2approverAtL1);
                F.getHeader().showWorkflowIndicator();
            }
        }
    }
    /*Level 2 Approver Stage*/
    else if (currentStage === 'L2_APPROVE') {
        if (ownerIniSame) {
            finalstage = {
                "current-logical-stage": "L2_APPROVE",
                "total-stages": "3",
                "logical-stages": [
					{"description": "Initiation","order": 1,"stored-value": "CREATE_EDIT"}, 
					{"description": "Level 1 Approval","order": 2,"stored-value": "L1_APPROVE"}, 
					{"description": "Current Stage: Level 2 Approval<br>Assigned by: " + F.PLAN_APPROVER.readDisplayedValue() + "<br>Assigned on: " + assigned_on,"order": 3,"stored-value": "L2_APPROVE"}]
            };
            F.getHeader().setWorkflowIndicator(finalstage);
            F.getHeader().showWorkflowIndicator();
        } else {
            finalstage = {
                "current-logical-stage": "L2_APPROVE",
                "total-stages": "4",
                "logical-stages": [
					{"description": "Initiation","order": 1,"stored-value": "CREATE_EDIT"}, 
					{"description": "Owner Review","order": 2,"stored-value": "OBJECT_EDITORS"}, 
					{"description": "Level 1 Approval","order": 3,"stored-value": "L1_APPROVE"}, 
					{"description": "Current Stage: Level 2 Approval<br>Assigned by: " + F.PLAN_APPROVER.readDisplayedValue() + "<br>Assigned on: " + assigned_on,"order": 4,"stored-value": "L2_APPROVE"}]
            };
            F.getHeader().setWorkflowIndicator(finalstage);
            F.getHeader().showWorkflowIndicator();
        }
    }
    /* In request for clarification stage with the initiator*/
    else if (currentStage === 'OBJECT_EDITORS' && F.PLAN_STATUS.read() !== 'REQ_CLR') {
            if (approver1IsSelected && !approver2IsSelected) {
                nol2Approverrfc = {
                    "current-logical-stage": "OBJECT_EDITORS",
                    "total-stages": "3",
                    "logical-stages": [
						{"description": "Initiation","order": 1,"stored-value": "CREATE_EDIT"}, 
						{"description": "Current Stage: Owner Review","order": 2,"stored-value": "OBJECT_EDITORS"}, 
						{"description": "Level 1 Approval","order": 3,"stored-value": "L1_APPROVE"}]
                };
                F.getHeader().setWorkflowIndicator(nol2Approverrfc);
                F.getHeader().showWorkflowIndicator();
            } else if (approver1IsSelected && approver2IsSelected) {
                l1l2Approverrfc = {
                    "current-logical-stage": "OBJECT_EDITORS",
                    "total-stages": "4",
                    "logical-stages": [
						{"description": "Initiation","order": 1,"stored-value": "CREATE_EDIT"}, 
						{"description": "Current Stage: Owner Review","order": 2,"stored-value": "OBJECT_EDITORS"}, 
						{"description": "Level 1 Approval","order": 3, "stored-value": "L1_APPROVE"}, 
						{"description": "Level 2 Approval","order": 4,"stored-value": "L2_APPROVE"}]
                };
                F.getHeader().setWorkflowIndicator(l1l2Approverrfc);
                F.getHeader().showWorkflowIndicator();
            }else if (!(approver1IsSelected && approver2IsSelected)) {
                nol1nol2Approverrfc = {
                    "current-logical-stage": "OBJECT_EDITORS",
                    "total-stages": "2",
                    "logical-stages": [
						{"description": "Initiation","order": 1,"stored-value": "CREATE_EDIT"}, 
						{"description": "Current Stage: Owner Review","order": 2,"stored-value": "OBJECT_EDITORS"}]
                };
                F.getHeader().setWorkflowIndicator(nol1nol2Approverrfc);
                F.getHeader().showWorkflowIndicator();
            }
    }else if (currentStage === 'OBJECT_EDITORS' && F.PLAN_STATUS.read() === 'REQ_CLR') {
			if (ownerIniSame || owner.length == 0) {
				if (approver1IsSelected && !approver2IsSelected) {
					nol2Approverrfc = {
						"current-logical-stage": "OBJECT_EDITORS",
						"total-stages": "2",
						"logical-stages": [
						{"description":"Current Stage: Initiation<br>Assigned by: "+assigned_by+"<br>Assigned on: "+assigned_on,"order":1,"stored-value":"OBJECT_EDITORS"}, 
						{"description": "Level 1 Approval","order": 2,"stored-value": "L1_APPROVE"}]
					};
					F.getHeader().setWorkflowIndicator(nol2Approverrfc);
					F.getHeader().showWorkflowIndicator();
				} else if (approver1IsSelected && approver2IsSelected) {
					l1l2Approverrfc = {
						"current-logical-stage": "OBJECT_EDITORS",
						"total-stages": "3",
						"logical-stages": [
						{"description":"Current Stage: Initiation<br>Assigned by: "+assigned_by+"<br>Assigned on: "+assigned_on,"order":1,"stored-value":"OBJECT_EDITORS"}, 
						{"description": "Level 1 Approval","order": 2, "stored-value": "L1_APPROVE"}, 
						{"description": "Level 2 Approval","order": 3,"stored-value": "L2_APPROVE"}]
					};
					F.getHeader().setWorkflowIndicator(l1l2Approverrfc);
					F.getHeader().showWorkflowIndicator();
				}
			} else {			
				if (approver1IsSelected && !approver2IsSelected) {
					nol2Approverrfc = {
						"current-logical-stage": "OBJECT_EDITORS",
						"total-stages": "3",
						"logical-stages": [
							{"description": "Initiation","order": 1,"stored-value": "CREATE_EDIT"}, 
							{"description":"Current Stage: Owner Review<br>Assigned by: "+assigned_by+"<br>Assigned on: "+assigned_on,"order":2,"stored-value":"OBJECT_EDITORS"}, 
							{"description": "Level 1 Approval","order": 3,"stored-value": "L1_APPROVE"}]
					};
					F.getHeader().setWorkflowIndicator(nol2Approverrfc);
					F.getHeader().showWorkflowIndicator();
				} else if (approver1IsSelected && approver2IsSelected) {
					l1l2Approverrfc = {
						"current-logical-stage": "OBJECT_EDITORS",
						"total-stages": "4",
						"logical-stages": [
							{"description": "Initiation","order": 1,"stored-value": "CREATE_EDIT"}, 
							{"description":"Current Stage: Owner Review<br>Assigned by: "+assigned_by+"<br>Assigned on: "+assigned_on,"order":2,"stored-value":"OBJECT_EDITORS"}, 
							{"description": "Level 1 Approval","order": 3, "stored-value": "L1_APPROVE"}, 
							{"description": "Level 2 Approval","order": 4,"stored-value": "L2_APPROVE"}]
					};
					F.getHeader().setWorkflowIndicator(l1l2Approverrfc);
					F.getHeader().showWorkflowIndicator();
			   }
			} 				
		}
}