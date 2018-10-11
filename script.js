 window.myCPP = window.myCPP || {};

    //replace with the CCP URL for the current Amazon Connect instance
    var ccpUrl = "https://perficientdemo.awsapps.com/connect/ccp#/";


    const CONFIG = 
          {
            "hiddenCA": ["contactsInQueue","agentsAvailable"]
          };



    connect.core.initCCP(containerDiv, {
        ccpUrl: ccpUrl,        
        loginPopup: true,         
        softphone: {
            allowFramedSoftphone: true
        }
    });

    connect.contact(subscribeToContactEvents);  
    

    function subscribeToContactEvents(contact) {
        window.myCPP.contact = contact;
        logInfoMsg("New contact offered. Subscribing to events for contact");
        if (contact.getActiveInitialConnection()
            && contact.getActiveInitialConnection().getEndpoint()) {
            logInfoMsg("New contact is from " + contact.getActiveInitialConnection().getEndpoint().phoneNumber);
        } else {
            logInfoMsg("This is an existing contact for this agent");
        }
        logInfoMsg("Contact is from queue " + contact.getQueue().name);    
        logInfoMsg("ContactID is " + contact.getContactId());   
        logInfoMsg("Contact attributes are " + JSON.stringify(contact.getAttributes()));
        
        updateContactAttribute(contact.getAttributes());    
        updateQueueAttribute(contact.getAttributes());
        contact.onEnded(clearContactAttribute);
        contact.onEnded(clearQueueAttribute);
        contact.onAccepted(clearQueueAttribute);
    }

    function updateContactAttribute(msg){
        var tableRef = document.getElementById('attributesTable').getElementsByTagName('tbody')[0];      
        for (var key in msg) {
           if (msg.hasOwnProperty(key) && CONFIG.hiddenCA.indexOf(key)==-1) {
                        var row = tableRef.insertRow(tableRef.rows.length);
                        var cell1 = row.insertCell(0);
                        var cell2 = row.insertCell(1);
                        cell1.innerHTML = key;
                        cell2.innerHTML = msg[key]['value'];
            }
        }
        
    }

    function updateQueueAttribute(msg){
        console.log(msg);
            var cell1 = document.getElementById('calls');
            var cell2 = document.getElementById('lwt');
            var cell3 = document.getElementById('availableAgents');
            var cell4 = document.getElementById('onlineAgents');
            cell1.innerHTML = msg.contactsInQueue.value;
            cell2.innerHTML = msg.agentsAvailable.value;
            cell3.innerHTML = msg.oldestContact.value;
            cell4.innerHTML = msg.agentsOnline.value;
        
        
    }


    function clearContactAttribute(){
        var old_tbody= document.getElementById('attributesTable').getElementsByTagName('tbody')[0];
        var new_tbody = document.createElement('tbody');    
        old_tbody.parentNode.replaceChild(new_tbody, old_tbody);     
    }

    function clearQueueAttribute(){
            var cell1 = document.getElementById('calls');
            var cell2 = document.getElementById('lwt');
            var cell3 = document.getElementById('availableAgents');
            var cell4 = document.getElementById('onlineAgents');
            cell1.innerHTML = " ";
            cell2.innerHTML = " ";
            cell3.innerHTML = " ";
            cell4.innerHTML = " ";
    }


    function logMsgToScreen(msg) {
        logMsgs.innerHTML =  new Date().toLocaleTimeString() + ' : ' + msg + '<br>' + logMsgs.innerHTML;
    }


    function logInfoMsg(msg) {
        connect.getLog().info(msg);
        logMsgToScreen(msg);
    }


// LogMessages section display controls

var showLogsBtn = document.getElementById('showAttributes');
var showLogsDiv = document.getElementById('hiddenAttributes');
var hideLogsBtn = document.getElementById('hideAttributes');
var hideLogsDiv = document.getElementById('visibleAttributes');


showLogsBtn.addEventListener('click',replaceDisplay);

hideLogsBtn.addEventListener('click',replaceDisplay);

    function replaceDisplay(){
            showLogsDiv.style.display = showLogsDiv.style.display === 'none' ? '' : 'none';
            hideLogsDiv.style.display = hideLogsDiv.style.display === 'none' ? '' : 'none';
    }

